namespace RecipeApp.Models;

public class Recipe
{
    public string Title { get; set; } = string.Empty;
    public List<string> Ingredients { get; set; } = new();
    public List<string> Instructions { get; set; } = new();
    public List<string> SuggestedAdditions { get; set; } = new();
}

public class GenerateRecipesRequest
{
    public List<string> Ingredients { get; set; } = new();
}

public class GenerateRecipesResponse
{
    public List<Recipe> Recipes { get; set; } = new();
}
