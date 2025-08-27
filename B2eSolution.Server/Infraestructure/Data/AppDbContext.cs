using B2eSolution.Server.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace B2eSolution.Server.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Produto> Produtos => Set<Produto>();
    protected override void OnModelCreating(ModelBuilder m)
    {
        m.Entity<Usuario>(e => {
            e.ToTable("Usuario"); e.HasKey(x => x.IdUsuario);
            e.Property(x => x.Login).HasMaxLength(50).IsRequired();
            e.Property(x => x.Senha).HasMaxLength(200).IsRequired();
        });
        m.Entity<Produto>(e => {
            e.ToTable("Produto"); e.HasKey(x => x.IdProduto);
            e.Property(x => x.Nome).HasMaxLength(100).IsRequired();
            e.Property(x => x.Valor).HasColumnType("decimal(10,2)");
        });
    }
}
