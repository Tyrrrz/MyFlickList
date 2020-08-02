﻿using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Internal;
using MyFlickList.Data;
using MyFlickList.Data.Entities.Catalog;

namespace MyFlickList.Api.Controllers
{
    [ApiController]
    [Route("catalog")]
    public class CatalogController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public CatalogController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [ProducesResponseType(typeof(FlickEntity[]), 200)]
        public async Task<IActionResult> GetAll()
        {
            // Temporary
            var flicks = await _dbContext.Flicks
                .Include(f => f.TagLinks)
                .Include(f => f.Resources)
                .Include(f => f.Characters)
                .Include(f => f.Listed)
                .ToArrayAsync();

            return Ok(flicks);
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
    }
}