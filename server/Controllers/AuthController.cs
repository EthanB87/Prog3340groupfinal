using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Prog3340GroupFinal.Data;
// Assuming you have an AppUser model here
using Prog3340GroupFinal.Models;
using Prog3340GroupFinal.Repositories;
using Prog3340GroupFinal.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Prog3340GroupFinal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;
        private readonly JwtService _jwtService;
        private readonly IPasswordRepository _passwordRepository;

        public AuthController(AppDbContext db, IConfiguration config, JwtService jwtService, IPasswordRepository passwordRepository)
        {
            _db = db;
            _config = config;
            _jwtService = jwtService;
            _passwordRepository = passwordRepository;
        }

        // DTOs (Data Transfer Objects) for requests
        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class RegisterRequest : LoginRequest
        {
            public string Username { get; set; } = string.Empty;
        }

        // --- Core Endpoint Implementations ---

        // POST /api/auth/register: User registration
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }

            // 1. Check if user already exists
            if (_db.AppUsers.Any(u => u.Email == request.Email))
            {
                return Conflict(new { message = "User with this email already exists." });
            }

            // 2. Hash Password (Placeholder for secure implementation)
            string hashedPassword = _passwordRepository.HashPassword(request.Password);

            // 3. Create new user model
            var newUser = new AppUser
            {
                Email = request.Email,
                Username = request.Username,
                PasswordHash = hashedPassword,
                Role = "User", // Default role
            };

            // 4. Save to database
            _db.AppUsers.Add(newUser);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Me), new { message = "Registration successful." });
        }


        // POST /api/auth/login: Login with username/password (Local Authentication)
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }

            // 1. Lookup User in Database
            var user = _db.AppUsers.FirstOrDefault(u => u.Email == request.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials." });
            }

            // 2. Password Verification
            bool passwordValid = _passwordRepository.VerifyPassword(request.Password, user.PasswordHash);
            if (!passwordValid)
            {
                return Unauthorized(new { message = "Invalid credentials." });
            }

            // 3. Sign In (Issue the Cookie)
            return await SignInUser(user);
        }

        // GET /api/auth/me: Get current user info
        // Requires authentication via either Cookie or Bearer Token (if you added scheme support)
        [HttpGet("me")]
        [Authorize]
        public IActionResult Me()
        {
            // Get email from claims
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (email == null)
                return Unauthorized();

            // Lookup user in database; if missing, auto-provision a basic user
            var user = _db.AppUsers.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                var username = email.Split('@')[0];
                user = new Models.AppUser
                {
                    Email = email,
                    Username = username,
                    PasswordHash = "external-login",
                    Role = "User",
                    CreatedAt = DateTime.UtcNow,
                    ExternalProvider = "Google",
                    ExternalId = email
                };
                _db.AppUsers.Add(user);
                _db.SaveChanges();
            }

//                 user = new AppUser
//                 {
//                     Email = email,
//                     Username = email.Split('@')[0],
//                     Role = "User",
//                     CreatedAt = DateTime.UtcNow,
//                     PasswordHash = ""
//                 };

//                 _db.AppUsers.Add(user);
//                 _db.SaveChangesAsync();
//             }
            // Return user info
            return Ok(new
            {
                user.Id,
                user.Email,
                user.Role
            });
        }

        // POST /api/auth/refresh: Refresh JWT token
        // This is typically called by a JWT scheme, but here, we just re-return user info
        // and let the client request a new JWT if needed, or rely on cookie refresh.
        [HttpPost("refresh")]
        [Authorize]
        public IActionResult Refresh()
        {
            // If the request succeeds, it means the current authentication method (cookie or token) is valid.
            // For JWT, the client would use the claims to generate a new token via JwtService if desired,
            // or you could use a dedicated refresh token flow.

            // For now, let's reuse the logic of 'Me' as a simple validation/refresh check.
            return Me();
        }

        // GET /api/auth/login: Initiates Google OAuth Challenge (OIDC)
        [HttpGet("login")]
        [AllowAnonymous]
        public IActionResult LoginOidc([FromQuery] string returnUrl = "/")
        {
            var props = new AuthenticationProperties
            {
                RedirectUri = returnUrl
            };
            return Challenge(props, OpenIdConnectDefaults.AuthenticationScheme);
        }

        // POST /api/auth/google: Google OAuth callback (Handled by ASP.NET Core internally, but often used for final user creation/sign-in logic)
        // Since ASP.NET Core OIDC handler does the sign-in, this method is usually obsolete or used for custom claim manipulation.
        [HttpPost("google")]
        [Authorize]
        public IActionResult GoogleCallbackPost()
        {
            // If the user reaches this authorized endpoint, they have successfully authenticated via Google OIDC.
            // The cookie has been set. We redirect them to 'Me' to return user data.
            return Me();
        }

        [HttpGet("logout")]
        [HttpPost("logout")]
        [AllowAnonymous]
        public IActionResult Logout([FromQuery] string? returnUrl = null)
        {
            var defaultRedirect = _config["Api:BaseAddress"] ?? "http://localhost:5173";
            var redirectUri = ResolveRedirectUrl(returnUrl, defaultRedirect);

            var props = new AuthenticationProperties
            {
                RedirectUri = redirectUri
            };
            // Signs out the user by deleting the authentication cookie.
            return SignOut(props, CookieAuthenticationDefaults.AuthenticationScheme);
        }

        [HttpGet("denied")]
        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return Forbid();
        }

        // --- Private Helpers ---

        // Centralized method to sign in a user and issue the cookie
        private async Task<IActionResult> SignInUser(AppUser user)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Name, user.Email),
                new(ClaimTypes.Role, user.Role)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

            var authProps = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
            };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal, authProps);

            var token = _jwtService.GenerateToken(claimsPrincipal);

            return Ok(new
            {
                user.Id,
                user.Email,
                user.Role,
                Token = token,
                message = "Sign in successful"
            });
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
    }
}
