using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using CliFx;
using CliFx.Attributes;
using TMDbLib.Client;
using TMDbLib.Objects.Discover;

namespace MyFlickList.CatalogUpdater.Commands
{
    [Command("populate", Description = "Populate catalog.")]
    public class PopulateCommand : ICommand
    {
        private readonly HttpClient _httpClient = new HttpClient();

        [CommandOption("api-url", 'u', Description = "MFL API URL.")]
        public string ApiUrl { get; set; } = "http://localhost:5000";

        [CommandOption("tmdb-key", 'k', IsRequired = true, EnvironmentVariableName = "ApiKeys__Tmdb", Description = "TMDB API Key.")]
        public string TmdbApiKey { get; set; } = default!;

        private async Task RequestFlickAsync(string flickId, CancellationToken cancellationToken)
        {
            var url = new Uri(new Uri(ApiUrl), $"/catalog/flicks/{flickId}");
            using var request = new HttpRequestMessage(HttpMethod.Post, url);
            using var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);

            // Skip not found
            if (response.StatusCode == HttpStatusCode.NotFound)
                return;

            // Skip existing
            if (response.StatusCode == HttpStatusCode.Conflict)
                return;

            response.EnsureSuccessStatusCode();
        }

        public async ValueTask ExecuteAsync(IConsole console)
        {
            var cancellationToken = console.GetCancellationToken();

            var tmdbClient = new TMDbClient(TmdbApiKey);

            // Discover movies
            var movieQuery = tmdbClient
                .DiscoverMoviesAsync()
                .IncludeAdultMovies()
                .OrderBy(DiscoverMovieSortBy.PopularityDesc);

            for (var page = 1; page <= 5; page++)
            {
                var results = await movieQuery.Query(page, cancellationToken);
                foreach (var result in results.Results)
                {
                    var externalIds = await tmdbClient.GetMovieExternalIdsAsync(result.Id, cancellationToken);
                    await console.Output.WriteLineAsync($"Working on {externalIds.ImdbId}...");
                    await RequestFlickAsync(externalIds.ImdbId, cancellationToken);
                }
            }

            // Discover series
            var seriesQuery = tmdbClient
                .DiscoverTvShowsAsync()
                .OrderBy(DiscoverTvShowSortBy.PopularityDesc);

            for (var page = 1; page <= 5; page++)
            {
                var results = await seriesQuery.Query(page, cancellationToken);
                foreach (var result in results.Results)
                {
                    var externalIds = await tmdbClient.GetTvShowExternalIdsAsync(result.Id, cancellationToken);
                    await console.Output.WriteLineAsync($"Working on {externalIds.ImdbId}...");
                    await RequestFlickAsync(externalIds.ImdbId, cancellationToken);
                }
            }
        }
    }
}