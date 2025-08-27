using B2eSolution.Api.Application.Interfaces;
using B2eSolution.Api.Domain.Entities;
using B2eSolution.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace B2eSolution.Api.Infrastructure.Repositories;
public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _db;
    public UsuarioRepository(AppDbContext db) => _db = db;

    public Task<Usuario?> GetByLoginAsync(string login) =>
        _db.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Login == login);
    public async Task AddAsync(Usuario u) { _db.Usuarios.Add(u); await _db.SaveChangesAsync(); }
}
