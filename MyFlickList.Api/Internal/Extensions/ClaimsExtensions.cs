using System.Globalization;
using System.Security.Claims;

namespace MyFlickList.Api.Internal.Extensions
{
    internal static class ClaimsExtensions
    {
        public static int? TryGetProfileId(this ClaimsPrincipal claimsPrincipal) =>
            claimsPrincipal
                .FindFirstValue("mfl_profile_id")?
                .Pipe(s => int.TryParse(s, NumberStyles.Integer, CultureInfo.InvariantCulture, out var result)
                    ? result
                    : (int?) null
                );
    }
}