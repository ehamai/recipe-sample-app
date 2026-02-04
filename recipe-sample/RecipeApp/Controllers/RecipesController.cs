using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeApp.Data;
using RecipeApp.Models;
using RecipeApp.Services;
using System.Security.Claims;
using System.Text.Json;

namespace RecipeApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly RecipeGenerationService _recipeService;

    public RecipesController(AppDbContext context, RecipeGenerationService recipeService)
    {
        _context = context;
        _recipeService = recipeService;
    }

    [HttpPost("generate")]
    [Authorize]
    public async Task<IActionResult> GenerateRecipes([FromBody] GenerateRecipesRequest request)
    {
        if (request.Ingredients == null || request.Ingredients.Count == 0)
        {
            return BadRequest("At least one ingredient is required");
        }

        var accessToken = await HttpContext.GetTokenAsync("access_token");
        var recipes = await _recipeService.GenerateRecipesAsync(request.Ingredients, accessToken);
        
        return Ok(new GenerateRecipesResponse { Recipes = recipes });
    }

    [HttpGet("saved")]
    [Authorize]
    public async Task<IActionResult> GetSavedRecipes()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var recipes = await _context.SavedRecipes
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        var result = recipes.Select(r => new
        {
            r.Id,
            r.Title,
            r.Description,
            r.SkillLevel,
            r.CookTimeMinutes,
            Ingredients = JsonSerializer.Deserialize<List<string>>(r.IngredientsJson),
            Instructions = r.Instructions.Split('\n', StringSplitOptions.RemoveEmptyEntries).ToList(),
            SuggestedAdditions = r.SuggestedAdditionsJson != null
                ? JsonSerializer.Deserialize<List<string>>(r.SuggestedAdditionsJson)
                : new List<string>(),
            r.CreatedAt
        }).ToList();

        return Ok(result);
    }

    [HttpPost("saved")]
    [Authorize]
    public async Task<IActionResult> SaveRecipe([FromBody] Recipe recipe)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var savedRecipe = new SavedRecipe
        {
            UserId = userId,
            Title = recipe.Title,
            Description = recipe.Description,
            SkillLevel = recipe.SkillLevel,
            CookTimeMinutes = recipe.CookTimeMinutes,
            IngredientsJson = JsonSerializer.Serialize(recipe.Ingredients),
            Instructions = string.Join("\n", recipe.Instructions),
            SuggestedAdditionsJson = JsonSerializer.Serialize(recipe.SuggestedAdditions),
            CreatedAt = DateTime.UtcNow
        };

        _context.SavedRecipes.Add(savedRecipe);
        await _context.SaveChangesAsync();

        return Ok(new { savedRecipe.Id });
    }

    [HttpDelete("saved/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteSavedRecipe(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var recipe = await _context.SavedRecipes
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        if (recipe == null)
        {
            return NotFound();
        }

        _context.SavedRecipes.Remove(recipe);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
