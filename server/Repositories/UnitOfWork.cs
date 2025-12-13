
using Microsoft.EntityFrameworkCore;
using Prog3340GroupFinal.Data;

namespace Prog3340GroupFinal.Repositories
{
	public class UnitOfWork : IUnitOfWork
	{
		private readonly AppDbContext _context;

		public ITaskRepository Tasks { get; }
		public IUserRepository Users { get; }

		public UnitOfWork(AppDbContext context)
		{
			_context = context;
			Tasks = new TaskRepository(_context);
			Users = new UserRepository(_context);
		}

		public async Task<int> SaveChangesAsync()
		{
			return await _context.SaveChangesAsync();
		}
	}
}
