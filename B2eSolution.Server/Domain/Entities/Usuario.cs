namespace B2eSolution.Api.Domain.Entities
{
    public class Usuario
    {
        public int IdUsuario { get; set; }
        public string Login { get; set; } = "";
        public string Senha { get; set; } = ""; //Terá hash
        public DateTime DataInclusao { get; set; } = DateTime.UtcNow;
    }
}
