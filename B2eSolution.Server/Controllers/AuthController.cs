using B2eSolution.Server.Application.DTOs;
using B2eSolution.Server.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace B2eSolution.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    public AuthController(IAuthService auth) => _auth = auth;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req) =>
        await _auth.LoginAsync(req) ? Ok(new { message = "OK" }) : Unauthorized(new { message = "Usuário ou senha inválidos" });
}
