﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
    public class GetFlickEntriesResponseItem
    {
        [Required]
        public ProfileFlickEntryStatus Status { get; set; }

        [Range(0, int.MaxValue)]
        public int? EpisodeCount { get; set; }

        [Range(0.0, 1.0)]
        public double? Rating { get; set; }

        [MaxLength(20_000)]
        public string? Review { get; set; }

        [Required]
        public int ProfileId { get; set; }

        [Required]
        public int FlickId { get; set; }

        [Required]
        public string FlickTitle { get; set; } = default!;

        public int? FlickCoverImageId { get; set; }
    }

    public class GetFlickEntriesMapping : Profile
    {
        public GetFlickEntriesMapping()
        {
            CreateMap<ProfileFlickEntryEntity, GetFlickEntriesResponseItem>()
                .ForMember(o => o.FlickTitle, x => x.MapFrom(o => o.Flick!.Title))
                .ForMember(o => o.FlickCoverImageId, x => x.MapFrom(o => o.Flick!.CoverImageId));
        }
    }

    public class GetFlickEntriesEndpoint : ApiControllerBase
    {
        private readonly DatabaseContext _database;
        private readonly IMapper _mapper;

        public GetFlickEntriesEndpoint(DatabaseContext database, IMapper mapper)
        {
            _database = database;
            _mapper = mapper;
        }

        [OpenApiTag("Profiles")]
        [OpenApiOperation("getFlickEntries")]
        [HttpGet("profiles/{profileId}/flicks")]
        [SuccessResponse(HttpStatusCode.OK)]
        [ValidationErrorResponse(HttpStatusCode.BadRequest)]
        [ErrorResponse(HttpStatusCode.NotFound)]
        [ErrorResponse(HttpStatusCode.Forbidden)]
        public async Task<ActionResult<PaginatedResponse<GetFlickEntriesResponseItem>>> Action(
            int profileId,
            CancellationToken cancellationToken = default)
        {
            var profile = await _database.Profiles
                .Include(p => p.FlickEntries)
                .ThenInclude(f => f.Flick)
                .FirstOrDefaultAsync(p => p.Id == profileId, cancellationToken);

            if (profile is null)
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

            // TODO: pagination
            return Success(
                HttpStatusCode.OK,
                PaginatedResponse.Create(_mapper.Map<GetFlickEntriesResponseItem[]>(profile.FlickEntries), 1, 1)
            );
        }
    }
}