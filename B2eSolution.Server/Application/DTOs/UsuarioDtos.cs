namespace B2eSolution.Api.Application.DTOs
{
    public record UsuarioCreateDto(string Login, string Senha);
    public record UsuarioDto(int IdUsuario, string Login, DateTime DataInclusao);

}
