using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MyFlickList.Api.Internal.Extensions;

namespace MyFlickList.Api.Endpoints
{
    public static class Jwt
    {
        public const string ProfileIdClaimType = "mfl_profile_id";

        public static string Generate(
            string issuer,
            byte[] secret,
            TimeSpan expiresIn,
            IReadOnlyList<Claim> claims)
        {
            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(secret),
                SecurityAlgorithms.HmacSha256
            );

            var issuedAt = DateTimeOffset.Now;
            var expiresAt = issuedAt.Add(expiresIn);

            return new JwtSecurityTokenHandler().CreateEncodedJwt(
                issuer,
                issuer,
                new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme),
                null,
                expiresAt.UtcDateTime,
                issuedAt.UtcDateTime,
                credentials
            );
        }

        public static int? TryGetProfileId(this ClaimsPrincipal claimsPrincipal) =>
            claimsPrincipal
                .FindFirstValue(ProfileIdClaimType)?
                .Pipe(s => int.TryParse(s, NumberStyles.Integer, CultureInfo.InvariantCulture, out var result)
                    ? result
                    : (int?) null);
    }
}