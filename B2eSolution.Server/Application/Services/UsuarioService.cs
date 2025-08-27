using B2eSolution.Server.Application.DTOs;
using B2eSolution.Server.Domain.Entities;
using B2eSolution.Server.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public interface IUsuarioService
{
    Task<UsuarioDto> CriarAsync(UsuarioCreateDto dto);
}

public class UsuarioService : IUsuarioService
{
    private readonly AppDbContext _db;
    public UsuarioService(AppDbContext db) => _db = db;

    public async Task<UsuarioDto> CriarAsync(UsuarioCreateDto dto)
    {
        var login = dto.Login.Trim();

        if (string.IsNullOrWhiteSpace(login) || string.IsNullOrWhiteSpace(dto.Senha))
            throw new ArgumentException("Login e senha são obrigatórios.");

        var jaExiste = await _db.Usuarios.AnyAsync(u => u.Login == login);
        if (jaExiste) throw new InvalidOperationException("Login já existe.");

        var hash = BCrypt.Net.BCrypt.HashPassword(dto.Senha);

        var u = new Usuario
        {
            Login = login,
            Senha = hash,                // SALVA A HASH
            DataInclusao = DateTime.UtcNow
        };

        _db.Usuarios.Add(u);
        await _db.SaveChangesAsync();

        return new UsuarioDto(u.IdUsuario, u.Login, u.DataInclusao);
    }
}
