using System;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyFlickList.Api.Database;
using MyFlickList.Api.Database.Auth;
using MyFlickList.Api.Database.Profiles;
using NSwag.Annotations;

namespace MyFlickList.Api.Endpoints.Auth
{
    public class SignUpRequest
    {
        [Required]
        [RegularExpression("^[a-zA-Z0-9_\\-]+$")]
        [StringLength(48, MinimumLength = 3)]
        public string Username { get; set; } = default!;

        [Required]
        [EmailAddress]
        [StringLength(256)]
        public string Email { get; set; } = default!;

        [Required]
        [StringLength(1024, MinimumLength = 6)]
        public string Password { get; set; } = default!;
    }

    public class SignUpEndpoint : ApiControllerBase
    {
        private readonly DatabaseContext _database;

        public SignUpEndpoint(DatabaseContext database)
        {
            _database = database;
        }

        [OpenApiTag("Auth")]
        [OpenApiOperation("signUp")]
        [HttpPost("auth/signup")]
        [SuccessResponse(HttpStatusCode.OK)]
        [ValidationErrorResponse(HttpStatusCode.BadRequest)]
        public async Task<ActionResult> Action(
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
                return Error(
                    HttpStatusCode.BadRequest,
                    ex.Message
                );
            }

            return Success(HttpStatusCode.OK);
        }
    }
}