using B2eSolution.Server.Domain.Entities;
namespace B2eSolution.Server.Application.Interfaces;
public interface IUsuarioRepository
{
    Task<Usuario?> GetByLoginAsync(string login);
    Task AddAsync(Usuario u);
}
