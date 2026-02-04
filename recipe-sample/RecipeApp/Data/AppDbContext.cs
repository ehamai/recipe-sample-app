using Microsoft.EntityFrameworkCore;
using RecipeApp.Models;

namespace RecipeApp.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Ingredient> Ingredients { get; set; }
    public DbSet<SavedRecipe> SavedRecipes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed Ingredients by Category
        var ingredients = new List<Ingredient>
        {
            // Proteins
            new Ingredient { Id = 1, Name = "Chicken Breast", Category = "Proteins" },
            new Ingredient { Id = 2, Name = "Ground Beef", Category = "Proteins" },
            new Ingredient { Id = 3, Name = "Salmon", Category = "Proteins" },
            new Ingredient { Id = 4, Name = "Eggs", Category = "Proteins" },
            new Ingredient { Id = 5, Name = "Tofu", Category = "Proteins" },
            
            // Vegetables
            new Ingredient { Id = 6, Name = "Broccoli", Category = "Vegetables" },
            new Ingredient { Id = 7, Name = "Carrots", Category = "Vegetables" },
            new Ingredient { Id = 8, Name = "Bell Peppers", Category = "Vegetables" },
            new Ingredient { Id = 9, Name = "Onions", Category = "Vegetables" },
            new Ingredient { Id = 10, Name = "Tomatoes", Category = "Vegetables" },
            new Ingredient { Id = 11, Name = "Spinach", Category = "Vegetables" },
            new Ingredient { Id = 12, Name = "Garlic", Category = "Vegetables" },
            
            // Dairy
            new Ingredient { Id = 13, Name = "Milk", Category = "Dairy" },
            new Ingredient { Id = 14, Name = "Cheese", Category = "Dairy" },
            new Ingredient { Id = 15, Name = "Butter", Category = "Dairy" },
            new Ingredient { Id = 16, Name = "Yogurt", Category = "Dairy" },
            new Ingredient { Id = 17, Name = "Cream", Category = "Dairy" },
            
            // Pantry
            new Ingredient { Id = 18, Name = "Flour", Category = "Pantry" },
            new Ingredient { Id = 19, Name = "Rice", Category = "Pantry" },
            new Ingredient { Id = 20, Name = "Pasta", Category = "Pantry" },
            new Ingredient { Id = 21, Name = "Olive Oil", Category = "Pantry" },
            new Ingredient { Id = 22, Name = "Soy Sauce", Category = "Pantry" },
            new Ingredient { Id = 23, Name = "Vinegar", Category = "Pantry" },
            
            // Spices
            new Ingredient { Id = 24, Name = "Salt", Category = "Spices" },
            new Ingredient { Id = 25, Name = "Black Pepper", Category = "Spices" },
            new Ingredient { Id = 26, Name = "Cumin", Category = "Spices" },
            new Ingredient { Id = 27, Name = "Paprika", Category = "Spices" },
            new Ingredient { Id = 28, Name = "Cinnamon", Category = "Spices" },
            new Ingredient { Id = 29, Name = "Oregano", Category = "Spices" },
            
            // Fruits
            new Ingredient { Id = 30, Name = "Apples", Category = "Fruits" },
            new Ingredient { Id = 31, Name = "Bananas", Category = "Fruits" },
            new Ingredient { Id = 32, Name = "Berries", Category = "Fruits" },
            new Ingredient { Id = 33, Name = "Lemons", Category = "Fruits" },
            new Ingredient { Id = 34, Name = "Oranges", Category = "Fruits" },
            
            // Grains
            new Ingredient { Id = 35, Name = "Bread", Category = "Grains" },
            new Ingredient { Id = 36, Name = "Oats", Category = "Grains" },
            new Ingredient { Id = 37, Name = "Quinoa", Category = "Grains" },
            new Ingredient { Id = 38, Name = "Brown Rice", Category = "Grains" }
        };

        modelBuilder.Entity<Ingredient>().HasData(ingredients);
    }
}
