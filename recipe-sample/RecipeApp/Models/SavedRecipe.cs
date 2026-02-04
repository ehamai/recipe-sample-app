namespace RecipeApp.Models;

public class SavedRecipe
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string IngredientsJson { get; set; } = "[]";
    public string Instructions { get; set; } = string.Empty;
    public string? SuggestedAdditionsJson { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
