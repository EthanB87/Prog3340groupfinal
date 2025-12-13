namespace Prog3340GroupFinal.Repositories
{
    public interface IPasswordRepository
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string hashedPassword);
    }
}
