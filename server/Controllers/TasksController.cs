using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Prog3340GroupFinal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        [HttpGet()]
        [Authorize]
        public IActionResult GetAllTasks()
        {
            throw new NotImplementedException();
        }


        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetAllTasks([FromRoute]string id)
        {
            throw new NotImplementedException();
        }

        [HttpPost()]
        [Authorize]
        public IActionResult CreateTask()
        {
            throw new NotImplementedException();
        }

        [HttpPut("{id}")]
        [Authorize]
        public IActionResult UpdateTask([FromRoute]string id)
        {
            throw new NotImplementedException();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteTask([FromRoute] string id)
        {
            throw new NotImplementedException();
        }

        [HttpGet("my")]
        [Authorize]
        public IActionResult MyTasks()
        {
            throw new NotImplementedException();
        }

        [HttpGet("assigned")]
        [Authorize]
        public IActionResult GetAssignedTasks()
        {
            throw new NotImplementedException();
        }
    }
}
