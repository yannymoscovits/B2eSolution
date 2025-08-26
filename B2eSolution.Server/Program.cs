using B2eSolution.Server.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
var app = builder.Build();

app.UseCors("AllowAll");
if (app.Environment.IsDevelopment()) {
    app.UseSwagger(); app.UseSwaggerUI(); 
}

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<B2eSolution.Server.Infrastructure.Data.AppDbContext>();
    db.Database.EnsureCreated();
    var hasher = scope.ServiceProvider.GetRequiredService<B2eSolution.Server.Application.Interfaces.IPasswordHasher>();
    if (!db.Usuarios.Any())
    {
        db.Usuarios.Add(new B2eSolution.Server.Domain.Entities.Usuario { Login = "admin", Senha = hasher.Hash("Admin@123") }); //SENHA ADM
        db.SaveChanges();
    }
}
app.Run();
