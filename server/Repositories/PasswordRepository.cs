namespace Prog3340GroupFinal.Repositories
{
    public class PasswordRepository : IPasswordRepository
    {
        private const int SaltSize = 16;
        private const int KeySize = 32;
        private const int Iterations = 100000;

        public string HashPassword(string password)
        {
            using var rng = new System.Security.Cryptography.RNGCryptoServiceProvider();
            byte[] salt = new byte[SaltSize];
            rng.GetBytes(salt);
            using var pbkdf2 = new System.Security.Cryptography.Rfc2898DeriveBytes(password, salt, Iterations, System.Security.Cryptography.HashAlgorithmName.SHA256);
            byte[] key = pbkdf2.GetBytes(KeySize);
            byte[] hashBytes = new byte[SaltSize + KeySize];
            Array.Copy(salt, 0, hashBytes, 0, SaltSize);
            Array.Copy(key, 0, hashBytes, SaltSize, KeySize);
            return Convert.ToBase64String(hashBytes);
        }

        public bool VerifyPassword(string password, string hashedPassword)
        {
            // 1. Handle empty or null
            if (string.IsNullOrWhiteSpace(hashedPassword)) return false;

            try
            {
                // 2. Decode the Base64 string
                byte[] hashBytes = Convert.FromBase64String(hashedPassword);

                // 3. CRITICAL FIX: Check if the array is the correct length (16 + 32 = 48)
                // If it's too short, it's not a valid hash from this system.
                if (hashBytes.Length < SaltSize + KeySize)
                {
                    return false;
                }

                byte[] salt = new byte[SaltSize];
                Array.Copy(hashBytes, 0, salt, 0, SaltSize);

                using var pbkdf2 = new System.Security.Cryptography.Rfc2898DeriveBytes(password, salt, Iterations, System.Security.Cryptography.HashAlgorithmName.SHA256);
                byte[] key = pbkdf2.GetBytes(KeySize);

                for (int i = 0; i < KeySize; i++)
                {
                    if (hashBytes[i + SaltSize] != key[i])
                    {
                        return false;
                    }
                }
                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }
    }
}
