using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyFlickList.Api.Entities.Auth;
using MyFlickList.Api.Internal;
using MyFlickList.Domain.Gravatar;

namespace MyFlickList.Api.Controllers
{
    [ApiController]
    [Route("profile")]
    public class ProfileController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly AppDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IMapper _mapper;

        public ProfileController(
            IHttpClientFactory httpClientFactory,
            AppDbContext dbContext,
            UserManager<UserEntity> userManager,
            IMapper mapper)
        {
            _httpClientFactory = httpClientFactory;
            _dbContext = dbContext;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet("{username}/avatar")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ResponseCache(Duration = CacheDurations.OneDay)]
        public async Task<IActionResult> GetAvatar(string username)
        {
            // TODO: add custom avatars (only gravatar for now)

            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
                return NotFound();

            var gravatar = new GravatarClient(_httpClientFactory.CreateClient());
            var avatar = await gravatar.GetAvatarAsync(user.Email);

            return File(avatar.Content, avatar.ContentType);
        }
    }
}