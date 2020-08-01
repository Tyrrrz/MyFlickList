using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using CliFx;
using CliFx.Attributes;
using MyFlickList.Data;
using MyFlickList.Data.Entities.Catalog;
using TMDbLib.Client;
using TMDbLib.Objects.Discover;
using TMDbLib.Objects.General;
using TMDbLib.Objects.Movies;
using TMDbLib.Objects.TvShows;

namespace MyFlickList.CatalogUpdater.Commands
{
    [Command("populate-tmdb", Description = "Populate catalog from TMDB.")]
    public class PopulateFromTmdbCommand : CommandBase
    {
        private readonly HttpClient _httpClient = new HttpClient();

        [CommandOption("key", 'k', IsRequired = true, Description = "API key.")]
        public string ApiKey { get; set; } = default!;

        private async IAsyncEnumerable<Movie> SearchMoviesAsync(
            TMDbClient client,
            int maxPages = 5,
            [EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            var query = client
                .DiscoverMoviesAsync()
                .IncludeAdultMovies()
                .OrderBy(DiscoverMovieSortBy.PopularityDesc);

            for (var page = 1; page <= maxPages; page++)
            {
                var results = await query.Query(page, cancellationToken);
                foreach (var result in results.Results)
                    yield return await client.GetMovieAsync(result.Id, cancellationToken: cancellationToken);
            }
        }

        private async IAsyncEnumerable<TvShow> SearchShowsAsync(
            TMDbClient client,
            int maxPages = 5,
            [EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            var query = client
                .DiscoverTvShowsAsync()
                .OrderBy(DiscoverTvShowSortBy.PopularityDesc);

            for (var page = 1; page <= maxPages; page++)
            {
                var results = await query.Query(page, cancellationToken);
                foreach (var result in results.Results)
                    yield return await client.GetTvShowAsync(result.Id, cancellationToken: cancellationToken);
            }
        }

        private async Task<Guid> StoreImageAsync(
            AppDbContext dbContext,
            TMDbConfig config,
            string imagePath,
            CancellationToken cancellationToken = default)
        {
            var imageUri = new Uri(
                new Uri(config.Images.BaseUrl, UriKind.Absolute),
                $"w500{imagePath}"
            );

            var extension = Path.GetExtension(imageUri.AbsolutePath).Trim('.');
            var data = await _httpClient.GetByteArrayAsync(imageUri);

            var entity = new ImageEntity
            {
                Data = data,
                ContentType = $"image/{extension}"
            };

            await dbContext.Images.AddAsync(entity, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }

        public override async ValueTask ExecuteAsync(IConsole console)
        {
            var cancellationToken = console.GetCancellationToken();

            await using var dbContext = GetDbContext();
            using var client = new TMDbClient(ApiKey);

            var config = await client.GetConfigAsync();

            await foreach (var movie in SearchMoviesAsync(client, 5, cancellationToken))
            {
                var id = movie.ImdbId;

                await console.Output.WriteLineAsync($"[{id}] {movie.Title}");

                if (string.IsNullOrWhiteSpace(id))
                    continue;

                var existingFlickEntity = await dbContext.Flicks.FindAsync(id);
                if (existingFlickEntity != null)
                    continue;

                // Poster image
                var imageId = !string.IsNullOrWhiteSpace(movie.PosterPath)
                    ? await StoreImageAsync(dbContext, config, movie.PosterPath, cancellationToken)
                    : (Guid?) null;

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

                await dbContext.Flicks.AddAsync(flickEntity, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
            }

            await foreach (var show in SearchShowsAsync(client, 5, cancellationToken))
            {
                var externalIds = await client.GetTvShowExternalIdsAsync(show.Id, cancellationToken);
                var id = externalIds.ImdbId;

                await console.Output.WriteLineAsync($"[{id}] {show.Name}");

                if (string.IsNullOrWhiteSpace(id))
                    continue;

                var existingFlickEntity = await dbContext.Flicks.FindAsync(id);
                if (existingFlickEntity != null)
                    continue;

                // Poster image
                var imageId = !string.IsNullOrWhiteSpace(show.PosterPath)
                    ? await StoreImageAsync(dbContext, config, show.PosterPath, cancellationToken)
                    : (Guid?) null;

                var runtime = TimeSpan.FromMinutes(show.EpisodeRunTime.Average());

                var flickEntity = new FlickEntity
                {
                    Id = id,
                    Kind = FlickKind.Series,
                    Title = show.Name,
                    PremiereDate = show.FirstAirDate,
                    Synopsis = show.Overview,
                    Runtime = runtime,
                    EpisodeCount = show.NumberOfEpisodes,
                    ImageId = imageId
                };

                await dbContext.Flicks.AddAsync(flickEntity, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
            }
        }
    }
}