using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Prog3340GroupFinal.Models
{
	public enum TaskStatus
	{
		ToDo = 0,
		Development = 1,
		Review = 2,
		Merge = 3,
		Done = 4
	}

	public class Task
	{
		public int Id { get; set; }

		[Required]
		[MaxLength(255)]
		public string Title { get; set; } = string.Empty;

		public string? Description { get; set; }

		[Required]
		public TaskStatus Status { get; set; }

		[Required]
		public int CreatedById { get; set; }

		public int? AssignedToId { get; set; }

		[Required]
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

		[Required]
		public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

		[Required]
		public bool IsArchived { get; set; }

		public DateTime? ArchivedAt { get; set; }

		[ForeignKey(nameof(CreatedById))]
		public AppUser? CreatedBy { get; set; }

		[ForeignKey(nameof(AssignedToId))]
		public AppUser? AssignedTo { get; set; }
	}
}
