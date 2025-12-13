using Prog3340GroupFinal.Models;
using TaskEntity = Prog3340GroupFinal.Models.Task;

namespace Prog3340GroupFinal.Repositories
{
	public interface ITaskRepository : IRepository<TaskEntity>
	{
		Task<(IEnumerable<TaskEntity> Data, int TotalCount)> GetPagedAsync(TaskQueryParameters query);
		Task<TaskEntity?> GetWithUsersAsync(int id);
		Task<IEnumerable<TaskEntity>> GetByCreatorAsync(int creatorId);
		Task<IEnumerable<TaskEntity>> GetByAssigneeAsync(int assigneeId);
	}
}
