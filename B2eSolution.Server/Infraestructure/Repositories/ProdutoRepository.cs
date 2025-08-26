using B2eSolution.Server.Application.Interfaces;
using B2eSolution.Server.Domain.Entities;
using B2eSolution.Server.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace B2eSolution.Server.Infrastructure.Repositories;

public class ProdutoRepository : IProdutoRepository
{
    private readonly AppDbContext _db;
    public ProdutoRepository(AppDbContext db) => _db = db;

    public async Task<(int total, List<Produto> itens)> GetPagedAsync(int pagina, int tamanho, bool desc)
    {
        var q = _db.Produtos.AsNoTracking();
        q = desc ? q.OrderByDescending(p => p.Nome) : q.OrderBy(p => p.Nome);
        var total = await q.CountAsync();
        var itens = await q.Skip((pagina - 1) * tamanho).Take(tamanho).ToListAsync();
        return (total, itens);
    }
    public Task<List<Produto>> GetAllAsync() => _db.Produtos.AsNoTracking().ToListAsync();
    public Task<Produto?> GetByIdAsync(int id) => _db.Produtos.FindAsync(id).AsTask();
    public async Task AddAsync(Produto p) { _db.Produtos.Add(p); await _db.SaveChangesAsync(); }
    public async Task UpdateAsync(Produto p) { _db.Produtos.Update(p); await _db.SaveChangesAsync(); }
    public async Task DeleteAsync(Produto p) { _db.Produtos.Remove(p); await _db.SaveChangesAsync(); }
}
