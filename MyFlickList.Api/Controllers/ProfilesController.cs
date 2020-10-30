using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Internal.Extensions;
using MyFlickList.Api.Models.Flicks;
using MyFlickList.Api.Models.Profiles;

namespace MyFlickList.Api.Controllers
{
    [ApiController]
    [Route("profiles")]
    public class ProfilesController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;

        public ProfilesController(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        [HttpGet("{profileId}")]
        [ProducesResponseType(typeof(ProfileResponse), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        [ProducesResponseType(typeof(ProblemDetails), 403)]
        public async Task<IActionResult> GetProfile(int profileId)
        {
            var cancellation = HttpContext.RequestAborted;

            var profile = await _dbContext.Profiles
                .ProjectTo<ProfileResponse>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(p => p.Id == profileId, cancellation);

            if (profile == null)
            {
                return Problem(
                    statusCode: 404,
                    title: "Not Found",
                    detail: $"Profile '{profileId}' not found"
                );
            }

            if (!profile.IsPublic && User.TryGetProfileId() != profileId)
            {
                return Problem(
                    statusCode: 403,
                    title: "Private",
                    detail: $"Profile '{profileId}' is not public"
                );
            }

            // TODO: temp
            profile.FavoriteFlicks = await _dbContext.Flicks
                .OrderBy(f => f.ExternalRating)
                .ProjectTo<FlickListingResponse>(_mapper.ConfigurationProvider)
                .ToArrayAsync(cancellation);

            return Ok(profile);
        }

        [HttpPut("{profileId}")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        [ProducesResponseType(typeof(ProblemDetails), 403)]
        public async Task<IActionResult> UpdateProfile(int profileId, UpdateProfileRequest request)
        {
            var cancellation = HttpContext.RequestAborted;

            var profile = await _dbContext.Profiles
                .AsTracking()
                .FirstOrDefaultAsync(p => p.Id == profileId, cancellation);

            if (profile == null)
            {
                return Problem(
                    statusCode: 404,
                    title: "Not Found",
                    detail: $"Profile '{profileId}' not found"
                );
            }

            if (User.TryGetProfileId() != profileId)
            {
                return Problem(
                    statusCode: 403,
                    title: "Forbidden",
                    detail: $"Profile '{profileId}' does not belong to the authenticated user"
                );
            }

            profile.IsPublic = request.IsPublic;
            profile.Location = request.Location;
            profile.Bio = request.Bio;
            profile.ExternalLinks = request.ExternalLinks?.ToArray() ?? Array.Empty<string>();

            await _dbContext.SaveChangesAsync(cancellation);

            return Ok();
        }
    }
}