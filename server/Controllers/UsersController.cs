using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Prog3340GroupFinal.Repositories;

namespace Prog3340GroupFinal.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private readonly IUserRepository _userRepository;

		public UsersController(IUserRepository userRepository)
		{
			_userRepository = userRepository;
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> GetAllUsers()
		{
			var users = await _userRepository.GetAllAsync();

			return Ok(users.Select(u => new
			{
				u.Id,
				u.Username,
				u.Email,
				u.Role,
				u.CreatedAt
			}));
		}

		[HttpGet("{id:int}")]
		[Authorize]
		public async Task<IActionResult> GetUserById([FromRoute] int id)
		{
			var user = await _userRepository.GetByIdAsync(id);

			if (user == null)
			{
				return NotFound();
			}

			return Ok(new
			{
				user.Id,
				user.Username,
				user.Email,
				user.Role,
				user.CreatedAt
			});
		}
	}
}
