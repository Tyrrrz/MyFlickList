using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Api.Database;
using MyFlickList.Api.Database.Profiles;
using MyFlickList.Api.Internal.Extensions;
using MyFlickList.Api.Transport.Models;
using MyFlickList.Api.Transport.Models.Profiles;

namespace MyFlickList.Api.Transport
{
    [ApiController]
    [Route("profiles")]
    public class ProfilesController : ControllerBase
    {
        private readonly DatabaseContext _database;
        private readonly IMapper _mapper;

        public ProfilesController(DatabaseContext database, IMapper mapper)
        {
            _database = database;
            _mapper = mapper;
        }

        [HttpGet("{profileId}")]
        [ProducesResponseType(typeof(ProfileResponse), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        [ProducesResponseType(typeof(ProblemDetails), 403)]
        public async Task<IActionResult> Get(
            int profileId,
            CancellationToken cancellationToken = default)
        {
            var profile = await _database.Profiles
                .ProjectTo<ProfileResponse>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(p => p.Id == profileId, cancellationToken);

            if (profile == null)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.NotFound,
                    $"Profile '{profileId}' not found"
                );
            }

            if (!profile.IsPublic && User.TryGetProfileId() != profileId)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.Forbidden,
                    $"Profile '{profileId}' is not public"
                );
            }

            return Ok(profile);
        }

        [HttpPut("{profileId}")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        [ProducesResponseType(typeof(ProblemDetails), 403)]
        public async Task<IActionResult> Put(
            int profileId,
            UpdateProfileRequest request,
            CancellationToken cancellationToken = default)
        {
            var profile = await _database.Profiles
                .AsTracking()
                .FirstOrDefaultAsync(p => p.Id == profileId, cancellationToken);

            // TODO: the following can be extracted
            if (profile == null)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.NotFound,
                    $"Profile '{profileId}' not found"
                );
            }

            if (User.TryGetProfileId() != profileId)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.Forbidden,
                    $"Profile '{profileId}' does not belong to the authenticated user"
                );
            }

            profile.IsPublic = request.IsPublic;
            profile.Location = request.Location;
            profile.Bio = request.Bio;
            profile.ExternalLinks = request.ExternalLinks?.ToArray() ?? Array.Empty<string>();

            await _database.SaveChangesAsync(cancellationToken);

            return Ok();
        }

        [HttpGet("{profileId}/flicks")]
        [ProducesResponseType(typeof(ProfileFlickEntryResponse[]), 200)]
        [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        [ProducesResponseType(typeof(ProblemDetails), 403)]
        public async Task<IActionResult> GetFlickEntries(
            int profileId,
            CancellationToken cancellationToken = default)
        {
            var profile = await _database.Profiles
                .Include(p => p.FlickEntries)
                .ThenInclude(f => f.Flick)
                .FirstOrDefaultAsync(p => p.Id == profileId, cancellationToken);

            if (profile == null)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.NotFound,
                    $"Profile '{profileId}' not found"
                );
            }

            if (!profile.IsPublic && User.TryGetProfileId() != profileId)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.Forbidden,
                    $"Profile '{profileId}' is not public"
                );
            }

            return Ok(
                _mapper.Map<ProfileFlickEntryResponse[]>(profile.FlickEntries)
            );
        }

        [HttpGet("{profileId}/flicks/{flickId}")]
        [ProducesResponseType(typeof(ProfileFlickEntryResponse), 200)]
        [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        [ProducesResponseType(typeof(ProblemDetails), 403)]
        public async Task<IActionResult> GetFlickEntry(
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
                return ErrorResponse.Create(
                    HttpStatusCode.NotFound,
                    $"Profile '{profileId}' not found"
                );
            }

            if (!profile.IsPublic && User.TryGetProfileId() != profileId)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.Forbidden,
                    $"Profile '{profileId}' is not public"
                );
            }

            var flickEntry = profile.FlickEntries.FirstOrDefault(f => f.FlickId == flickId);
            if (flickEntry == null)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.NotFound,
                    $"Entry for flick '{flickId}' on profile '{profileId}' not found"
                );
            }

            return Ok(
                _mapper.Map<ProfileFlickEntryResponse>(flickEntry)
            );
        }

        [HttpPut("{profileId}/flicks/{flickId}")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        [ProducesResponseType(typeof(ProblemDetails), 403)]
        public async Task<IActionResult> PutFlickEntry(
            int profileId,
            int flickId,
            UpdateProfileFlickEntryRequest request,
            CancellationToken cancellationToken = default)
        {
            var profile = await _database.Profiles
                .AsTracking()
                .Include(p => p.FlickEntries)
                .FirstOrDefaultAsync(p => p.Id == profileId, cancellationToken);

            if (profile == null)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.NotFound,
                    $"Profile '{profileId}' not found"
                );
            }

            if (User.TryGetProfileId() != profileId)
            {
                return ErrorResponse.Create(
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

        [HttpDelete("{profileId}/flicks/{flickId}")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
        [ProducesResponseType(typeof(ProblemDetails), 404)]
        [ProducesResponseType(typeof(ProblemDetails), 403)]
        public async Task<IActionResult> DeleteFlickEntry(
            int profileId,
            int flickId,
            CancellationToken cancellationToken = default)
        {
            var profile = await _database.Profiles
                .AsTracking()
                .Include(p => p.FlickEntries)
                .FirstOrDefaultAsync(p => p.Id == profileId, cancellationToken);

            if (profile == null)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.NotFound,
                    $"Profile '{profileId}' not found"
                );
            }

            if (User.TryGetProfileId() != profileId)
            {
                return ErrorResponse.Create(
                    HttpStatusCode.Forbidden,
                    $"Profile '{profileId}' does not belong to the authenticated user"
                );
            }

            var flickEntry = profile.FlickEntries.FirstOrDefault(f => f.FlickId == flickId);
            if (flickEntry != null)
            {
                profile.FlickEntries.Remove(flickEntry);
                _database.ProfileFlickEntries.Remove(flickEntry);
                await _database.SaveChangesAsync(cancellationToken);
            }

            return Ok();
        }
    }
}