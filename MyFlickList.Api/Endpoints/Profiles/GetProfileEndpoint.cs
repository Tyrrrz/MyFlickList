using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Database;
using MyFlickList.Api.Database.Auth;
using MyFlickList.Api.Database.Profiles;
using NSwag.Annotations;

namespace MyFlickList.Api.Endpoints.Profiles
{
    public class GetProfileResponse
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public UserRole Role { get; set; }

        [Required]
        public bool IsPublic { get; set; }

        [Required]
        public string Name { get; set; } = default!;

        public string? Location { get; set; }

        public string? Bio { get; set; }

        public IReadOnlyList<string>? ExternalLinks { get; set; }

        public int? AvatarImageId { get; set; }
    }

    public class GetProfileMapping : Profile
    {
        public GetProfileMapping()
        {
            CreateMap<ProfileEntity, GetProfileResponse>()
                .ForMember(o => o.Name, x => x.MapFrom(o => o.User!.Username))
                .ForMember(o => o.Role, x => x.MapFrom(o => o.User!.Role));
        }
    }

    public class GetProfileEndpoint : ApiControllerBase
    {
        private readonly DatabaseContext _database;
        private readonly IMapper _mapper;

        public GetProfileEndpoint(DatabaseContext database, IMapper mapper)
        {
            _database = database;
            _mapper = mapper;
        }

        [OpenApiTag("Profiles")]
        [OpenApiOperation("getProfile")]
        [HttpGet("profiles/{profileId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        [ProducesResponseType(typeof(ProblemDetails), 403)]
        public async Task<ActionResult<GetProfileResponse>> Action(
            int profileId,
            CancellationToken cancellationToken = default)
        {
            var profile = await _database.Profiles
                .ProjectTo<GetProfileResponse>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(p => p.Id == profileId, cancellationToken);

            if (profile == null)
            {
                return Error(
                    HttpStatusCode.NotFound,
                    $"Profile '{profileId}' not found"
                );
            }

            if (!profile.IsPublic && User.TryGetProfileId() != profileId)
            {
                return Error(
                    HttpStatusCode.Forbidden,
                    $"Profile '{profileId}' is not public"
                );
            }

            return Ok(profile);
        }
    }
}