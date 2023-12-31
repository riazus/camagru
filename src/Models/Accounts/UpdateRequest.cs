namespace back.Models.Accounts;

using System.ComponentModel.DataAnnotations;

public class UpdateRequest
{
    private string _password;
    private string _confirmPassword;
    private string _email;
    
    public string Username { get; set; }
    public bool NeedSendNotifications { get; set; }

    [EmailAddress]
    public string Email
    {
        get => _email;
        set => _email = replaceEmptyWithNull(value);
    }

    [MinLength(6)]
    public string Password
    {
        get => _password;
        set => _password = replaceEmptyWithNull(value);
    }

    [Compare("Password")]
    public string ConfirmPassword 
    {
        get => _confirmPassword;
        set => _confirmPassword = replaceEmptyWithNull(value);
    }

    // helpers

    private string replaceEmptyWithNull(string value)
    {
        // replace empty string with null to make field optional
        return string.IsNullOrEmpty(value) ? null : value;
    }
}