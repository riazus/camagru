using back.Data;
using back.Models.User;
using Microsoft.EntityFrameworkCore;

namespace back.Services.UserServices
{
    public class UserService : IUserService
    {
        private readonly ReunionDbContext _context;

        public UserService(ReunionDbContext context)
        {
            _context = context;
        }

        public async Task<User> AddUser(User newUser)
        {
            this._context.Users.Add(newUser);
            await this._context.SaveChangesAsync();

            return newUser;
        }

        public async Task<User?> GetById(Guid userId)
        {
            return await _context.Users
                .Where(_user => _user.Id == userId)
                .FirstOrDefaultAsync();
        }

        public async Task<User?> GetByEmail(string userEmail)
        {
            return await _context.Users
                .Where(_user => _user.Email == userEmail)
                .FirstOrDefaultAsync();
        }

        async public Task<List<User>> GetAll()
        {
            return await _context.Users.ToListAsync();
        }
    }
}
