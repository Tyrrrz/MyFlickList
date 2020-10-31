using System;
using System.Net;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MyFlickList.Api.Database;
using MyFlickList.Api.Database.Auth;
using MyFlickList.Api.Database.Profiles;
using MyFlickList.Api.Internal;
using MyFlickList.Api.Internal.Extensions;
using MyFlickList.Api.Transport.Models;
using MyFlickList.Api.Transport.Models.Auth;

namespace MyFlickList.Api.Transport
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DatabaseContext _database;

        public AuthController(IConfiguration configuration, DatabaseContext database)
        {
            _configuration = configuration;
            _database = database;
        }

        [HttpPost("signup")]
        [ProducesResponseType(201)]
        [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
        public async Task<IActionResult> SignUp(
            SignUpRequest request,
            CancellationToken cancellationToken = default)
        {
            var user = new UserEntity
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = PasswordHash.Generate(request.Password),
                Profile = new ProfileEntity()
            };

            try
            {
                await _database.Users.AddAsync(user, cancellationToken);
                await _database.SaveChangesAsync(cancellationToken);
            }
            // TODO: better handling for exceptions on duplicate usernames/emails (as mandated by indexes)
            catch (Exception ex)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.BadRequest,
                    ex.Message
                );
            }

            return CreatedAtAction(nameof(SignIn), null);
        }

        [HttpPost("signin")]
        [ProducesResponseType(typeof(SignInResponse), 200)]
        [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<IActionResult> SignIn(
            SignInRequest request,
            CancellationToken cancellationToken = default)
        {
            var user = await _database.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);

            if (user == null)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.Unauthorized,
                    "Provided username is invalid"
                );
            }

            if (!PasswordHash.Verify(user.PasswordHash, request.Password))
            {
                return ErrorResponse.Create(
                    HttpStatusCode.Unauthorized,
                    "Provided password is invalid"
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