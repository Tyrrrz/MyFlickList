using System;
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
using MyFlickList.Api.Database.Flicks;
using NSwag.Annotations;

namespace MyFlickList.Api.Endpoints.Flicks
{
    public class GetFlickResponse
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public FlickKind Kind { get; set; }

        [Required]
        public string ImdbId { get; set; } = default!;

        [Required]
        public string Title { get; set; } = default!;

        public string? OriginalTitle { get; set; }

        public DateTimeOffset? FirstAired { get; set; }

        public DateTimeOffset? LastAired { get; set; }

        public int? EpisodeCount { get; set; }

        public TimeSpan? Runtime { get; set; }

        public double? ExternalRating { get; set; }

        public string? Synopsis { get; set; }

        public IReadOnlyList<string>? Tags { get; set; }

        public IReadOnlyList<string>? ExternalLinks { get; set; }

        public int? CoverImageId { get; set; }
    }

    public class GetFlickMapping : Profile
    {
        public GetFlickMapping()
        {
            CreateMap<FlickEntity, GetFlickResponse>();
        }
    }

    public class GetFlickEndpoint : ApiControllerBase
    {
        private readonly DatabaseContext _database;
        private readonly IMapper _mapper;

        public GetFlickEndpoint(DatabaseContext database, IMapper mapper)
        {
            _database = database;
            _mapper = mapper;
        }

        [OpenApiTag("Flicks")]
        [OpenApiOperation("getFlick")]
        [HttpGet("flicks/{flickId}")]
        [SuccessResponse(HttpStatusCode.OK)]
        [ErrorResponse(HttpStatusCode.NotFound)]
        public async Task<ActionResult<GetFlickResponse>> Action(
            int flickId,
            CancellationToken cancellationToken = default)
        {
            var flick = await _database.Flicks
                .ProjectTo<GetFlickResponse>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(f => f.Id == flickId, cancellationToken);

            if (flick is null)
            {
                return Error(
                    HttpStatusCode.NotFound,
                    $"Flick '{flickId}' not found"
                );
            }

            return Success(HttpStatusCode.OK, flick);
        }
    }
}