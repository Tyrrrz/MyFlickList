using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MyFlickList.Domain.Gravatar
{
    public partial class GravatarClient
    {
        private readonly HttpClient _httpClient;

        public GravatarClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<GravatarImage> GetAvatarAsync(string email, CancellationToken cancellationToken = default)
        {
            var emailHash = GetEmailHash(email);

            using var response = await _httpClient.GetAsync(
                $"https://gravatar.com/avatar/{emailHash}?s=200&d=robohash",
                HttpCompletionOption.ResponseHeadersRead,
                cancellationToken
            );

            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsByteArrayAsync();
            var contentType = response.Content.Headers.ContentType.MediaType;

            return new GravatarImage(
                email,
                content,
                contentType
            );
        }
    }

    public partial class GravatarClient
    {
        private static string GetEmailHash(string email)
        {
            using var md5 = MD5.Create();

            var emailBytes = Encoding.UTF8.GetBytes(email);
            var hashBytes = md5.ComputeHash(emailBytes);

            return Encoding.UTF8.GetString(hashBytes);
        }
    }
}