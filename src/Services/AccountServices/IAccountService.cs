using back.Entities;
using back.Models.Accounts;

namespace back.Services.UserServices
{
    public interface IAccountService
    {
        AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress);
        AuthenticateResponse RefreshToken(string token, string ipAddress);
        void RevokeToken(string token, string ipAddress);
        Tuple<bool, Account> Register(RegisterRequest model);
        void VerifyEmail(string token);
        Account ForgotPassword(ForgotPasswordRequest model);
        void ValidateResetToken(ValidateResetTokenRequest model);
        void ResetPassword(ResetPasswordRequest model);
        IEnumerable<AccountResponse> GetAll();
        AccountResponse GetById(int id);
        AccountResponse Create(CreateRequest model);
        Tuple<bool, AccountResponse> Update(Account currUser, UpdateRequest model);
        void Delete(int id);
        Task SendVerificationEmail(Account account, string origin);
        Task SendPasswordResetEmail(Account account, string origin);
        Task SendAlreadyRegisteredEmail(string email, string origin);
    }
}
