namespace Prog3340GroupFinal.Models
{
    public class AppUser
    {
        public int Id { get; set; }
        public string Email { get; set; } = default!;
        public string Username { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;
        public string Role { get; set; } = "User";
        public DateTime CreatedAt { get; set; }
        public string? ExternalProvider { get; set; } = "Google";
        public string? ExternalId { get; set; }
    }
}
