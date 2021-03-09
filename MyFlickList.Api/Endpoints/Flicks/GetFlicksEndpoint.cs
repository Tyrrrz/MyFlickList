using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using MyFlickList.Api.Database;
using MyFlickList.Api.Database.Flicks;
using NSwag.Annotations;

namespace MyFlickList.Api.Endpoints.Flicks
{
    public enum GetFlicksOrder
    {
        Top,
        Trending,
        New
    }

    public class GetFlicksResponseItem
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public FlickKind Kind { get; set; }

        [Required]
        public string Title { get; set; } = default!;

        public DateTimeOffset? FirstAired { get; set; }

        public DateTimeOffset? LastAired { get; set; }

        public int? EpisodeCount { get; set; }

        public TimeSpan? Runtime { get; set; }

        public double? ExternalRating { get; set; }

        public IReadOnlyList<string>? Tags { get; set; }

        public int? CoverImageId { get; set; }
    }

    public class GetFlicksMapping : Profile
    {
        public GetFlicksMapping()
        {
            CreateMap<FlickEntity, GetFlicksResponseItem>();
        }
    }

    public class GetFlicksEndpoint : ApiControllerBase
    {
        private readonly DatabaseContext _database;
        private readonly IMapper _mapper;

        public GetFlicksEndpoint(DatabaseContext database, IMapper mapper)
        {
            _database = database;
            _mapper = mapper;
        }

        [OpenApiTag("Flicks")]
        [OpenApiOperation("getFlicks")]
        [HttpGet("flicks")]
        [SuccessResponse(HttpStatusCode.OK)]
        public async Task<ActionResult<PaginatedResponse<GetFlicksResponseItem>>> Action(
            GetFlicksOrder order = GetFlicksOrder.Top,
            string? filterTag = null,
            int page = 1,
            CancellationToken cancellationToken = default)
        {
            IQueryable<FlickEntity> GetTopFlicks() =>
                _database.Flicks
                    .Where(f => f.ExternalRating is not null)
                    .OrderByDescending(f => f.ExternalRating);

            // TODO: actually sort by trendiness
            IQueryable<FlickEntity> GetTrendingFlicks() =>
                _database.Flicks
                    .OrderByDescending(f => f.Id);

            IQueryable<FlickEntity> GetNewFlicks() =>
                _database.Flicks
                    .Where(f => f.FirstAired is not null)
                    .OrderByDescending(f => f.FirstAired);

            var flicksSource = order switch
            {
                GetFlicksOrder.Top => GetTopFlicks(),
                GetFlicksOrder.Trending => GetTrendingFlicks(),
                GetFlicksOrder.New => GetNewFlicks(),
                _ => GetTopFlicks()
            };

            var flicksFiltered = flicksSource;

            if (!string.IsNullOrWhiteSpace(filterTag))
                flicksFiltered = flicksFiltered.Where(f => f.Tags.Contains(filterTag));

            var flicks = flicksFiltered
                .ProjectTo<GetFlicksResponseItem>(_mapper.ConfigurationProvider);

            return Success(
                HttpStatusCode.OK,
                await PaginatedResponse.FromQueryAsync(flicks, page, 10, cancellationToken)
            );
        }
    }
}