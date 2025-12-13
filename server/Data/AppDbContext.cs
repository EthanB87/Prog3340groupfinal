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
				new AppUser { Id = 1, Email = "admin@gmail.com", Username = "admin", PasswordHash = "changeme", Role = "Admin", CreatedAt = now },
				new AppUser { Id = 2, Email = "user1@example.com", Username = "user1", PasswordHash = "changeme", Role = "User", CreatedAt = now },
				new AppUser { Id = 3, Email = "user2@example.com", Username = "user2", PasswordHash = "changeme", Role = "User", CreatedAt = now },
				new AppUser { Id = 4, Email = "user3@example.com", Username = "user3", PasswordHash = "changeme", Role = "User", CreatedAt = now },
				new AppUser { Id = 5, Email = "user4@example.com", Username = "user4", PasswordHash = "changeme", Role = "User", CreatedAt = now }
			);
		}
	}
}
