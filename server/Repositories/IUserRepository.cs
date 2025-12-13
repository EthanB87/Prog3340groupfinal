using Prog3340GroupFinal.Models;

namespace Prog3340GroupFinal.Repositories
{
	public interface IUserRepository : IRepository<AppUser>
	{
		Task<AppUser?> GetByEmailAsync(string email);
		Task<AppUser?> GetByUsernameAsync(string username);
	}
}
