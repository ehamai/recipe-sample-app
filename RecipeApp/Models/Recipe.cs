namespace RecipeApp.Models;

public class Recipe
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string SkillLevel { get; set; } = "Beginner"; // Beginner, Intermediate, Advanced
    public int CookTimeMinutes { get; set; } = 30;
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
