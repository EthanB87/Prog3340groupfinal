using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Prog3340GroupFinal.Data;
using Prog3340GroupFinal.Hubs;

namespace Prog3340GroupFinal.Services
{
	public class TaskCleanupService : BackgroundService
	{
		private readonly IServiceProvider _serviceProvider;
		private readonly IHubContext<NotificationHub> _hubContext;
		private readonly ILogger<TaskCleanupService> _logger;

		public TaskCleanupService(IServiceProvider serviceProvider, IHubContext<NotificationHub> hubContext, ILogger<TaskCleanupService> logger)
		{
			_serviceProvider = serviceProvider;
			_hubContext = hubContext;
			_logger = logger;
		}

		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			_logger.LogInformation("TaskCleanupService started.");

			while (!stoppingToken.IsCancellationRequested)
			{
				try
				{
					await ArchiveCompletedTasksAsync(stoppingToken);
				}
				catch (OperationCanceledException)
				{
					_logger.LogInformation("TaskCleanupService operation canceled.");
				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "Error occurred while archiving tasks.");
				}

				await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
			}

			_logger.LogInformation("TaskCleanupService stopping gracefully.");
		}

		private async Task ArchiveCompletedTasksAsync(CancellationToken stoppingToken)
		{
			using var scope = _serviceProvider.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

			var cutoffTime = DateTime.UtcNow.Subtract(TimeSpan.FromSeconds(5));

			var tasksToArchive = await context.Tasks
				.Where(t =>
					t.Status.Equals("Done") &&
					t.UpdatedAt < cutoffTime &&
					!t.IsArchived)
				.ToListAsync(stoppingToken);

			if (!tasksToArchive.Any())
				return;

			foreach (var task in tasksToArchive)
			{
				task.IsArchived = true;
				task.ArchivedAt = DateTime.UtcNow;

				_logger.LogInformation($"Archived task {task.Id} at {task.ArchivedAt}");
			}

			await context.SaveChangesAsync(stoppingToken);

			await _hubContext.Clients.All.SendAsync(
				"TasksArchived",
				tasksToArchive.Select(t => t.Id),
				stoppingToken
			);
		}
	}
}
