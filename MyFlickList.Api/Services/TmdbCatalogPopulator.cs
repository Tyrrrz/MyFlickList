using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MyFlickList.Api.Database;
using MyFlickList.Api.Database.Files;
using MyFlickList.Api.Database.Flicks;
using MyFlickList.Api.Internal.Extensions;
using TMDbLib.Client;
using TMDbLib.Objects.Find;
using TMDbLib.Objects.Movies;
using TMDbLib.Objects.TvShows;

namespace MyFlickList.Api.Services
{
    public class TmdbCatalogPopulator : ICatalogPopulator
    {
        private readonly DatabaseContext _database;
        private readonly HttpClient _httpClient;

        private readonly Lazy<TMDbClient> _tmdbClientLazy;

        private TMDbClient TmDbClient => _tmdbClientLazy.Value;

        public TmdbCatalogPopulator(IConfiguration configuration, DatabaseContext database, HttpClient httpClient)
        {
            _database = database;
            _httpClient = httpClient;

            // We want this to be lazy so that constructor doesn't throw if the API key is not set in configuration
            _tmdbClientLazy = new Lazy<TMDbClient>(() => new TMDbClient(configuration.GetTmdbApiKey()));
        }

        private async Task<FileEntity> StoreImageAsync(string imagePath, CancellationToken cancellationToken = default)
        {
            var imageUri = new Uri(
                new Uri(TmDbClient.Config.Images.BaseUrl, UriKind.Absolute),
                $"w500{imagePath}"
            );

            var extension = Path.GetExtension(imageUri.AbsolutePath).Trim('.');
            var data = await _httpClient.GetByteArrayAsync(imageUri);

            var entity = new FileEntity
            {
                Data = data,
                ContentType = $"image/{extension}"
            };

            await _database.Files.AddAsync(entity, cancellationToken);
            await _database.SaveChangesAsync(cancellationToken);

            return entity;
        }

        private async Task AddOrUpdateFlickAsync(FlickEntity flickEntity, CancellationToken cancellationToken = default)
        {
            var existing = await _database.Flicks
                .FirstOrDefaultAsync(f => f.ImdbId == flickEntity.ImdbId, cancellationToken);

            if (existing != null)
            {
                if (existing.CoverImageId != null)
                    _database.Files.RemoveRange(_database.Files.Where(f => f.Id == existing.CoverImageId));

                flickEntity.Id = existing.Id;
                _database.Entry(existing).CurrentValues.SetValues(flickEntity);
            }
            else
            {
                await _database.Flicks.AddAsync(flickEntity, cancellationToken);
            }
        }

        private async Task<FlickEntity> PopulateMovieFlickAsync(Movie movie, CancellationToken cancellationToken = default)
        {
            // Poster image
            var image = !string.IsNullOrWhiteSpace(movie.PosterPath)
                ? await StoreImageAsync(movie.PosterPath, cancellationToken)
                : null;

            // TODO: get external rating from IMDB, not TMDB
            var flickEntity = new FlickEntity
            {
                Kind = FlickKind.Movie,
                ImdbId = movie.ImdbId,
                Title = movie.Title,
                OriginalTitle = movie.OriginalTitle?.Pipe(t => string.Equals(t, movie.Title, StringComparison.OrdinalIgnoreCase) ? t : null),
                FirstAired = movie.ReleaseDate,
                Runtime = movie.Runtime?.Pipe(m => TimeSpan.FromMinutes(m)).NullIf(t => t.TotalSeconds <= 0),
                ExternalRating = movie.VoteAverage,
                Synopsis = movie.Overview,
                CoverImageId = image?.Id,
                Tags = movie.Genres.Select(g => g.Name).ToArray()
            };

            await AddOrUpdateFlickAsync(flickEntity, cancellationToken);
            await _database.SaveChangesAsync(cancellationToken);

            return flickEntity;
        }

        private async Task<FlickEntity> PopulateSeriesFlickAsync(TvShow series, CancellationToken cancellationToken = default)
        {
            var externalIds = await TmDbClient.GetTvShowExternalIdsAsync(series.Id, cancellationToken);

            // Poster image
            var image = !string.IsNullOrWhiteSpace(series.PosterPath)
                ? await StoreImageAsync(series.PosterPath, cancellationToken)
                : null;

            // TODO: get external rating from IMDB, not TMDB
            var flickEntity = new FlickEntity
            {
                Kind = FlickKind.Series,
                ImdbId = externalIds.ImdbId,
                Title = series.Name,
                OriginalTitle = series.OriginalName?.Pipe(t => string.Equals(t, series.Name, StringComparison.OrdinalIgnoreCase) ? t : null),
                FirstAired = series.FirstAirDate,
                LastAired = series.LastAirDate?.NullIf(series.InProduction),
                Runtime = series.EpisodeRunTime.NullIfEmpty()?.Average().Pipe(TimeSpan.FromMinutes),
                EpisodeCount = series.NumberOfEpisodes,
                ExternalRating = series.VoteAverage,
                Synopsis = series.Overview,
                CoverImageId = image?.Id,
                Tags = series.Genres.Select(g => g.Name).ToArray()
            };

            await AddOrUpdateFlickAsync(flickEntity, cancellationToken);
            await _database.SaveChangesAsync(cancellationToken);

            return flickEntity;
        }

        public async Task<int?> PopulateFlickAsync(string imdbId, CancellationToken cancellationToken = default)
        {
            await TmDbClient.GetConfigAsync();

            var item = await TmDbClient.FindAsync(FindExternalSource.Imdb, imdbId, cancellationToken);
            var movieMatch = item.MovieResults.FirstOrDefault();
            var seriesMatch = item.TvResults.FirstOrDefault();

            if (movieMatch != null)
            {
                await using var transaction = await _database.Database.BeginTransactionAsync(cancellationToken);

                var movie = await TmDbClient.GetMovieAsync(movieMatch.Id, cancellationToken: cancellationToken);
                var flickEntity = await PopulateMovieFlickAsync(movie, cancellationToken);

                await transaction.CommitAsync(cancellationToken);

                return flickEntity.Id;
            }

            if (seriesMatch != null)
            {
                await using var transaction = await _database.Database.BeginTransactionAsync(cancellationToken);

                var series = await TmDbClient.GetTvShowAsync(seriesMatch.Id, cancellationToken: cancellationToken);
                var flickEntity = await PopulateSeriesFlickAsync(series, cancellationToken);

                await transaction.CommitAsync(cancellationToken);

                return flickEntity.Id;
            }

            return null;
        }
    }
}