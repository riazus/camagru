using back.Models.User;
using back.Services.UserServices;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Security.Cryptography;

namespace ReunionApi.Controllers
{
    [ApiController]
    [Route("signin")]
    public class SignInController : ControllerBase
    {
        private readonly IUserService _userService;

        public SignInController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult<UserDTO>> createNewUser(UserDTO userDTO)
        {
            return StatusCode(500);
            /*User user = new User();

            if (userDTO.Email == null || userDTO.PlainPassword == null)
            {
                return BadRequest("Email and password are required.");
            }

            var isUserExists = await _userService.IsUserExists(userDTO);
            if (isUserExists)
            {
                return Conflict("User already exists.");
            }

            try
            {
                CreatePasswordHash(userDTO.PlainPassword, out byte[] passwordHash);
                user.Id = Guid.NewGuid();
                //user.PasswordHash = passwordHash;
                user.FirstName = userDTO.FirstName;
                user.LastName = userDTO.LastName;
                user.NickName = new String(user.FirstName[0] + user.LastName).ToLower();
                user.Email = userDTO.Email;

                await _userService.AddUser(user);

                return Ok(user.ToDtoModel());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }*/
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}
