using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Entities.Flicks;
using MyFlickList.Api.Internal;
using MyFlickList.Api.Models;
using MyFlickList.Api.Models.Flicks;
using MyFlickList.Api.Services;

namespace MyFlickList.Api.Controllers
{
    [ApiController]
    [Route("flicks")]
    public class FlicksController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ICatalogPopulator _catalogPopulator;

        public FlicksController(
            AppDbContext dbContext,
            IMapper mapper,
            ICatalogPopulator catalogPopulator)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _catalogPopulator = catalogPopulator;
        }

        [HttpGet("{flickId}")]
        [ProducesResponseType(typeof(FlickResponse), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetFlick(int flickId)
        {
            var cancellation = HttpContext.RequestAborted;

            var flick = await _dbContext.Flicks
                .ProjectTo<FlickResponse>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(f => f.Id == flickId, cancellation);

            if (flick == null)
            {
                return Problem(
                    statusCode: 404,
                    title: "Not Found",
                    detail: $"Flick '{flickId}' not found"
                );
            }

            return Ok(flick);
        }

        [HttpGet]
        [ProducesResponseType(typeof(PaginatedResponse<FlickListingResponse>), 200)]
        public async Task<IActionResult> GetFlicks(
            FlickOrder order = FlickOrder.Top,
            string? filterTag = null,
            int page = 1)
        {
            var cancellation = HttpContext.RequestAborted;

            IQueryable<FlickEntity> GetTopFlicks() =>
                _dbContext.Flicks
                    .Where(f => f.ExternalRating != null)
                    .OrderByDescending(f => f.ExternalRating);

            // TODO: actually sort by trendiness
            IQueryable<FlickEntity> GetTrendingFlicks() =>
                _dbContext.Flicks
                    .OrderByDescending(f => f.Id);

            IQueryable<FlickEntity> GetNewFlicks() =>
                _dbContext.Flicks
                    .Where(f => f.PremiereDate != null)
                    .OrderByDescending(f => f.PremiereDate);

            var flicksSource = order switch
            {
                FlickOrder.Top => GetTopFlicks(),
                FlickOrder.Trending => GetTrendingFlicks(),
                FlickOrder.New => GetNewFlicks(),
                _ => GetTopFlicks()
            };

            var flicksFiltered = flicksSource;

            if (!string.IsNullOrWhiteSpace(filterTag))
                flicksFiltered = flicksFiltered.Where(f => f.Tags.Any(t => t.Name.ToLower() == filterTag.ToLower()));

            var flicks = flicksFiltered
                .ProjectTo<FlickListingResponse>(_mapper.ConfigurationProvider);

            var response = await PaginatedResponse.FromQueryAsync(flicks, page, 10, cancellation);

            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(AddFlickResponse), 200)]
        [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> AddFlick(AddFlickRequest request)
        {
            var cancellation = HttpContext.RequestAborted;

            var imdbId = ImdbId.TryFromUrl(request.SourceUrl);
            if (string.IsNullOrWhiteSpace(imdbId))
            {
                return Problem(
                    statusCode: 400,
                    title: "Invalid URL",
                    detail: $"Provided URL '{request.SourceUrl}' is not a valid IMDB link"
                );
            }

            var flickId = await _catalogPopulator.PopulateFlickAsync(imdbId, cancellation);
            if (flickId == null)
            {
                return Problem(
                    statusCode: 404,
                    title: "Not Found",
                    detail: $"IMDB title '{imdbId}' not found"
                );
            }

            return Ok(new AddFlickResponse
            {
                FlickId = flickId.Value
            });
        }
    }
}