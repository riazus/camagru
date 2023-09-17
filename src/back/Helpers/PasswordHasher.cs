using System.Security.Cryptography;

namespace back.Helpers
{
    public interface IPasswordHasher
    {
        string Hash(string password);
        bool Verify(string passwordHash, string inputPassword);
    }

    public class PasswordHasher : IPasswordHasher
    {
        private const int SaltSize = 128 / 8;
        private const int KeySize = 256 / 8;
        private const int Iterations = 1000;
        private static readonly HashAlgorithmName hashAlgorithmName = HashAlgorithmName.SHA256;
        private const char Delimiter = ';';

        public string Hash(string password)
        {
            using (var saltGenerator = RandomNumberGenerator.Create())
            {
                var salt = new byte[SaltSize];
                saltGenerator.GetBytes(salt);

                using (var hasher = new Rfc2898DeriveBytes(password, salt, Iterations, hashAlgorithmName))
                {
                    var hash = Convert.ToBase64String(hasher.GetBytes(KeySize));
                    var saltBase64 = Convert.ToBase64String(salt);

                    return $"{saltBase64}{Delimiter}{hash}";
                }
            }
        }

        public bool Verify(string storedHash, string inputPassword)
        {
            var elements = storedHash.Split(Delimiter);
            if (elements.Length != 2)
            {
                return false; // Invalid format
            }

            var salt = Convert.FromBase64String(elements[0]);
            var hash = Convert.FromBase64String(elements[1]);

            using (var hasher = new Rfc2898DeriveBytes(inputPassword, salt, Iterations, hashAlgorithmName))
            {
                var computedHash = hasher.GetBytes(KeySize);
                return CryptographicOperations.FixedTimeEquals(hash, computedHash);
            }
        }
    }
}
