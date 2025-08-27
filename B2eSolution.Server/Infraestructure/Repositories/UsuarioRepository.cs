using B2eSolution.Server.Application.Interfaces;
using B2eSolution.Server.Domain.Entities;
using B2eSolution.Server.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace B2eSolution.Server.Infrastructure.Repositories;
public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _db;
    public UsuarioRepository(AppDbContext db) => _db = db;

    public Task<Usuario?> GetByLoginAsync(string login) =>
        _db.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Login == login);
    public async Task AddAsync(Usuario u) { _db.Usuarios.Add(u); await _db.SaveChangesAsync(); }
}
