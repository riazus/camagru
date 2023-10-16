using System.IdentityModel.Tokens.Jwt;

namespace back.Services.Jwt
{
    public interface IJwtService
    {
        string Generate(Guid id);
        JwtSecurityToken Verify(string jwt);
    }
}
