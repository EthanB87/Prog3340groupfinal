using Microsoft.EntityFrameworkCore;
using Prog3340GroupFinal.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Prog3340GroupFinal.Data
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }

		public DbSet<AppUser> AppUsers { get; set; }
		public DbSet<Models.Task> Tasks { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<Models.Task>()
				.HasOne(t => t.CreatedBy)
				.WithMany()
				.HasForeignKey(t => t.CreatedById)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Models.Task>()
				.HasOne(t => t.AssignedTo)
				.WithMany()
				.HasForeignKey(t => t.AssignedToId)
				.OnDelete(DeleteBehavior.Restrict);

			var now = DateTime.UtcNow; 
			modelBuilder.Entity<AppUser>().HasData(
				new AppUser { Id = 1, Email = "admin@gmail.com", Username = "admin", PasswordHash = "GS0Djji+fJ41QPoO1Mr04rNzvbpUUJiOSmfx8WT+ywJf6EPAzpuvvbwPaEz+6XV+", Role = "Admin", CreatedAt = now },
				new AppUser { Id = 2, Email = "user1@example.com", Username = "user1", PasswordHash = "taYDOuf576RybWCF5c+lq1jeS9VfU3XFtOjq/DRA4hhqsqHArg1p6FemGQUE1n9R", Role = "User", CreatedAt = now },
				new AppUser { Id = 3, Email = "user2@example.com", Username = "user2", PasswordHash = "ftofJl4ipjNn2mhAPibvgbErpeHSgzPkUcnN40mGSWuJICfhYXi5zBtm2lX2g74n", Role = "User", CreatedAt = now },
				new AppUser { Id = 4, Email = "user3@example.com", Username = "user3", PasswordHash = "FdCpl5CnSNSIBnFXBTV9Ju8x6Oh6xGzfqMcQQ3y6uvJTn6e0W/FgNGSX4TysmC/2", Role = "User", CreatedAt = now },
				new AppUser { Id = 5, Email = "user4@example.com", Username = "user4", PasswordHash = "G3VDvmsMOmeEpv9nGqYcKsOueZoVie1WirnAj0oanlTCs2H9Mc3FU+nPf2y/ngWU", Role = "User", CreatedAt = now }
			);

			modelBuilder.Entity<Models.Task>().HasData(
				new Models.Task
				{
					Id = 1,
					Title = "Implement user authentication",
					Description = "Add OAuth2 authentication with Google and JWT support.",
					Status = Models.TaskStatus.Development,
					CreatedById = 1,
					AssignedToId = 2,
					CreatedAt = now.AddDays(-5),
					UpdatedAt = now.AddDays(-1),
					IsArchived = false
				},
				new Models.Task
				{
					Id = 2,
					Title = "Design landing page mockups",
					Description = "Create high-fidelity mockups for the landing page.",
					Status = Models.TaskStatus.Review,
					CreatedById = 2,
					AssignedToId = 3,
					CreatedAt = now.AddDays(-10),
					UpdatedAt = now.AddDays(-2),
					IsArchived = false
				},
				new Models.Task
				{
					Id = 3,
					Title = "Fix mobile responsive issues",
					Description = "Address layout breaking on mobile devices.",
					Status = Models.TaskStatus.ToDo,
					CreatedById = 3,
					AssignedToId = 4,
					CreatedAt = now.AddDays(-3),
					UpdatedAt = now.AddDays(-3),
					IsArchived = false
				},
				new Models.Task
				{
					Id = 4,
					Title = "API documentation refresh",
					Description = "Update endpoint docs with new auth requirements.",
					Status = Models.TaskStatus.Merge,
					CreatedById = 4,
					AssignedToId = 5,
					CreatedAt = now.AddDays(-7),
					UpdatedAt = now.AddDays(-1),
					IsArchived = false
				},
				new Models.Task
				{
					Id = 5,
					Title = "Archived task example",
					Description = "This task is archived and should show in admin only.",
					Status = Models.TaskStatus.Done,
					CreatedById = 1,
					AssignedToId = 2,
					CreatedAt = now.AddDays(-20),
					UpdatedAt = now.AddDays(-15),
					IsArchived = true,
					ArchivedAt = now.AddDays(-14)
				}
			);
		}
	}
}
