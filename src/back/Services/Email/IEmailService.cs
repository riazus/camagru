namespace back.Services.Email
{
    public interface IEmailService
    {
        void Send(string to, string subject, string html, string from = null);
    }
}
