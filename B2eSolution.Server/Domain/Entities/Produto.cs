namespace B2eSolution.Server.Domain.Entities
{
    public class Produto
    {
        public int IdProduto { get; set; }
        public string Nome { get; set; } = "";
        public decimal Valor { get; set; }
        public DateTime DataInclusao { get; set; } = DateTime.UtcNow;
    }
}
