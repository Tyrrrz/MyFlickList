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
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Database;
using MyFlickList.Api.Database.Flicks;
using MyFlickList.Api.Database.Profiles;
using NSwag.Annotations;

namespace MyFlickList.Api.Endpoints.Search
{
    public class SearchResponseFlickItem
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

        public double? ExternalRating { get; set; }

        public IReadOnlyList<string>? Tags { get; set; }

        public int? CoverImageId { get; set; }
    }

    public class SearchResponseProfileItem
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = default!;

        public string? Location { get; set; }

        [Required]
        public int FlickEntriesCount { get; set; }

        public int? AvatarImageId { get; set; }
    }

    public class SearchResponse
    {
        public IReadOnlyList<SearchResponseFlickItem>? Flicks { get; set; }

        public IReadOnlyList<SearchResponseProfileItem>? Profiles { get; set; }
    }

    public class SearchMapping : Profile
    {
        public SearchMapping()
        {
            CreateMap<FlickEntity, SearchResponseFlickItem>();

            CreateMap<ProfileEntity, SearchResponseProfileItem>()
                .ForMember(o => o.Name, x => x.MapFrom(o => o.User!.Username))
                .ForMember(o => o.FlickEntriesCount, x => x.MapFrom(o => o.FlickEntries.Count));
        }
    }

    public class SearchEndpoint : ApiControllerBase
    {
        private readonly DatabaseContext _database;
        private readonly IMapper _mapper;

        public SearchEndpoint(DatabaseContext database, IMapper mapper)
        {
            _database = database;
            _mapper = mapper;
        }

        [OpenApiTag("Search")]
        [OpenApiOperation("search")]
        [HttpGet("search")]
        [SuccessResponse(HttpStatusCode.OK)]
        [ValidationErrorResponse(HttpStatusCode.BadRequest)]
        public async Task<ActionResult<SearchResponse>> Action(
            string query,
            CancellationToken cancellationToken = default)
        {
            var queryNormalized = query.ToLowerInvariant().Trim();

            if (string.IsNullOrWhiteSpace(queryNormalized))
            {
                return Error(
                    HttpStatusCode.BadRequest,
                    "Search query is empty or invalid"
                );
            }

            var flicks = await _database.Flicks
                .Where(f =>
                    EF.Functions.ILike(EF.Functions.Unaccent(f.Title), EF.Functions.Unaccent($"%{queryNormalized}%")) ||
                    EF.Functions.ILike(EF.Functions.Unaccent(f.OriginalTitle), EF.Functions.Unaccent($"%{queryNormalized}%"))
                )
                .OrderBy(f => f.Title.Length - queryNormalized.Length)
                .Take(10)
                .ProjectTo<SearchResponseFlickItem>(_mapper.ConfigurationProvider)
                .ToArrayAsync(cancellationToken);

            var profiles = await _database.Profiles
                .Where(p => p.IsPublic)
                .Where(p => EF.Functions.ILike(p.User!.Username, $"%{queryNormalized}%"))
                .OrderBy(p => p.User!.Username.Length - queryNormalized.Length)
                .Take(10)
                .ProjectTo<SearchResponseProfileItem>(_mapper.ConfigurationProvider)
                .ToArrayAsync(cancellationToken);

            return Success(HttpStatusCode.OK, new SearchResponse
            {
                Flicks = flicks,
                Profiles = profiles
            });
        }
    }
}