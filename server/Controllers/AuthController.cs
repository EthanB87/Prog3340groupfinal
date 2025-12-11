using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prog3340GroupFinal.Data;
using System.Security.Claims;

namespace Prog3340GroupFinal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpGet("login")]
        public IActionResult Login([FromQuery] string returnUrl = "/")
        {
            var props = new AuthenticationProperties
            {
                RedirectUri = returnUrl
            };
            return Challenge(props, OpenIdConnectDefaults.AuthenticationScheme);
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult Me()
        {
            // Get email from claims
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (email == null)
                return Unauthorized();

            // Lookup user in database
            var user = _db.AppUsers.FirstOrDefault(u => u.Email == email);
            if (user == null)
                return NotFound();

            // Return user info
            return Ok(new
            {
                user.Id,
                user.Email,
                user.Role
            });
        }

        [HttpGet("logout")]
        [HttpPost("logout")]
        public IActionResult Logout([FromQuery] string? returnUrl = null)
        {
            var defaultRedirect = _config["Api:BaseAddress"] ?? "http://localhost:5173";
            var redirectUri = ResolveRedirectUrl(returnUrl, defaultRedirect);

            var props = new AuthenticationProperties
            {
                RedirectUri = redirectUri
            };

            // Google OpenID Connect does not expose a standard end-session endpoint, so we only clear
            // our local auth cookie and then redirect back to the frontend.
            return SignOut(props, CookieAuthenticationDefaults.AuthenticationScheme);
        }

        private static string ResolveRedirectUrl(string? requestedUrl, string defaultRedirect)
        {
            if (string.IsNullOrWhiteSpace(requestedUrl))
                return defaultRedirect;

            if (Uri.TryCreate(requestedUrl, UriKind.Absolute, out var absolute))
                return absolute.ToString();

            if (Uri.TryCreate(defaultRedirect, UriKind.Absolute, out var baseUri))
                return new Uri(baseUri, requestedUrl).ToString();

            return defaultRedirect;
        }

        [HttpGet("denied")]
        public IActionResult AccessDenied()
        {
            return Forbid();
        }

        [HttpGet("debug")]
        [Authorize]
        public IActionResult Debug()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            var appUsers = _db.AppUsers.ToList();

            return Ok(new
            {
                currentEmail = email,
                appUsers = appUsers,
                userMatchingEmail = appUsers.FirstOrDefault(c => c.Username == email)
            });
        }

        [HttpPost("register")]
        [Authorize]
        public IActionResult Register()
        {
            // Get email from claims
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (email == null)
                return Unauthorized();

            // Lookup user in database
            var user = _db.AppUsers.FirstOrDefault(u => u.Email == email);
            if (user == null)
                return NotFound();

            // Return user info
            return Ok(new
            {
                user.Id,
                user.Email,
                user.Role
            });
        }

        
        [HttpPost("google")]
        [Authorize]
        public IActionResult Google()
        {
            // Get email from claims
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (email == null)
                return Unauthorized();

            // Lookup user in database
            var user = _db.AppUsers.FirstOrDefault(u => u.Email == email);
            if (user == null)
                return NotFound();

            // Return user info
            return Ok(new
            {
                user.Id,
                user.Email,
                user.Role
            });
        }
        [HttpPost("refresh")]
        [Authorize]
        public IActionResult Refresh()
        {
            // Get email from claims
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (email == null)
                return Unauthorized();

            // Lookup user in database
            var user = _db.AppUsers.FirstOrDefault(u => u.Email == email);
            if (user == null)
                return NotFound();

            // Return user info
            return Ok(new
            {
                user.Id,
                user.Email,
                user.Role
            });
        }
    }
}
