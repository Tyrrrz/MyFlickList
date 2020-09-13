using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Internal;
using MyFlickList.Api.Models.Flicks;
using MyFlickList.Api.Models.Profiles;
using MyFlickList.Api.Models.Search;

namespace MyFlickList.Api.Controllers
{
    [ApiController]
    [Route("search")]
    public class SearchController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;

        public SearchController(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(SearchResponse), 200)]
        public async Task<IActionResult> GetResults(string query)
        {
            var cancellation = HttpContext.RequestAborted;

            var queryNormalized = query.ToLower().Trim();

            var flicks = await _dbContext.Flicks
                // Match flick titles that contain the query (strip accents for "Pokemon" -> "Pokémon")
                // TODO: replace with collations
                .Where(f =>
                    Postgres.Functions.Unaccent(f.Title.ToLower()).Contains(Postgres.Functions.Unaccent(queryNormalized)) ||
                    f.OriginalTitle != null && Postgres.Functions.Unaccent(f.OriginalTitle.ToLower())
                        .Contains(Postgres.Functions.Unaccent(queryNormalized))
                )
                // Order by how similar the strings are, in terms of length
                .OrderBy(f => f.Title.Length - queryNormalized.Length)
                .Take(10)
                .ProjectTo<FlickListingResponse>(_mapper.ConfigurationProvider)
                .ToArrayAsync(cancellation);

            var profiles = await _dbContext.Profiles
                .Where(p => p.IsPublic)
                // TODO: replace with collations
                .Where(p => p.User!.Username.ToLower().Contains(queryNormalized))
                // Order by how similar the strings are, in terms of length
                .OrderBy(p => p.User!.Username.Length - queryNormalized.Length)
                .Take(10)
                .ProjectTo<ProfileListingResponse>(_mapper.ConfigurationProvider)
                .ToArrayAsync(cancellation);

            return Ok(new SearchResponse
            {
                Flicks = flicks,
                Profiles = profiles
            });
        }
    }
}