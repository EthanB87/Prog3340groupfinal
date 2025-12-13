using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Prog3340GroupFinal.Data;
using Prog3340GroupFinal.Hubs;
using Prog3340GroupFinal.Models;
using Prog3340GroupFinal.Repositories;
using Prog3340GroupFinal.Services;
using System.Security.Claims;

namespace Prog3340GroupFinal.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class TasksController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly IHubContext<NotificationHub> _hubContext;
		private readonly ITaskCacheService _taskCacheService;
		private readonly ILogger<TasksController> _logger;

		public TasksController(
			IUnitOfWork unitOfWork, 
			IHubContext<NotificationHub> context, 
			ITaskCacheService cacheService, 
			ILogger<TasksController> logger)
		{
			_unitOfWork = unitOfWork;
			_hubContext = context;
			_taskCacheService = cacheService;
			_logger = logger;
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> GetAllTasks([FromQuery] TaskQueryParameters query)
		{
			var (data, totalCount) = await _unitOfWork.Tasks.GetPagedAsync(query);
			var totalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize);

			return Ok(new
			{
				data,
				page = query.Page,
				pageSize = query.PageSize,
				totalCount,
				totalPages
			});
		}

		[HttpGet("{id:int}")]
		[Authorize]
		public async Task<IActionResult> GetTask([FromRoute] int id)
		{
			var (task, cacheHit) = await _taskCacheService.GetTaskWithCacheInfoAsync(id);
			Response.Headers["X-Cache"] = cacheHit ? "HIT" : "MISS";

			if (task == null)
			{
				return NotFound();
			}

			return Ok(task);
		}

		[HttpPost]
		[Authorize]
		public async Task<IActionResult> CreateTask([FromBody] TaskCreateRequest request)
		{
			var currentUser = await GetCurrentUserAsync();
			if (currentUser == null)
			{
				return Unauthorized();
			}

			var entity = new Models.Task
			{
				Title = request.Title,
				Description = request.Description,
				Status = request.Status,
				AssignedToId = request.AssignedToId,
				CreatedById = currentUser.Id,
				CreatedAt = DateTime.UtcNow,
				UpdatedAt = DateTime.UtcNow,
				IsArchived = false
			};

			await _unitOfWork.Tasks.AddAsync(entity);
			await _hubContext.Clients.All.SendAsync("Task Created", entity);

			return CreatedAtAction(nameof(GetTask), new { id = entity.Id }, entity);
		}

		[HttpPut("{id:int}")]
		[Authorize]
		public async Task<IActionResult> UpdateTask([FromRoute] int id, [FromBody] TaskUpdateRequest request)
		{
			var task = await _unitOfWork.Tasks.GetByIdAsync(id);
			if (task == null)
			{
				return NotFound();
			}

			task.Title = request.Title;
			task.Description = request.Description;
			task.Status = request.Status;
			task.AssignedToId = request.AssignedToId;
			task.UpdatedAt = DateTime.UtcNow;

			await _unitOfWork.Tasks.UpdateAsync(task);
			await _hubContext.Clients.All.SendAsync("Task Updated", task);
			_taskCacheService.InvalidateTask(id);
			return Ok(task);
		}

		[HttpDelete("{id:int}")]
		[Authorize]
		public async Task<IActionResult> DeleteTask([FromRoute] int id)
		{
			var task = await _unitOfWork.Tasks.GetByIdAsync(id);
			if (task == null)
			{
				return NotFound();
			}

			await _unitOfWork.Tasks.DeleteAsync(task);
			await _hubContext.Clients.All.SendAsync("Task Deleted", id);
			_taskCacheService.InvalidateTask(id);
			return NoContent();
		}

		[HttpGet("my")]
		[Authorize]
		public async Task<IActionResult> MyTasks()
		{
			var currentUser = await GetCurrentUserAsync();
			if (currentUser == null)
			{
				return Unauthorized();
			}

			var tasks = await _unitOfWork.Tasks.GetByCreatorAsync(currentUser.Id);

			return Ok(tasks);
		}

		[HttpGet("assigned")]
		[Authorize]
		public async Task<IActionResult> GetAssignedTasks()
		{
			var currentUser = await GetCurrentUserAsync();
			if (currentUser == null)
			{
				return Unauthorized();
			}

			var tasks = await _unitOfWork.Tasks.GetByAssigneeAsync(currentUser.Id);

			return Ok(tasks);
		}

		private async Task<AppUser?> GetCurrentUserAsync()
		{
			var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (int.TryParse(idClaim, out var userId))
			{
				return await _unitOfWork.Users.GetByIdAsync(userId);
			}

			var email = User.FindFirstValue(ClaimTypes.Email);
			if (!string.IsNullOrWhiteSpace(email))
			{
				return await _unitOfWork.Users.GetByEmailAsync(email);
			}

			var username = User.Identity?.Name;
			if (!string.IsNullOrWhiteSpace(username))
			{
				return await _unitOfWork.Users.GetByUsernameAsync(username);
			}

			_logger.LogWarning("Unable to resolve current user from claims.");
			return null;
		}
	}
}
