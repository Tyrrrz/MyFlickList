using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Database;
using MyFlickList.Api.Database.Profiles;
using NSwag.Annotations;

namespace MyFlickList.Api.Endpoints.Profiles
{
    public class GetFlickEntryResponse
    {
        [Required]
        public ProfileFlickEntryStatus Status { get; set; }

        public int? EpisodeCount { get; set; }

        public double? Rating { get; set; }

        public string? Review { get; set; }

        [Required]
        public int ProfileId { get; set; }

        [Required]
        public int FlickId { get; set; }

        [Required]
        public string FlickTitle { get; set; } = default!;

        public int? FlickCoverImageId { get; set; }
    }

    public class GetFlickEntryMapping : Profile
    {
        public GetFlickEntryMapping()
        {
            CreateMap<ProfileFlickEntryEntity, GetFlickEntryResponse>()
                .ForMember(o => o.FlickTitle, x => x.MapFrom(o => o.Flick!.Title))
                .ForMember(o => o.FlickCoverImageId, x => x.MapFrom(o => o.Flick!.CoverImageId));
        }
    }

    public class GetFlickEntryEndpoint : ApiControllerBase
    {
        private readonly DatabaseContext _database;
        private readonly IMapper _mapper;

        public GetFlickEntryEndpoint(DatabaseContext database, IMapper mapper)
        {
            _database = database;
            _mapper = mapper;
        }

        [OpenApiTag("Profiles")]
        [OpenApiOperation("getFlickEntry")]
        [HttpGet("profiles/{profileId}/flicks/{flickId}")]
        [SuccessResponse(HttpStatusCode.OK)]
        [ValidationErrorResponse(HttpStatusCode.BadRequest)]
        [ErrorResponse(HttpStatusCode.NotFound)]
        [ErrorResponse(HttpStatusCode.Forbidden)]
        public async Task<ActionResult<GetFlickEntryResponse>> Action(
            int profileId,
            int flickId,
            CancellationToken cancellationToken = default)
        {
            var profile = await _database.Profiles
                .Include(p => p.FlickEntries)
                .ThenInclude(f => f.Flick)
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

            var flickEntry = profile.FlickEntries.FirstOrDefault(f => f.FlickId == flickId);
            if (flickEntry == null)
            {
                return Error(
                    HttpStatusCode.NotFound,
                    $"Entry for flick '{flickId}' on profile '{flickId}' not found"
                );
            }

            return Success(
                HttpStatusCode.OK,
                _mapper.Map<GetFlickEntryResponse>(flickEntry)
            );
        }
    }
}