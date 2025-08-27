namespace B2eSolution.Server.Application.DTOs
{
    public record ProdutoDto(int IdProduto, string Nome, decimal Valor);
    public record ProdutoCreateDto(string Nome, decimal Valor);
    public record ProdutoCreateResultDto(int Id, string Message);
    public record ProdutoUpdateDto(string Nome, decimal Valor);
}
