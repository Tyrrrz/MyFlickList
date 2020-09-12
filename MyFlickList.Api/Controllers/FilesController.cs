using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Internal;

namespace MyFlickList.Api.Controllers
{
    [ApiController]
    [Route("files")]
    public class FilesController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public FilesController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ResponseCache(Duration = Durations.SecondsIn.OneDay)]
        public async Task<IActionResult> GetFile(int id)
        {
            var cancellation = HttpContext.RequestAborted;

            var file = await _dbContext.Files
                .FirstOrDefaultAsync(f => f.Id == id, cancellation);

            if (file == null)
            {
                return Problem(
                    statusCode: 404,
                    title: "Not Found",
                    detail: $"File '{id}' not found"
                );
            }

            return File(file.Data, file.ContentType);
        }
    }
}