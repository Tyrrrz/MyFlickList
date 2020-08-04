using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using MyFlickList.Api.Internal;
using MyFlickList.Api.Models;
using MyFlickList.Api.Models.Catalog;
using MyFlickList.Data;

namespace MyFlickList.Api.Controllers
{
    [ApiController]
    [Route("catalog")]
    public class CatalogController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;

        public CatalogController(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
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
            // TODO: order by rating
            var query = _dbContext.Flicks
                .OrderBy(f => f.Id)
                .ProjectTo<FlickResponse>(_mapper.ConfigurationProvider);

            var response = await PaginatedResponse.CreateAsync(query, page, 10);

            return Ok(response);
        }

        [HttpGet("flicks/trending")]
        [ProducesResponseType(typeof(PaginatedResponse<FlickListingResponse>), 200)]
        public async Task<IActionResult> GetTrendingFlicks(int page = 1)
        {
            // TODO: order by trendiness
            var query = _dbContext.Flicks
                .OrderByDescending(f => f.Id)
                .ProjectTo<FlickResponse>(_mapper.ConfigurationProvider);

            var response = await PaginatedResponse.CreateAsync(query, page, 10);

            return Ok(response);
        }

        [HttpGet("flicks/new")]
        [ProducesResponseType(typeof(PaginatedResponse<FlickListingResponse>), 200)]
        public async Task<IActionResult> GetNewFlicks(int page = 1)
        {
            var query = _dbContext.Flicks
                .Where(f => f.PremiereDate != null)
                .OrderByDescending(f => f.PremiereDate)
                .ProjectTo<FlickResponse>(_mapper.ConfigurationProvider);

            var response = await PaginatedResponse.CreateAsync(query, page, 10);

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
    }
}