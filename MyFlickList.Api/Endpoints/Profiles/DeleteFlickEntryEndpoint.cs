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
    public class DeleteFlickEntryEndpoint : ApiControllerBase
    {
        private readonly DatabaseContext _database;

        public DeleteFlickEntryEndpoint(DatabaseContext database)
        {
            _database = database;
        }

        [OpenApiTag("Profiles")]
        [OpenApiOperation("deleteFlickEntry")]
        [HttpDelete("profiles/{profileId}/flicks/{flickId}")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        [ProducesResponseType(typeof(ProblemDetails), 403)]
        public async Task<ActionResult> Action(
            int profileId,
            int flickId,
            CancellationToken cancellationToken = default)
        {
            var profile = await _database.Profiles
                .AsTracking()
                .Include(p => p.FlickEntries)
                .FirstOrDefaultAsync(p => p.Id == profileId, cancellationToken);

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

            var flickEntry = profile.FlickEntries.FirstOrDefault(f => f.FlickId == flickId);
            if (flickEntry != null)
            {
                profile.FlickEntries.Remove(flickEntry);
                _database.ProfileFlickEntries.Remove(flickEntry);
                await _database.SaveChangesAsync(cancellationToken);
            }

            return Ok();
        }
    }
}