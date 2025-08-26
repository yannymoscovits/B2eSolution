using B2eSolution.Server.Domain.Entities;

namespace B2eSolution.Server.Application.Interfaces
{
    public interface IProdutoRepository
    {
        Task<(int total, List<Produto> itens)> GetPagedAsync(int pagina, int tamanho, bool desc);
        Task<List<Produto>> GetAllAsync();
        Task<Produto?> GetByIdAsync(int id);
        Task AddAsync(Produto p);
        Task UpdateAsync(Produto p);
        Task DeleteAsync(Produto p);
    }
}
