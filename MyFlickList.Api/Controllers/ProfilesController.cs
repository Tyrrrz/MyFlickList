using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Internal;
using MyFlickList.Api.Models.Profiles;
using MyFlickList.Domain.Gravatar;

namespace MyFlickList.Api.Controllers
{
    [ApiController]
    [Route("profiles")]
    public class ProfilesController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;

        public ProfilesController(
            IHttpClientFactory httpClientFactory,
            AppDbContext dbContext,
            IMapper mapper)
        {
            _httpClientFactory = httpClientFactory;
            _dbContext = dbContext;
            _mapper = mapper;
        }

        [HttpGet("{profileId}")]
        [ProducesResponseType(typeof(ProfileResponse), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> GetProfile(int profileId)
        {
            var cancellation = HttpContext.RequestAborted;

            var profile = await _dbContext.Profiles
                .FirstOrDefaultAsync(p => p.Id == profileId, cancellation);

            if (profile == null)
            {
                return Problem(
                    statusCode: 404,
                    title: "Not Found",
                    detail: $"Profile '{profileId}' not found"
                );
            }

            if (!profile.IsPublic)
            {
                return Problem(
                    statusCode: 403,
                    title: "Private",
                    detail: $"Profile '{profileId}' is not public"
                );
            }

            var response = _mapper.Map<ProfileResponse>(profile);

            return Ok(response);
        }

        [HttpGet("{profileId}/avatar")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(403)]
        [ResponseCache(Duration = Durations.OneDay)]
        public async Task<IActionResult> GetAvatar(int profileId)
        {
            // TODO: add custom avatars (only gravatar for now)

            var cancellation = HttpContext.RequestAborted;

            var profile = await _dbContext.Profiles
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == profileId, cancellation);

            if (profile == null)
            {
                return Problem(
                    statusCode: 404,
                    title: "Not Found",
                    detail: $"Profile '{profileId}' not found"
                );
            }

            if (!profile.IsPublic)
            {
                return Problem(
                    statusCode: 403,
                    title: "Private",
                    detail: $"Profile '{profileId}' is not public"
                );
            }

            var gravatar = new GravatarClient(_httpClientFactory.CreateClient());
            var avatar = await gravatar.GetAvatarAsync(profile.User!.Email, cancellation);

            return File(avatar.Data, avatar.ContentType);
        }
    }
}