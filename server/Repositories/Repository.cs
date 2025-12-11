using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Prog3340GroupFinal.Repositories
{

    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly DbContext _context;
        private readonly DbSet<T> _dbSet;

        public Repository(DbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

		public async Task<IEnumerable<T>> GetAllAsync(params Expression<Func<T, object>>[]? includes)
		{
			IQueryable<T> query = _dbSet;

			if (includes != null)
			{
				foreach (var include in includes)
				{
					query = query.Include(include);
				}
			}

			return await query.ToListAsync();
		}

		public async Task<T?> GetByIdAsync(int id, params Expression<Func<T, object>>[]? includes)
		{
			IQueryable<T> query = _dbSet;

			if (includes != null)
			{
				foreach (var include in includes)
				{
					query = query.Include(include);
				}
			}

			return await query.FirstOrDefaultAsync(e => EF.Property<int>(e, "Id") == id);
		}

		public async Task AddAsync(T objType)
        {
            await _dbSet.AddAsync(objType);
            await _context.SaveChangesAsync();
        }

        public void Update(T objType)
        {
            _dbSet.Update(objType);
            _context.SaveChanges();
        }

        public void Delete(T objType)
        {
            _dbSet.Remove(objType);
            _context.SaveChanges();
        }
    }
}
