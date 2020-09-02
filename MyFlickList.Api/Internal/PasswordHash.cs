using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace MyFlickList.Api.Internal
{
    // Adaptation of ASP.NET Core Identity's password hasher for more generic use
    internal static class PasswordHash
    {
        private static readonly RandomNumberGenerator Rng = RandomNumberGenerator.Create();

        private static uint ReadNetworkByteOrder(byte[] buffer, int offset) =>
            ((uint) (buffer[offset + 0]) << 24)
            | ((uint) (buffer[offset + 1]) << 16)
            | ((uint) (buffer[offset + 2]) << 8)
            | ((uint) (buffer[offset + 3]));

        private static void WriteNetworkByteOrder(byte[] buffer, int offset, uint value)
        {
            buffer[offset + 0] = (byte) (value >> 24);
            buffer[offset + 1] = (byte) (value >> 16);
            buffer[offset + 2] = (byte) (value >> 8);
            buffer[offset + 3] = (byte) (value >> 0);
        }

        private static byte[] GetSalt(int size)
        {
            var salt = new byte[size];
            Rng.GetBytes(salt);

            return salt;
        }

        private static byte[] Generate(string password,
            KeyDerivationPrf prf, int iterCount, int saltSize, int numBytesRequested)
        {
            var salt = GetSalt(saltSize);
            var subKey = KeyDerivation.Pbkdf2(password, salt, prf, iterCount, numBytesRequested);

            var bytes = new byte[13 + salt.Length + subKey.Length];

            bytes[0] = 0x01;
            WriteNetworkByteOrder(bytes, 1, (uint) prf);
            WriteNetworkByteOrder(bytes, 5, (uint) iterCount);
            WriteNetworkByteOrder(bytes, 9, (uint) saltSize);
            Buffer.BlockCopy(salt, 0, bytes, 13, salt.Length);
            Buffer.BlockCopy(subKey, 0, bytes, 13 + saltSize, subKey.Length);

            return bytes;
        }

        public static byte[] Generate(string password) => Generate(
            password,
            KeyDerivationPrf.HMACSHA256,
            10_000,
            128 / 8,
            256 / 8
        );

        public static bool Verify(byte[] passwordHash, string password)
        {
            if (passwordHash.Length <= 0)
                return false;

            try
            {
                // Read header information
                var prf = (KeyDerivationPrf) ReadNetworkByteOrder(passwordHash, 1);
                var iterCount = (int) ReadNetworkByteOrder(passwordHash, 5);
                var saltLength = (int) ReadNetworkByteOrder(passwordHash, 9);

                // Read the salt: must be >= 128 bits
                if (saltLength < 128 / 8)
                    return false;

                var salt = new byte[saltLength];
                Buffer.BlockCopy(passwordHash, 13, salt, 0, salt.Length);

                // Read the subkey (the rest of the payload): must be >= 128 bits
                var subKeyLength = passwordHash.Length - 13 - salt.Length;
                if (subKeyLength < 128 / 8)
                    return false;

                var expectedSubKey = new byte[subKeyLength];
                Buffer.BlockCopy(passwordHash, 13 + salt.Length, expectedSubKey, 0, expectedSubKey.Length);

                // Hash the incoming password and verify it
                var actualSubKey = KeyDerivation.Pbkdf2(password, salt, prf, iterCount, subKeyLength);

                return CryptographicOperations.FixedTimeEquals(actualSubKey, expectedSubKey);
            }
            catch
            {
                // Malformed password hash
                return false;
            }
        }
    }
}