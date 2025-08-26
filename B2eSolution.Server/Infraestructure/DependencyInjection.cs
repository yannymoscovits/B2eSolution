using B2eSolution.Server.Application.Interfaces;
using B2eSolution.Server.Application.Services;
using B2eSolution.Server.Infrastructure.Data;
using B2eSolution.Server.Infrastructure.Repositories;
using B2eSolution.Server.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace B2eSolution.Server.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration cfg)
    {
        services.AddDbContext<AppDbContext>(o => o.UseSqlServer(cfg.GetConnectionString("DefaultConnection")));
        services.AddScoped<IProdutoRepository, ProdutoRepository>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
        services.AddScoped<IProdutoService, ProdutoService>();
        services.AddScoped<IAuthService, AuthService>();
        return services;
    }
}
