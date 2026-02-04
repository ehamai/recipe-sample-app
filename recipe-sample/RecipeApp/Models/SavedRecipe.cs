namespace RecipeApp.Models;

public class SavedRecipe
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string SkillLevel { get; set; } = "Beginner";
    public int CookTimeMinutes { get; set; } = 30;
    public string IngredientsJson { get; set; } = "[]";
    public string Instructions { get; set; } = string.Empty;
    public string? SuggestedAdditionsJson { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
