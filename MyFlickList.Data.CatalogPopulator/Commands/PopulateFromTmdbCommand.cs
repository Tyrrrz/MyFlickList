using System;
using System.Linq;
using System.Threading.Tasks;
using CliFx;
using CliFx.Attributes;
using Microsoft.EntityFrameworkCore;
using MyFlickList.Data.Entities.Catalog;
using TMDbLib.Client;
using TMDbLib.Objects.Discover;

namespace MyFlickList.CatalogUpdater.Commands
{
    [Command("populate-tmdb")]
    public class PopulateFromTmdbCommand : CommandBase
    {
        [CommandOption("key", 'k', IsRequired = true, Description = "API key.")]
        public string ApiKey { get; set; } = default!;

        private async Task HandleMoviesAsync(IConsole console)
        {
            var cancellationToken = console.GetCancellationToken();

            await using var dbContext = GetDbContext();
            using var client = new TMDbClient(ApiKey);

            var movieQuery = client
                .DiscoverMoviesAsync()
                .IncludeAdultMovies()
                .OrderBy(DiscoverMovieSortBy.PopularityDesc);

            for (var page = 1; page <= 5; page++)
            {
                var movieResults = await movieQuery.Query(page, cancellationToken);
                foreach (var movieResult in movieResults.Results)
                {
                    var movie = await client.GetMovieAsync(movieResult.Id, cancellationToken: cancellationToken);
                    var imdbId = movie.ExternalIds.ImdbId;

                    var alreadyExists = await dbContext.Flicks.AnyAsync(f => f.ImdbId == imdbId, cancellationToken);
                    if (alreadyExists)
                        continue;

                    await console.Output.WriteLineAsync(movie.Title);

                    var flick = new FlickEntity
                    {
                        ImdbId = imdbId,
                        Kind = FlickKind.Movie,
                        Title = movie.Title,
                        PremiereDate = movie.ReleaseDate,
                        Synopsis = movie.Overview,
                        Runtime = movie.Runtime != null ? TimeSpan.FromMinutes(movie.Runtime.Value) : (TimeSpan?) null
                    };

                    await dbContext.Flicks.AddAsync(flick, cancellationToken);
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
            }
        }

        private async Task HandleSeriesAsync(IConsole console)
        {
            var cancellationToken = console.GetCancellationToken();

            await using var dbContext = GetDbContext();
            using var client = new TMDbClient(ApiKey);

            var seriesQuery = client
                .DiscoverTvShowsAsync()
                .OrderBy(DiscoverTvShowSortBy.PopularityDesc);

            for (var page = 1; page <= 5; page++)
            {
                var seriesResults = await seriesQuery.Query(page, cancellationToken);
                foreach (var seriesResult in seriesResults.Results)
                {
                    var series = await client.GetTvShowAsync(seriesResult.Id, cancellationToken: cancellationToken);
                    var imdbId = series.ExternalIds.ImdbId;

                    var alreadyExists = await dbContext.Flicks.AnyAsync(f => f.ImdbId == imdbId, cancellationToken);
                    if (alreadyExists)
                        continue;

                    await console.Output.WriteLineAsync(series.Name);

                    var flick = new FlickEntity
                    {
                        ImdbId = imdbId,
                        Kind = FlickKind.Series,
                        Title = series.Name,
                        PremiereDate = series.FirstAirDate,
                        Synopsis = series.Overview,
                        Runtime = TimeSpan.FromMinutes(series.EpisodeRunTime.Average()),
                        EpisodeCount = series.NumberOfEpisodes
                    };

                    await dbContext.Flicks.AddAsync(flick, cancellationToken);
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
            }
        }

        public override async ValueTask ExecuteAsync(IConsole console)
        {
            await HandleMoviesAsync(console);
            await HandleSeriesAsync(console);
        }
    }
}