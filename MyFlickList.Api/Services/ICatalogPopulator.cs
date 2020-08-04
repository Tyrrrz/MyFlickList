using System.Threading.Tasks;

namespace MyFlickList.Api.Services
{
    public interface ICatalogPopulator
    {
        Task PopulateFlickAsync(string flickId);
    }
}