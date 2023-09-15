using back.Models.User;
using Microsoft.EntityFrameworkCore;

namespace back.Data
{
    public class ReunionDbContext : DbContext
    {
        public ReunionDbContext(DbContextOptions<ReunionDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity => { entity.HasIndex(e => e.Email).IsUnique(); });
        }
    }
}
