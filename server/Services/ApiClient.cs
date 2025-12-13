using System.Security.Claims;

namespace Prog3340GroupFinal.Services
{
    public class ApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly JwtService _jwtService;
        public ApiClient(HttpClient httpClient, JwtService jwtService)
        {
            _httpClient = httpClient;
            _jwtService = jwtService;
        }
        private void AttachJwtToken(ClaimsPrincipal user)
        { var token = _jwtService.GenerateToken(user); _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token); 
        }
        public async Task<(string, string)> GetProtectedDataAsync(string path, ClaimsPrincipal principal) 
        { 
            AttachJwtToken(principal); 
            var requestUri = new Uri(_httpClient.BaseAddress!, path); 
            var response = await _httpClient.GetAsync(requestUri); 
            var body = await response.Content.ReadAsStringAsync(); 
            return (response.StatusCode.ToString(), body); 
        }
    }
}
