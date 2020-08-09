using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MyFlickList.Api.Internal.Extensions;

namespace MyFlickList.Api.Services
{
    public class JwtProvider
    {
        private readonly IConfiguration _configuration;

        public JwtProvider(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(string userId, string userName, IReadOnlyList<Claim> claims)
        {
            var coreClaims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Name, userName)
            };

            var actualClaims = coreClaims.Concat(claims).ToArray();

            var issuer = _configuration.GetJwtIssuer();

            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(_configuration.GetJwtSecret()),
                SecurityAlgorithms.HmacSha256
            );

            var issuedAt = DateTimeOffset.Now;
            var expiresAt = issuedAt.Add(_configuration.GetJwtExpiration());

            return new JwtSecurityTokenHandler().CreateEncodedJwt(
                issuer,
                issuer,
                new ClaimsIdentity(actualClaims),
                null,
                expiresAt.UtcDateTime,
                issuedAt.UtcDateTime,
                credentials
            );
        }

        public string GenerateToken(string userId, string userName) =>
            GenerateToken(userId, userName, Array.Empty<Claim>());
    }
}