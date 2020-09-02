using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MyFlickList.Api.Entities.Auth;
using MyFlickList.Api.Entities.Profiles;
using MyFlickList.Api.Internal;
using MyFlickList.Api.Internal.Extensions;
using MyFlickList.Api.Models.Auth;

namespace MyFlickList.Api.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _dbContext;

        public AuthController(IConfiguration configuration, AppDbContext dbContext)
        {
            _configuration = configuration;
            _dbContext = dbContext;
        }

        [HttpPost("signup")]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> SignUp(SignUpRequest request)
        {
            var cancellation = HttpContext.RequestAborted;

            var user = new UserEntity
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = PasswordHash.Generate(request.Password),
                Profile = new ProfileEntity
                {
                    Name = request.Username
                }
            };

            try
            {
                await _dbContext.Users.AddAsync(user, cancellation);
                await _dbContext.SaveChangesAsync(cancellation);
            }
            // TODO: better handling for exceptions on duplicate usernames/emails (as mandated by indexes)
            catch (Exception ex)
            {
                return Problem(
                    statusCode: 400,
                    title: "Error",
                    detail: ex.Message
                );
            }

            return CreatedAtAction(nameof(SignIn), null);
        }

        [HttpPost("signin")]
        [ProducesResponseType(typeof(SignInResponse), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> SignIn(SignInRequest request)
        {
            var cancellation = HttpContext.RequestAborted;

            var user = await _dbContext.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Username == request.Username, cancellation);

            if (user == null)
            {
                return Problem(
                    statusCode: 401,
                    title: "Invalid credentials",
                    detail: "Provided username is invalid"
                );
            }

            if (!PasswordHash.Verify(user.PasswordHash, request.Password))
            {
                return Problem(
                    statusCode: 401,
                    title: "Invalid credentials",
                    detail: "Provided password is invalid"
                );
            }

            var claims = new[]
            {
                new Claim("jti", Guid.NewGuid().ToString()),
                new Claim("sub", user.Id.ToString()),
                new Claim("preferred_username", user.Username),
                new Claim("email", user.Email),
                new Claim("email_verified", user.IsEmailConfirmed.ToString()),
                new Claim("mfl_profile_id", user.Profile!.Id.ToString()),
            };

            var token = Jwt.Generate(
                _configuration.GetJwtIssuer(),
                _configuration.GetJwtSecret(),
                _configuration.GetJwtExpiration(),
                claims
            );

            return Ok(new SignInResponse
            {
                Token = token
            });
        }
    }
}