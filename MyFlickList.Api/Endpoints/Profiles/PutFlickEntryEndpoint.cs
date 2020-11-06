﻿using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Database;
using MyFlickList.Api.Database.Profiles;
using NSwag.Annotations;

namespace MyFlickList.Api.Endpoints.Profiles
{
    public class PutFlickEntryRequest
    {
        public ProfileFlickEntryStatus Status { get; set; }

        [Range(0, int.MaxValue)]
        public int? EpisodeCount { get; set; }

        [Range(0.0, 1.0)]
        public double? Rating { get; set; }

        [MaxLength(20_000)]
        public string? Review { get; set; }
    }

    public class PutFlickEntryEndpoint : ApiControllerBase
    {
        private readonly DatabaseContext _database;

        public PutFlickEntryEndpoint(DatabaseContext database)
        {
            _database = database;
        }

        [OpenApiTag("Profiles")]
        [OpenApiOperation("putFlickEntry")]
        [HttpPut("profiles/{profileId}/flicks/{flickId}")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        [ProducesResponseType(typeof(ProblemDetails), 403)]
        public async Task<ActionResult> Action(
            int profileId,
            int flickId,
            PutFlickEntryRequest request,
            CancellationToken cancellationToken = default)
        {
            var profile = await _database.Profiles
                .AsTracking()
                .Include(p => p.FlickEntries)
                .FirstOrDefaultAsync(p => p.Id == profileId, cancellationToken);

            if (profile == null)
            {
                return Error(
                    HttpStatusCode.NotFound,
                    $"Profile '{profileId}' not found"
                );
            }

            if (User.TryGetProfileId() != profileId)
            {
                return Error(
                    HttpStatusCode.Forbidden,
                    $"Profile '{profileId}' does not belong to the authenticated user"
                );
            }

            var flickEntry = profile.FlickEntries.FirstOrDefault(f => f.FlickId == flickId);
            if (flickEntry == null)
            {
                flickEntry = new ProfileFlickEntryEntity
                {
                    FlickId = flickId
                };

                profile.FlickEntries.Add(flickEntry);
            }

            flickEntry.Updated = DateTimeOffset.Now;
            flickEntry.Status = request.Status;
            flickEntry.EpisodeCount = request.EpisodeCount;
            flickEntry.Rating = request.Rating;
            flickEntry.Review = request.Review;

            await _database.SaveChangesAsync(cancellationToken);

            return Ok();
        }
    }
}