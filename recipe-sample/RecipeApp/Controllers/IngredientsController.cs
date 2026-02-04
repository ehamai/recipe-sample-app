using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeApp.Data;

namespace RecipeApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IngredientsController : ControllerBase
{
    private readonly AppDbContext _context;

    public IngredientsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetIngredients()
    {
        var ingredients = await _context.Ingredients
            .OrderBy(i => i.Category)
            .ThenBy(i => i.Name)
            .ToListAsync();

        var grouped = ingredients
            .GroupBy(i => i.Category)
            .ToDictionary(g => g.Key, g => g.Select(i => new { i.Id, i.Name }).ToList());

        return Ok(grouped);
    }
}
