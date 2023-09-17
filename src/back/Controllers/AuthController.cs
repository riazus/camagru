using back.Entities;
using back.Models.User;
using back.Services.Jwt;
using back.Services.UserServices;
using Microsoft.AspNetCore.Mvc;

namespace back.Controllers;

[ApiController]
[Route("api")]
public class AuthController : ControllerBase
{
    /*private readonly IAccountService _accountService;
    private readonly IJwtService _jwtService;

    public AuthController(IAccountService userService, IJwtService jwtService)
    {
        _accountService = userService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerUser)
    {
        Account user = new Account();

        if (registerUser.Email == null || registerUser.Password == null)
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        var existUser = await _accountService.GetByEmail(registerUser.Email);
        if (existUser != null)
        {
            return Conflict(new { message = "User already exists." });
        }

        try
        {
            user.Id = Guid.NewGuid();
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerUser.Password);
            user.FirstName = registerUser.FirstName;
            user.LastName = registerUser.LastName;
            user.NickName = new String(user.FirstName[0] + user.LastName).ToLower();
            user.Email = registerUser.Email;

            await _accountService.AddUser(user);

            return Created("success", user.ToDtoModel());
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO login)
    {
        var user = await _accountService.GetByEmail(login.Email);

        if (user == null
            || !BCrypt.Net.BCrypt.Verify(login.Password, user.PasswordHash))
        {
            return BadRequest(new { message = "Invalid credentials" });
        }

        var jwt = _jwtService.Generate(user.Id);

        Response.Cookies.Append("jwt", jwt, new CookieOptions
        {
            HttpOnly = true
        });

        return Ok(user.ToDtoModel());
    }

    [HttpGet("user")]
    public async Task<IActionResult> User()
    {
        try
        {
            var jwt = Request.Cookies["jwt"];

            var token = _jwtService.Verify(jwt);

            Guid userId = Guid.Parse(token.Issuer);

            var user = await _accountService.GetById(userId);

            return Ok(user!.ToDtoModel());
        }
        catch (Exception _)
        {
            return Unauthorized();
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("jwt");

        return Ok();
    }*/
}