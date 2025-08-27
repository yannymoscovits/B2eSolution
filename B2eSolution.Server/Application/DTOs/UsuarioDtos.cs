namespace B2eSolution.Server.Application.DTOs
{
    public record UsuarioCreateDto(string Login, string Senha);
    public record UsuarioDto(int IdUsuario, string Login, DateTime DataInclusao);

}
