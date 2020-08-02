using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Internal;
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
        [ProducesResponseType(typeof(FlickListingResponse[]), 200)]
        public async Task<IActionResult> GetTopFlicks(int offset = 0, [Range(1, 20)] int count = 20)
        {
            // TODO: order by rating
            var flicks = await _dbContext.Flicks
                .Skip(offset)
                .Take(count)
                .ProjectTo<FlickResponse>(_mapper.ConfigurationProvider)
                .ToArrayAsync();

            return Ok(flicks);
        }

        [HttpGet("flicks/trending")]
        [ProducesResponseType(typeof(FlickListingResponse[]), 200)]
        public async Task<IActionResult> GetTrendingFlicks(int offset = 0, [Range(1, 20)] int count = 20)
        {
            // TODO: order by trendiness
            var flicks = await _dbContext.Flicks
                .Skip(offset)
                .Take(count)
                .ProjectTo<FlickResponse>(_mapper.ConfigurationProvider)
                .ToArrayAsync();

            return Ok(flicks);
        }

        [HttpGet("flicks/new")]
        [ProducesResponseType(typeof(FlickListingResponse[]), 200)]
        public async Task<IActionResult> GetNewFlicks(int offset = 0, [Range(1, 20)] int count = 20)
        {
            var flicks = await _dbContext.Flicks
                .Where(f => f.PremiereDate != null)
                .OrderByDescending(f => f.PremiereDate)
                .Skip(offset)
                .Take(count)
                .ProjectTo<FlickResponse>(_mapper.ConfigurationProvider)
                .ToArrayAsync();

            return Ok(flicks);
        }
    }
}