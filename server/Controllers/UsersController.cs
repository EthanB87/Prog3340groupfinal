using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Prog3340GroupFinal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [HttpGet()]
        [Authorize]
        public IActionResult GetAllUsers()
        {
            throw new NotImplementedException();
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetUserById([FromRoute]string id)
        {
            throw new NotImplementedException();
        }
    }
}
