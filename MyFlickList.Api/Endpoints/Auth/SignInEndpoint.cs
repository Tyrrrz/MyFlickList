using System;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MyFlickList.Api.Database;
using MyFlickList.Api.Internal;
using NSwag.Annotations;

namespace MyFlickList.Api.Endpoints.Auth
{
    public class SignInRequest
    {
        [Required]
        public string Username { get; set; } = default!;

        [Required]
        public string Password { get; set; } = default!;
    }

    public class SignInResponse
    {
        [Required]
        public string Token { get; set; } = default!;
    }

    public class SignInEndpoint : ApiControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DatabaseContext _database;

        public SignInEndpoint(IConfiguration configuration, DatabaseContext database)
        {
            _configuration = configuration;
            _database = database;
        }

        [OpenApiTag("Auth")]
        [OpenApiOperation("signIn")]
        [HttpPost("auth/signin")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 401)]
        public async Task<ActionResult<SignInResponse>> Action(
            SignInRequest request,
            CancellationToken cancellationToken = default)
        {
            var user = await _database.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);

            if (user == null)
            {
                return Error(
                    HttpStatusCode.Unauthorized,
                    "Provided username is invalid"
                );
            }

            if (!PasswordHash.Verify(user.PasswordHash, request.Password))
            {
                return Error(
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