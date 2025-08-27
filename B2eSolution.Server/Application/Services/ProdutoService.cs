using B2eSolution.Server.Application.Common;
using B2eSolution.Server.Application.DTOs;
using B2eSolution.Server.Application.Interfaces;
using B2eSolution.Server.Domain.Entities;

namespace B2eSolution.Server.Application.Services;

public interface IProdutoService
{
    Task<PagedResult<ProdutoDto>> ListarAsync(int pagina, int tamanho, string ordem);
    Task<ProdutoCreateResultDto> CriarAsync(ProdutoCreateDto dto);
    Task AtualizarAsync(int id, ProdutoUpdateDto dto);
    Task ExcluirAsync(int id);
    Task<List<ProdutoDto>> ListarTodosAsync();
}

public class ProdutoService : IProdutoService
{
    private readonly IProdutoRepository _repo;
    public ProdutoService(IProdutoRepository repo) => _repo = repo;

    public async Task<PagedResult<ProdutoDto>> ListarAsync(int pagina, int tamanho, string ordem)
    {
        var desc = string.Equals(ordem, "desc", StringComparison.OrdinalIgnoreCase);
        var (total, itens) = await _repo.GetPagedAsync(pagina, tamanho, desc);
        return new PagedResult<ProdutoDto>
        {
            Total = total,
            Itens = itens.Select(p => new ProdutoDto(p.IdProduto, p.Nome, p.Valor)).ToList()
        };
    }
    public async Task<ProdutoCreateResultDto> CriarAsync(ProdutoCreateDto dto)
    {
        var p = new Produto { Nome = dto.Nome, Valor = dto.Valor };
        await _repo.AddAsync(p);

        return new ProdutoCreateResultDto(p.IdProduto, "Produto inserido com sucesso");
    }
    public async Task AtualizarAsync(int id, ProdutoUpdateDto dto)
    {
        var p = await _repo.GetByIdAsync(id) ?? throw new KeyNotFoundException("Produto não encontrado");
        p.Nome = dto.Nome; p.Valor = dto.Valor; await _repo.UpdateAsync(p);
    }
    public async Task ExcluirAsync(int id)
    {
        var p = await _repo.GetByIdAsync(id) ?? throw new KeyNotFoundException("Produto não encontrado");
        await _repo.DeleteAsync(p);
    }
    public async Task<List<ProdutoDto>> ListarTodosAsync()
    {
        var all = await _repo.GetAllAsync();
        return all.OrderBy(x => x.Nome).Select(x => new ProdutoDto(x.IdProduto, x.Nome, x.Valor)).ToList();
    }
}
