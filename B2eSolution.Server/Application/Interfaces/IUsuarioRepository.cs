using B2eSolution.Api.Domain.Entities;
namespace B2eSolution.Api.Application.Interfaces;
public interface IUsuarioRepository
{
    Task<Usuario?> GetByLoginAsync(string login);
    Task AddAsync(Usuario u);
}
