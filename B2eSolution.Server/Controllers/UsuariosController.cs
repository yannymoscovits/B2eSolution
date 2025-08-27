using B2eSolution.Api.Application.DTOs;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/AddUsuario")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _svc;
    public UsuariosController(IUsuarioService svc) => _svc = svc;

    [HttpPost] 
    public async Task<ActionResult<UsuarioDto>> Post([FromBody] UsuarioCreateDto dto)
    {
        try
        {
            var criado = await _svc.CriarAsync(dto);
            return CreatedAtAction(nameof(Post), new { id = criado.IdUsuario }, criado);
        }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
    }
}
