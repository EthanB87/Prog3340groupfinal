using Microsoft.EntityFrameworkCore;
using Prog3340GroupFinal.Data;
using Prog3340GroupFinal.Models;
using TaskEntity = Prog3340GroupFinal.Models.Task;

namespace Prog3340GroupFinal.Repositories
{
	public class TaskRepository : Repository<TaskEntity>, ITaskRepository
	{
		private readonly AppDbContext _context;

		public TaskRepository(AppDbContext context) : base(context)
		{
			_context = context;
		}

		public async Task<(IEnumerable<TaskEntity> Data, int TotalCount)> GetPagedAsync(TaskQueryParameters query)
		{
			IQueryable<TaskEntity> tasksQuery = _context.Tasks
				.Include(t => t.CreatedBy)
				.Include(t => t.AssignedTo)
				.AsQueryable();

			if (query.Status.HasValue)
			{
				tasksQuery = tasksQuery.Where(t => t.Status == query.Status);
			}

			if (query.AssignedTo.HasValue)
			{
				tasksQuery = tasksQuery.Where(t => t.AssignedToId == query.AssignedTo);
			}

			if (query.CreatedBy.HasValue)
			{
				tasksQuery = tasksQuery.Where(t => t.CreatedById == query.CreatedBy);
			}

			if (!string.IsNullOrWhiteSpace(query.Search))
			{
				var term = query.Search.ToLower();
				tasksQuery = tasksQuery.Where(t =>
					t.Title.ToLower().Contains(term) ||
					(t.Description != null && t.Description.ToLower().Contains(term)));
			}

			var totalCount = await tasksQuery.CountAsync();

			var data = await tasksQuery
				.OrderByDescending(t => t.CreatedAt)
				.Skip((query.Page - 1) * query.PageSize)
				.Take(query.PageSize)
				.ToListAsync();

			return (data, totalCount);
		}

		public async Task<TaskEntity?> GetWithUsersAsync(int id)
		{
			return await _context.Tasks
				.Include(t => t.CreatedBy)
				.Include(t => t.AssignedTo)
				.FirstOrDefaultAsync(t => t.Id == id);
		}

		public async Task<IEnumerable<TaskEntity>> GetByCreatorAsync(int creatorId)
		{
			return await _context.Tasks
				.Include(t => t.CreatedBy)
				.Include(t => t.AssignedTo)
				.Where(t => t.CreatedById == creatorId)
				.OrderByDescending(t => t.CreatedAt)
				.ToListAsync();
		}

		public async Task<IEnumerable<TaskEntity>> GetByAssigneeAsync(int assigneeId)
		{
			return await _context.Tasks
				.Include(t => t.CreatedBy)
				.Include(t => t.AssignedTo)
				.Where(t => t.AssignedToId == assigneeId)
				.OrderByDescending(t => t.CreatedAt)
				.ToListAsync();
		}
	}
}
