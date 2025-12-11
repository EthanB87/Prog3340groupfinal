using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Prog3340GroupFinal.Models
{
    public class Task
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }

        [Required]
        public TaskStatus Status { get; set; }
        public int CreatedById { get; set; }
        public int? AssignedToId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public bool IsArchived { get; set; }

        [ForeignKey(nameof(CreatedById))]
        public AppUser? CreatedBy { get; set; }

        [ForeignKey(nameof(AssignedToId))]
        public AppUser? AssignedTo { get; set; }
    }
}
