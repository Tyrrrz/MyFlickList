using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MyFlickList.Data;
using MyFlickList.Data.Entities.Catalog;
using TMDbLib.Client;
using TMDbLib.Objects.Find;
using TMDbLib.Objects.Movies;
using TMDbLib.Objects.TvShows;

namespace MyFlickList.Api.Services
{
    public class TmdbCatalogPopulator : ICatalogPopulator
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _dbContext;
        private readonly HttpClient _httpClient;
        private readonly TMDbClient _tmdbClient;

        public TmdbCatalogPopulator(IConfiguration configuration, AppDbContext dbContext, HttpClient httpClient)
        {
            _configuration = configuration;
            _dbContext = dbContext;
            _httpClient = httpClient;

            _tmdbClient = new TMDbClient(GetApiKey());
        }

        private string GetApiKey() =>
            _configuration.GetSection("ApiKeys")?.GetValue<string>("Tmdb") ??
            throw new InvalidOperationException("Missing TMDB API key.");

        private async Task<Guid> StoreImageAsync(string imagePath)
        {
            var imageUri = new Uri(
                new Uri(_tmdbClient.Config.Images.BaseUrl, UriKind.Absolute),
                $"w500{imagePath}"
            );

            var extension = Path.GetExtension(imageUri.AbsolutePath).Trim('.');
            var data = await _httpClient.GetByteArrayAsync(imageUri);

            var entity = new ImageEntity
            {
                Data = data,
                ContentType = $"image/{extension}"
            };

            await _dbContext.Images.AddAsync(entity);
            await _dbContext.SaveChangesAsync();

            return entity.Id;
        }

        private async Task PopulateMovieFlickAsync(Movie movie)
        {
            var id = movie.ImdbId;

            // Poster image
            var imageId = !string.IsNullOrWhiteSpace(movie.PosterPath)
                ? await StoreImageAsync(movie.PosterPath)
                : (Guid?) null;

            // Runtime
            var runtime = movie.Runtime != null
                ? TimeSpan.FromMinutes(movie.Runtime.Value)
                : (TimeSpan?) null;

            var flickEntity = new FlickEntity
            {
                Id = id,
                Kind = FlickKind.Movie,
                Title = movie.Title,
                PremiereDate = movie.ReleaseDate,
                Synopsis = movie.Overview,
                Runtime = runtime,
                ImageId = imageId
            };

            await _dbContext.Flicks.AddAsync(flickEntity);
            await _dbContext.SaveChangesAsync();
        }

        private async Task PopulateSeriesFlickAsync(TvShow series)
        {
            var externalIds = await _tmdbClient.GetTvShowExternalIdsAsync(series.Id);
            var id = externalIds.ImdbId;

            // Poster image
            var imageId = !string.IsNullOrWhiteSpace(series.PosterPath)
                ? await StoreImageAsync(series.PosterPath)
                : (Guid?) null;

            // Runtime
            var runtime = TimeSpan.FromMinutes(series.EpisodeRunTime.Average());

            var flickEntity = new FlickEntity
            {
                Id = id,
                Kind = FlickKind.Series,
                Title = series.Name,
                PremiereDate = series.FirstAirDate,
                Synopsis = series.Overview,
                Runtime = runtime,
                EpisodeCount = series.NumberOfEpisodes,
                ImageId = imageId
            };

            await _dbContext.Flicks.AddAsync(flickEntity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task PopulateFlickAsync(string flickId)
        {
            await _tmdbClient.GetConfigAsync();

            var item = await _tmdbClient.FindAsync(FindExternalSource.Imdb, flickId);
            var movieMatch = item.MovieResults.FirstOrDefault();
            var seriesMatch = item.TvResults.FirstOrDefault();

            if (movieMatch != null)
            {
                var movie = await _tmdbClient.GetMovieAsync(movieMatch.Id);
                await PopulateMovieFlickAsync(movie);
            }
            else if (seriesMatch != null)
            {
                var series = await _tmdbClient.GetTvShowAsync(seriesMatch.Id);
                await PopulateSeriesFlickAsync(series);
            }
            else
            {
                throw new InvalidOperationException("Can't find.");
            }
        }
    }
}