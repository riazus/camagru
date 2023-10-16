namespace back.Models.Accounts;

using System.ComponentModel.DataAnnotations;

public class RegisterRequest
{
    [Required]
    public string Username { get; set; }   

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [MinLength(6)]
    public string Password { get; set; }

    [Required]
    [Compare("Password")]
    public string ConfirmPassword { get; set; }
}