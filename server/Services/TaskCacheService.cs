using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Prog3340GroupFinal.Data;
using Prog3340GroupFinal.Repositories;
using TaskEntity = Prog3340GroupFinal.Models.Task;

namespace Prog3340GroupFinal.Services
{
	public class TaskCacheService : ITaskCacheService
	{
		private readonly IMemoryCache _cache;
		private readonly IUnitOfWork _unitOfWork ;
		private readonly TimeSpan _ttl;

		public TaskCacheService(
			IMemoryCache cache,
			IUnitOfWork unitOfWork,
			IOptions<TaskCacheOptions> options)
		{
			_cache = cache;
			_unitOfWork = unitOfWork;
			_ttl = TimeSpan.FromMinutes(options.Value.TaskTtlMinutes);
		}

		public async Task<(TaskEntity?, bool)> GetTaskWithCacheInfoAsync(int taskId)
		{
			var cacheKey = $"task_{taskId}";

			if (_cache.TryGetValue(cacheKey, out TaskEntity cachedTask))
			{
				return (cachedTask, true);
			}

			await Task.Delay(2000);

			var task = await _unitOfWork.Tasks.GetWithUsersAsync(taskId);

			if (task != null)
			{
				_cache.Set(cacheKey, task, _ttl);
			}

			return (task, false);
		}

		public void InvalidateTask(int taskId)
		{
			_cache.Remove($"task_{taskId}");
		}
	}
}
