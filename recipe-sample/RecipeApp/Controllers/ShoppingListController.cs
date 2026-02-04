using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeApp.Models;

namespace RecipeApp.Controllers;

[ApiController]
[Route("api/shopping-list")]
public class ShoppingListController : ControllerBase
{
    [HttpPost]
    [Authorize]
    public IActionResult GenerateShoppingList([FromBody] ShoppingListRequest request)
    {
        var onHandSet = new HashSet<string>(
            request.IngredientsOnHand.Select(i => i.ToLowerInvariant())
        );

        var shoppingList = new List<ShoppingListItem>();

        foreach (var ingredient in request.RecipeIngredients)
        {
            var isOnHand = onHandSet.Any(oh => 
                ingredient.ToLowerInvariant().Contains(oh) || 
                oh.Contains(ingredient.ToLowerInvariant()));
            
            if (!isOnHand)
            {
                shoppingList.Add(new ShoppingListItem
                {
                    Name = ingredient,
                    IsRecommended = false
                });
            }
        }

        foreach (var suggestion in request.SuggestedAdditions)
        {
            if (!shoppingList.Any(s => s.Name.Equals(suggestion, StringComparison.OrdinalIgnoreCase)))
            {
                shoppingList.Add(new ShoppingListItem
                {
                    Name = suggestion,
                    IsRecommended = true
                });
            }
        }

        return Ok(new { Items = shoppingList });
    }
}

public class ShoppingListRequest
{
    public List<string> IngredientsOnHand { get; set; } = new();
    public List<string> RecipeIngredients { get; set; } = new();
    public List<string> SuggestedAdditions { get; set; } = new();
}

public class ShoppingListItem
{
    public string Name { get; set; } = string.Empty;
    public bool IsRecommended { get; set; }
}
