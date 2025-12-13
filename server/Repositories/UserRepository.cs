using Microsoft.EntityFrameworkCore;
using Prog3340GroupFinal.Data;
using Prog3340GroupFinal.Models;

namespace Prog3340GroupFinal.Repositories
{
	public class UserRepository : Repository<AppUser>, IUserRepository
	{
		private readonly AppDbContext _context;

		public UserRepository(AppDbContext context) : base(context)
		{
			_context = context;
		}

		public async Task<AppUser?> GetByEmailAsync(string email)
		{
			return await _context.AppUsers.FirstOrDefaultAsync(u => u.Email == email);
		}

		public async Task<AppUser?> GetByUsernameAsync(string username)
		{
			return await _context.AppUsers.FirstOrDefaultAsync(u => u.Username == username);
		}
	}
}
