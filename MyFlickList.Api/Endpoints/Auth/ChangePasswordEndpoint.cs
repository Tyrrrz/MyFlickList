using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Database;
using NSwag.Annotations;

namespace MyFlickList.Api.Endpoints.Auth
{
    public class ChangePasswordRequest
    {
        [Required]
        public string OldPassword { get; set; } = default!;

        [Required]
        [StringLength(1024, MinimumLength = 6)]
        public string NewPassword { get; set; } = default!;
    }

    public class ChangePasswordEndpoint : ApiControllerBase
    {
        private readonly DatabaseContext _database;

        public ChangePasswordEndpoint(DatabaseContext database)
        {
            _database = database;
        }

        [OpenApiTag("Auth")]
        [OpenApiOperation("changePassword")]
        [HttpPost("auth/changePassword")]
        [Authorize]
        [SuccessResponse(HttpStatusCode.OK)]
        [ValidationErrorResponse(HttpStatusCode.BadRequest)]
        [ErrorResponse(HttpStatusCode.Unauthorized)]
        public async Task<ActionResult> Action(
            ChangePasswordRequest request,
            CancellationToken cancellationToken = default)
        {
            var profileId = User.TryGetProfileId();

            var user = await _database.Users
                .AsTracking()
                .FirstOrDefaultAsync(u => u.Profile!.Id == profileId, cancellationToken);

            if (user == null)
            {
                return Error(
                    HttpStatusCode.Unauthorized,
                    "Cannot find matching user"
                );
            }

            if (!PasswordHash.Verify(user.PasswordHash, request.OldPassword))
            {
                return Error(
                    HttpStatusCode.Unauthorized,
                    "Provided old password is invalid"
                );
            }

            user.PasswordHash = PasswordHash.Generate(request.NewPassword);
            await _database.SaveChangesAsync(cancellationToken);

            return Success(HttpStatusCode.OK);
        }
    }
}