using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace MyFlickList.Api.Internal
{
    public static class Jwt
    {
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
    }
}