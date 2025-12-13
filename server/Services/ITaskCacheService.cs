using TaskEntity = Prog3340GroupFinal.Models.Task;

namespace Prog3340GroupFinal.Services
{
	public interface ITaskCacheService
	{
		Task<(TaskEntity? task, bool cacheHit)> GetTaskWithCacheInfoAsync(int taskId);
		void InvalidateTask(int taskId);
	}
}
