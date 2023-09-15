namespace back.Models.User
{
    public static class UserExtensions
    {
        public static List<UserDTO> ToDtoModel(this List<User> users)
        {
            List<UserDTO> userDTOs = new List<UserDTO>();

            foreach (var user in users)
            {
                userDTOs.Add(new UserDTO()
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    NickName = user.NickName,
                    Email = user.Email,
                    RefreshToken = user.RefreshToken
                });
            }

            return userDTOs;
        }

        public static UserDTO ToDtoModel(this User user)
        {
            return new UserDTO()
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                NickName = user.NickName,
                Email = user.Email,
                RefreshToken = user.RefreshToken
            };
        }
    }
}
