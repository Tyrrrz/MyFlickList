using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Database;
using NSwag.Annotations;

namespace MyFlickList.Api.Endpoints.Files
{
    public class GetFileEndpoint : ApiControllerBase
    {
        private readonly DatabaseContext _database;

        public GetFileEndpoint(DatabaseContext database)
        {
            _database = database;
        }

        [OpenApiTag("Files")]
        [OpenApiOperation("getFile")]
        [HttpGet("files/{fileId}")]
        [SuccessResponse(HttpStatusCode.OK)]
        [ErrorResponse(HttpStatusCode.NotFound)]
        [ResponseCache(Duration = Durations.SecondsIn.OneDay)]
        public async Task<ActionResult> Action(
            int fileId,
            CancellationToken cancellationToken = default)
        {
            var file = await _database.Files
                .FirstOrDefaultAsync(f => f.Id == fileId, cancellationToken);

            if (file == null)
            {
                return Error(
                    HttpStatusCode.NotFound,
                    $"File '{fileId}' not found"
                );
            }

            return Success(HttpStatusCode.OK, file.ContentType, file.Data);
        }
    }
}