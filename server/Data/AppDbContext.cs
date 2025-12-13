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
		}
	}
}
