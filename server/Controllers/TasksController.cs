using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Prog3340GroupFinal.Data;
using Prog3340GroupFinal.Hubs;
using Prog3340GroupFinal.Models;
using Prog3340GroupFinal.Repositories;
using System.Security.Claims;

namespace Prog3340GroupFinal.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class TasksController : ControllerBase
	{
		private readonly ITaskRepository _taskRepository;
		private readonly IUnitOfWork _unitOfWork;
		private readonly IUserRepository _userRepository;
		private readonly IHubContext<NotificationHub> _hubContext;
		private readonly ILogger<TasksController> _logger;

		public TasksController(ITaskRepository taskRepository, IUnitOfWork unitOfWork, IUserRepository userRepository, IHubContext<NotificationHub> context, ILogger<TasksController> logger)
		{
			_taskRepository = taskRepository;
			_unitOfWork = unitOfWork;
			_userRepository = userRepository;
			_hubContext = context;
			_logger = logger;
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> GetAllTasks([FromQuery] TaskQueryParameters query)
		{
			var (data, totalCount) = await _taskRepository.GetPagedAsync(query);
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
			var task = await _taskRepository.GetWithUsersAsync(id);

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

			await _taskRepository.AddAsync(entity);
			await _hubContext.Clients.All.SendAsync("Task Created", entity);

			return CreatedAtAction(nameof(GetTask), new { id = entity.Id }, entity);
		}

		[HttpPut("{id:int}")]
		[Authorize]
		public async Task<IActionResult> UpdateTask([FromRoute] int id, [FromBody] TaskUpdateRequest request)
		{
			var task = await _taskRepository.GetByIdAsync(id);
			if (task == null)
			{
				return NotFound();
			}

			task.Title = request.Title;
			task.Description = request.Description;
			task.Status = request.Status;
			task.AssignedToId = request.AssignedToId;
			task.UpdatedAt = DateTime.UtcNow;

			await _taskRepository.UpdateAsync(task);
			await _hubContext.Clients.All.SendAsync("Task Updated", task);
			return Ok(task);
		}

		[HttpDelete("{id:int}")]
		[Authorize]
		public async Task<IActionResult> DeleteTask([FromRoute] int id)
		{
			var task = await _taskRepository.GetByIdAsync(id);
			if (task == null)
			{
				return NotFound();
			}

			await _taskRepository.DeleteAsync(task);
			await _hubContext.Clients.All.SendAsync("Task Deleted", id);
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

			var tasks = await _taskRepository.GetByCreatorAsync(currentUser.Id);

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

			var tasks = await _taskRepository.GetByAssigneeAsync(currentUser.Id);

			return Ok(tasks);
		}

		private async Task<AppUser?> GetCurrentUserAsync()
		{
			var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (int.TryParse(idClaim, out var userId))
			{
				return await _userRepository.GetByIdAsync(userId);
			}

			var email = User.FindFirstValue(ClaimTypes.Email);
			if (!string.IsNullOrWhiteSpace(email))
			{
				return await _userRepository.GetByEmailAsync(email);
			}

			var username = User.Identity?.Name;
			if (!string.IsNullOrWhiteSpace(username))
			{
				return await _userRepository.GetByUsernameAsync(username);
			}

			_logger.LogWarning("Unable to resolve current user from claims.");
			return null;
		}
	}
}
