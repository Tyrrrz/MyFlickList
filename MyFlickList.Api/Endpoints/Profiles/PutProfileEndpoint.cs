using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Database;
using NSwag.Annotations;

namespace MyFlickList.Api.Endpoints.Profiles
{
    public class PutProfileRequest
    {
        public bool IsPublic { get; set; }

        public string? Location { get; set; }

        public string? Bio { get; set; }

        public IReadOnlyList<string>? ExternalLinks { get; set; }
    }

    public class PutProfileEndpoint : ApiControllerBase
    {
        private readonly DatabaseContext _database;

        public PutProfileEndpoint(DatabaseContext database)
        {
            _database = database;
        }

        [OpenApiTag("Profiles")]
        [OpenApiOperation("putProfile")]
        [HttpPut("profiles/{profileId}")]
        [Authorize]
        [SuccessResponse(HttpStatusCode.OK)]
        [ValidationErrorResponse(HttpStatusCode.BadRequest)]
        [ErrorResponse(HttpStatusCode.NotFound)]
        [ErrorResponse(HttpStatusCode.Forbidden)]
        public async Task<ActionResult> Action(
            int profileId,
            PutProfileRequest request,
            CancellationToken cancellationToken = default)
        {
            var profile = await _database.Profiles
                .AsTracking()
                .FirstOrDefaultAsync(p => p.Id == profileId, cancellationToken);

            // TODO: the following can be extracted
            if (profile == null)
            {
                return Error(
                    HttpStatusCode.NotFound,
                    $"Profile '{profileId}' not found"
                );
            }

            if (User.TryGetProfileId() != profileId)
            {
                return Error(
                    HttpStatusCode.Forbidden,
                    $"Profile '{profileId}' does not belong to the authenticated user"
                );
            }

            profile.IsPublic = request.IsPublic;
            profile.Location = request.Location;
            profile.Bio = request.Bio;
            profile.ExternalLinks = request.ExternalLinks?.ToArray() ?? Array.Empty<string>();

            await _database.SaveChangesAsync(cancellationToken);

            return Success(HttpStatusCode.OK);
        }
    }
}