using Microsoft.EntityFrameworkCore;
using TaskManagerChallenge.Models;

namespace TaskManagerChallenge.Data
{

    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<TaskModel> Tasks { get; set; }
        public DbSet<UserModel> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Automatically generate a Guid for Id field on creation
            modelBuilder.Entity<TaskModel>()
                .Property(t => t.Id)
                .ValueGeneratedOnAdd();
        }
    }
}
