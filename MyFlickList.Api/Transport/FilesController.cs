using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Database;
using MyFlickList.Api.Internal;
using MyFlickList.Api.Transport.Models;

namespace MyFlickList.Api.Transport
{
    [ApiController]
    [Route("files")]
    public class FilesController : ControllerBase
    {
        private readonly DatabaseContext _database;

        public FilesController(DatabaseContext database)
        {
            _database = database;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ResponseCache(Duration = Durations.SecondsIn.OneDay)]
        public async Task<IActionResult> Get(
            int id,
            CancellationToken cancellationToken = default)
        {
            var file = await _database.Files
                .FirstOrDefaultAsync(f => f.Id == id, cancellationToken);

            if (file == null)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.NotFound,
                    $"File '{id}' not found"
                );
            }

            return File(file.Data, file.ContentType);
        }
    }
}