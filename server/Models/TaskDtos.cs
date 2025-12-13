using System.ComponentModel.DataAnnotations;

namespace Prog3340GroupFinal.Models
{
	public class TaskCreateRequest
	{
		[Required]
		[MaxLength(255)]
		public string Title { get; set; } = string.Empty;

		public string? Description { get; set; }

		[Required]
		public TaskStatus Status { get; set; } = TaskStatus.ToDo;

		public int? AssignedToId { get; set; }
	}

	public class TaskUpdateRequest
	{
		[Required]
		[MaxLength(255)]
		public string Title { get; set; } = string.Empty;

		public string? Description { get; set; }

		[Required]
		public TaskStatus Status { get; set; }

		public int? AssignedToId { get; set; }
	}

	public class TaskQueryParameters
	{
		private const int MaxPageSize = 100;

		private int _pageSize = 20;

		[Range(1, int.MaxValue)]
		public int Page { get; set; } = 1;

		[Range(1, MaxPageSize)]
		public int PageSize
		{
			get => _pageSize;
			set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
		}

		public TaskStatus? Status { get; set; }
		public int? AssignedTo { get; set; }
		public int? CreatedBy { get; set; }
		[MaxLength(255)]
		public string? Search { get; set; }
	}
}
