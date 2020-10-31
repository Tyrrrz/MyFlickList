using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Database;
using MyFlickList.Api.Database.Flicks;
using MyFlickList.Api.Internal;
using MyFlickList.Api.Services;
using MyFlickList.Api.Transport.Models;
using MyFlickList.Api.Transport.Models.Flicks;

namespace MyFlickList.Api.Transport
{
    [ApiController]
    [Route("flicks")]
    public class FlicksController : ControllerBase
    {
        private readonly DatabaseContext _database;
        private readonly IMapper _mapper;
        private readonly ICatalogPopulator _catalogPopulator;

        public FlicksController(
            DatabaseContext database,
            IMapper mapper,
            ICatalogPopulator catalogPopulator)
        {
            _database = database;
            _mapper = mapper;
            _catalogPopulator = catalogPopulator;
        }

        [HttpGet("{flickId}")]
        [ProducesResponseType(typeof(FlickResponse), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetFlick(
            int flickId,
            CancellationToken cancellationToken = default)
        {
            var flick = await _database.Flicks
                .ProjectTo<FlickResponse>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(f => f.Id == flickId, cancellationToken);

            if (flick == null)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.NotFound,
                    $"Flick '{flickId}' not found"
                );
            }

            return Ok(flick);
        }

        [HttpGet]
        [ProducesResponseType(typeof(PaginatedResponse<FlickListingResponse>), 200)]
        public async Task<IActionResult> GetFlicks(
            FlickOrder order = FlickOrder.Top,
            string? filterTag = null,
            int page = 1,
            CancellationToken cancellationToken = default)
        {
            IQueryable<FlickEntity> GetTopFlicks() =>
                _database.Flicks
                    .Where(f => f.ExternalRating != null)
                    .OrderByDescending(f => f.ExternalRating);

            // TODO: actually sort by trendiness
            IQueryable<FlickEntity> GetTrendingFlicks() =>
                _database.Flicks
                    .OrderByDescending(f => f.Id);

            IQueryable<FlickEntity> GetNewFlicks() =>
                _database.Flicks
                    .Where(f => f.FirstAired != null)
                    .OrderByDescending(f => f.FirstAired);

            var flicksSource = order switch
            {
                FlickOrder.Top => GetTopFlicks(),
                FlickOrder.Trending => GetTrendingFlicks(),
                FlickOrder.New => GetNewFlicks(),
                _ => GetTopFlicks()
            };

            var flicksFiltered = flicksSource;

            if (!string.IsNullOrWhiteSpace(filterTag))
                flicksFiltered = flicksFiltered.Where(f => f.Tags.Contains(filterTag));

            var flicks = flicksFiltered
                .ProjectTo<FlickListingResponse>(_mapper.ConfigurationProvider);

            return Ok(
                await PaginatedResponse.FromQueryAsync(flicks, page, 10, cancellationToken)
            );
        }

        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(AddFlickResponse), 200)]
        [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        public async Task<IActionResult> AddFlick(
            AddFlickRequest request,
            CancellationToken cancellationToken = default)
        {
            var imdbId = ImdbId.TryParseFromUrl(request.SourceUrl);
            if (string.IsNullOrWhiteSpace(imdbId))
            {
                return ErrorResponse.Create(
                    HttpStatusCode.BadRequest,
                    $"Provided URL '{request.SourceUrl}' is not a valid IMDB link"
                );
            }

            var flickId = await _catalogPopulator.PopulateFlickAsync(imdbId, cancellationToken);
            if (flickId == null)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.NotFound,
                    $"IMDB title '{imdbId}' not found"
                );
            }

            return Ok(new AddFlickResponse
            {
                FlickId = flickId.Value
            });
        }
    }
}