using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MyFlickList.Api.Entities.Catalog;
using MyFlickList.Api.Exceptions;
using MyFlickList.Api.Internal.Extensions;
using TMDbLib.Client;
using TMDbLib.Objects.Find;
using TMDbLib.Objects.Movies;
using TMDbLib.Objects.TvShows;

namespace MyFlickList.Api.Services
{
    public class TmdbCatalogPopulator : ICatalogPopulator
    {
        private readonly AppDbContext _dbContext;
        private readonly HttpClient _httpClient;

        private readonly Lazy<TMDbClient> _tmdbClientLazy;

        private TMDbClient TmDbClient => _tmdbClientLazy.Value;

        public TmdbCatalogPopulator(IConfiguration configuration, AppDbContext dbContext, HttpClient httpClient)
        {
            _dbContext = dbContext;
            _httpClient = httpClient;

            // We want this to be lazy so that constructor doesn't throw if the API key is not set in configuration
            _tmdbClientLazy = new Lazy<TMDbClient>(() => new TMDbClient(configuration.GetTmdbApiKey()));
        }

        private async Task<Guid> StoreImageAsync(string imagePath)
        {
            var imageUri = new Uri(
                new Uri(TmDbClient.Config.Images.BaseUrl, UriKind.Absolute),
                $"w500{imagePath}"
            );

            var extension = Path.GetExtension(imageUri.AbsolutePath).Trim('.');
            var data = await _httpClient.GetByteArrayAsync(imageUri);

            var entity = new ImageEntity
            {
                Id = Guid.NewGuid(),
                Data = data,
                ContentType = $"image/{extension}"
            };

            await _dbContext.Images.AddAsync(entity);

            return entity.Id;
        }

        private async Task AddOrUpdateTagAsync(TagEntity tagEntity)
        {
            var existing = await _dbContext.Tags.FindAsync(tagEntity.Name);

            if (existing != null)
            {
                return;
            }

            await _dbContext.Tags.AddAsync(tagEntity);
        }

        private async Task AddOrUpdateFlickAsync(FlickEntity flickEntity)
        {
            var existing = await _dbContext.Flicks
                .Include(f => f.FlickTags)
                .SingleOrDefaultAsync(f => f.Id == flickEntity.Id);

            if (existing != null)
            {
                _dbContext.Flicks.Remove(existing);
                _dbContext.FlickTags.RemoveRange(existing.FlickTags);
            }

            await _dbContext.Flicks.AddAsync(flickEntity);
        }

        private async Task PopulateMovieFlickAsync(Movie movie)
        {
            var id = movie.ImdbId;

            // Poster image
            var imageId = !string.IsNullOrWhiteSpace(movie.PosterPath)
                ? await StoreImageAsync(movie.PosterPath)
                : (Guid?) null;

            // TODO: get external rating from IMDB, not TMDB
            var flickEntity = new FlickEntity
            {
                Id = id,
                Kind = FlickKind.Movie,
                Title = movie.Title,
                PremiereDate = movie.ReleaseDate,
                Runtime = movie.Runtime?.Pipe(m => TimeSpan.FromMinutes(m)).NullIf(t => t.TotalSeconds <= 0),
                ExternalRating = movie.VoteAverage,
                Synopsis = movie.Overview,
                ImageId = imageId
            };

            // Tags
            foreach (var genre in movie.Genres)
            {
                await AddOrUpdateTagAsync(new TagEntity {Name = genre.Name});

                flickEntity.FlickTags.Add(new FlickTagEntity
                {
                    FlickId = id,
                    TagName = genre.Name
                });
            }

            await AddOrUpdateFlickAsync(flickEntity);
        }

        private async Task PopulateSeriesFlickAsync(TvShow series)
        {
            var externalIds = await TmDbClient.GetTvShowExternalIdsAsync(series.Id);
            var id = externalIds.ImdbId;

            // Poster image
            var imageId = !string.IsNullOrWhiteSpace(series.PosterPath)
                ? await StoreImageAsync(series.PosterPath)
                : (Guid?) null;

            // TODO: get external rating from IMDB, not TMDB
            var flickEntity = new FlickEntity
            {
                Id = id,
                Kind = FlickKind.Series,
                Title = series.Name,
                PremiereDate = series.FirstAirDate,
                FinaleDate = series.LastAirDate?.NullIf(series.InProduction),
                Runtime = series.EpisodeRunTime.NullIfEmpty()?.Average().Pipe(TimeSpan.FromMinutes),
                EpisodeCount = series.NumberOfEpisodes,
                ExternalRating = series.VoteAverage,
                Synopsis = series.Overview,
                ImageId = imageId
            };

            // Tags
            foreach (var genre in series.Genres)
            {
                await AddOrUpdateTagAsync(new TagEntity {Name = genre.Name});

                flickEntity.FlickTags.Add(new FlickTagEntity
                {
                    FlickId = id,
                    TagName = genre.Name
                });
            }

            await AddOrUpdateFlickAsync(flickEntity);
        }

        public async Task PopulateFlickAsync(string flickId)
        {
            await TmDbClient.GetConfigAsync();

            var item = await TmDbClient.FindAsync(FindExternalSource.Imdb, flickId);
            var movieMatch = item.MovieResults.FirstOrDefault();
            var seriesMatch = item.TvResults.FirstOrDefault();

            if (movieMatch != null)
            {
                var movie = await TmDbClient.GetMovieAsync(movieMatch.Id);

                await PopulateMovieFlickAsync(movie);
                await _dbContext.SaveChangesAsync();
            }
            else if (seriesMatch != null)
            {
                var series = await TmDbClient.GetTvShowAsync(seriesMatch.Id);

                await PopulateSeriesFlickAsync(series);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                throw new DomainException($"Cannot find IMDB title with ID '{flickId}'.", StatusCodeHint.NotFound);
            }
        }
    }
}