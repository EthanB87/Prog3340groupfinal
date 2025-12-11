using Microsoft.EntityFrameworkCore;
using Prog3340GroupFinal.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Prog3340GroupFinal.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }

        //public DbSet<Equipment> Equipments { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Example relationship
            //modelBuilder.Entity<TYPE>()
            //	.HasOne(r => r.Customer)
            //	.WithMany(c => c.Rentals)
            //	.HasForeignKey(r => r.CustomerId)
            //	.OnDelete(DeleteBehavior.Cascade);

            //modelBuilder.Entity<TYPE>()
            //	.HasOne(r => r.Equipment)
            //	.WithMany(e => e.Rentals)
            //	.HasForeignKey(r => r.EquipmentId)
            //	.OnDelete(DeleteBehavior.Restrict);



            // Seed example
            //modelBuilder.Entity<TYPE>().HasData(
            //    new TYPE
            //    {
            //        Id = 1
            //    }
            //);
            modelBuilder.Entity<AppUser>().HasData(
                new AppUser { Id = 1, Email = "admin@gmail.com", Role = "Admin", ExternalProvider = "Google", ExternalId = null},
                new AppUser { Id = 2, Email = "simonbrubacher@gmail.com", Role = "Admin", ExternalProvider = "Google", ExternalId = null},
                new AppUser { Id = 3, Email = "enterprisegroupassignment1@gmail.com", Role = "Admin", ExternalProvider = "Google", ExternalId = null }

            );
        }
    }
}