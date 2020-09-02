using System.Threading;
using System.Threading.Tasks;

namespace MyFlickList.Api.Services
{
    public interface ICatalogPopulator
    {
        Task<int?> PopulateFlickAsync(string imdbId, CancellationToken cancellationToken = default);
    }
}