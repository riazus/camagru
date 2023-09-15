namespace back.Models.User
{
    public class UserDTO
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string NickName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? RefreshToken { get; set; } = null!;
    }
}
