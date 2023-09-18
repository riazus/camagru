using back.Entities;
using Microsoft.EntityFrameworkCore;

namespace back.Data
{
    public class CamagruDbContext : DbContext
    {
        private readonly IConfiguration Configuration;

        public CamagruDbContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Commentary> Comments { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            // connect to ms sql database
            options.UseSqlServer(Configuration.GetConnectionString("WebApiDatabase"));
        }
    }
}
