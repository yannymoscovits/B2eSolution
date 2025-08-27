using B2eSolution.Api.Application.DTOs;
using B2eSolution.Api.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace B2eSolution.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly IProdutoService _service;
    public ProdutosController(IProdutoService service) => _service = service;

    [HttpGet("ListProduto")]
    public async Task<IActionResult> Get([FromQuery] int pagina = 1, [FromQuery] int tamanho = 10, [FromQuery] string ordem = "asc")
        => Ok(await _service.ListarAsync(pagina, tamanho, ordem));

    [HttpPost("AddProduto")]
    public async Task<IActionResult> Post([FromBody] ProdutoCreateDto dto)
    {
        var result = await _service.CriarAsync(dto);
        return Ok(result);
    }

    [HttpPut("UpdateProduto/{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] ProdutoUpdateDto dto)
    {
        await _service.AtualizarAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("DeleteProduto/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.ExcluirAsync(id);
        return NoContent();
    }
}

