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
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
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
                .ProjectTo<SearchResponseFlickItem>(_mapper.ConfigurationProvider)
                .ToArrayAsync(cancellationToken);

            var profiles = await _database.Profiles
                .Where(p => p.IsPublic)
                // TODO: replace with collations
                .Where(p => p.User!.Username.ToLower().Contains(queryNormalized))
                // Order by how similar the strings are, in terms of length
                .OrderBy(p => p.User!.Username.Length - queryNormalized.Length)
                .Take(10)
                .ProjectTo<SearchResponseProfileItem>(_mapper.ConfigurationProvider)
                .ToArrayAsync(cancellationToken);

            return Ok(new SearchResponse
            {
                Flicks = flicks,
                Profiles = profiles
            });
        }
    }
}