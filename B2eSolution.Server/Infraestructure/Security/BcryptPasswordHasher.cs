using B2eSolution.Api.Application.Interfaces;
using BCryptNet = BCrypt.Net.BCrypt;

namespace B2eSolution.Api.Infrastructure.Security;
public class BcryptPasswordHasher : IPasswordHasher
{
    public string Hash(string plain) => BCrypt.Net.BCrypt.HashPassword(plain);
    public bool Verify(string plain, string hash) => BCrypt.Net.BCrypt.Verify(plain, hash);
}
