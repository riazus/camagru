using back.Models.User;

namespace back.Services.UserServices
{
    public interface IUserService
    {
        Task<User> AddUser(User newUser);
        Task<User?> GetById(Guid userId);
        Task<User?> GetByEmail(string userEmail);
        Task<List<User>> GetAll();
    }
}
