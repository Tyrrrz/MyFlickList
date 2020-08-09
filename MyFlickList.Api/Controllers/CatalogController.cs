using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using MyFlickList.Api.Internal;
using MyFlickList.Api.Models;
using MyFlickList.Api.Models.Catalog;
using MyFlickList.Api.Services;

namespace MyFlickList.Api.Controllers
{
    [ApiController]
    [Route("catalog")]
    public class CatalogController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ICatalogPopulator _catalogPopulator;

        public CatalogController(AppDbContext dbContext, IMapper mapper, ICatalogPopulator catalogPopulator)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _catalogPopulator = catalogPopulator;
        }

        [HttpGet("images/{imageId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ResponseCache(Duration = CacheDurations.OneDay)]
        public async Task<IActionResult> GetImage(Guid imageId)
        {
            var image = await _dbContext.Images.FindAsync(imageId);
            if (image == null)
                return NotFound();

            return File(image.Data, image.ContentType);
        }

        [HttpGet("flicks/top")]
        [ProducesResponseType(typeof(PaginatedResponse<FlickListingResponse>), 200)]
        public async Task<IActionResult> GetTopFlicks(int page = 1)
        {
            var flicks = _dbContext.Flicks
                .Where(f => f.ExternalRating != null)
                .OrderByDescending(f => f.ExternalRating)
                .Take(100)
                .ProjectTo<FlickResponse>(_mapper.ConfigurationProvider);

            var response = await PaginatedResponse.CreateAsync(flicks, page, 10);

            return Ok(response);
        }

        [HttpGet("flicks/trending")]
        [ProducesResponseType(typeof(PaginatedResponse<FlickListingResponse>), 200)]
        public async Task<IActionResult> GetTrendingFlicks(int page = 1)
        {
            // TODO: order by trendiness
            var flicks = _dbContext.Flicks
                .OrderByDescending(f => f.Id)
                .Take(100)
                .ProjectTo<FlickResponse>(_mapper.ConfigurationProvider);

            var response = await PaginatedResponse.CreateAsync(flicks, page, 10);

            return Ok(response);
        }

        [HttpGet("flicks/new")]
        [ProducesResponseType(typeof(PaginatedResponse<FlickListingResponse>), 200)]
        public async Task<IActionResult> GetNewFlicks(int page = 1)
        {
            var flicks = _dbContext.Flicks
                .Where(f => f.PremiereDate != null)
                .OrderByDescending(f => f.PremiereDate)
                .Take(100)
                .ProjectTo<FlickResponse>(_mapper.ConfigurationProvider);

            var response = await PaginatedResponse.CreateAsync(flicks, page, 10);

            return Ok(response);
        }

        [HttpGet("flicks/search")]
        [ProducesResponseType(typeof(PaginatedResponse<FlickListingResponse>), 200)]
        public async Task<IActionResult> SearchFlicks(string query, int page = 1)
        {
            var querySanitized = query.ToLower().Trim();

            var flicks = _dbContext.Flicks
                // Match flick titles that contain the query (strip accents for "Pokemon" -> "Pokémon")
                .Where(f => Postgres.Unaccent(f.Title.ToLower()).Contains(Postgres.Unaccent(querySanitized)))
                // Order by how similar the strings are, in terms of length
                .OrderBy(f => f.Title.Length - querySanitized.Length)
                .Take(100)
                .ProjectTo<FlickResponse>(_mapper.ConfigurationProvider);

            var response = await PaginatedResponse.CreateAsync(flicks, page, 10);

            return Ok(response);
        }

        [HttpGet("flicks/{flickId}")]
        [ProducesResponseType(typeof(FlickResponse), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetFlick(string flickId)
        {
            var flick = await _dbContext.Flicks.FindAsync(flickId);
            if (flick == null)
                return NotFound();

            var response = _mapper.Map<FlickResponse>(flick);

            return Ok(response);
        }

        [HttpPost("flicks/{flickId}")]
        [ProducesResponseType(201)]
        [ProducesResponseType(409)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> RequestFlick(string flickId) => await HandleExceptionsAsync(async () =>
        {
            await _catalogPopulator.PopulateFlickAsync(flickId);
            return CreatedAtAction(nameof(GetFlick), new {flickId}, null);
        });
    }
}