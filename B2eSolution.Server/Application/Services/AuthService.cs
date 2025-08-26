using B2eSolution.Server.Application.DTOs;
using B2eSolution.Server.Application.Interfaces;

namespace B2eSolution.Server.Application.Services;
public interface IAuthService { Task<bool> LoginAsync(LoginRequest req); }

public class AuthService : IAuthService
{
    private readonly IUsuarioRepository _users; private readonly IPasswordHasher _hasher;
    public AuthService(IUsuarioRepository users, IPasswordHasher hasher) { _users = users; _hasher = hasher; }

    public async Task<bool> LoginAsync(LoginRequest req)
    {
        var user = await _users.GetByLoginAsync(req.Login);
        return user is not null && _hasher.Verify(req.Senha, user.Senha);
    }
}
