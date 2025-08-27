using B2eSolution.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace B2eSolution.Api.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Produto> Produtos => Set<Produto>();
    protected override void OnModelCreating(ModelBuilder m)
    {
        m.Entity<Usuario>(e =>
        {
            e.HasKey(x => x.IdUsuario);
            e.Property(x => x.Login).IsRequired().HasMaxLength(100);
            e.HasIndex(x => x.Login).IsUnique();
            e.Property(x => x.Senha).IsRequired().HasMaxLength(200); // aqui fica a HASH
            e.Property(x => x.DataInclusao).IsRequired();
        });
        m.Entity<Produto>(e => {
            e.ToTable("Produto"); e.HasKey(x => x.IdProduto);
            e.Property(x => x.Nome).HasMaxLength(100).IsRequired();
            e.Property(x => x.Valor).HasColumnType("decimal(10,2)");
        });
    }
}
