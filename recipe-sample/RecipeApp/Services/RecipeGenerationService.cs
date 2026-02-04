using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using RecipeApp.Models;

namespace RecipeApp.Services;

public class RecipeGenerationService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<RecipeGenerationService> _logger;

    public RecipeGenerationService(IHttpClientFactory httpClientFactory, ILogger<RecipeGenerationService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<List<Recipe>> GenerateRecipesAsync(List<string> ingredients, string? accessToken)
    {
        if (string.IsNullOrEmpty(accessToken))
        {
            _logger.LogWarning("No access token provided, returning mock recipes");
            return GenerateMockRecipes(ingredients);
        }

        try
        {
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Add("User-Agent", "RecipeApp");

            var prompt = BuildPrompt(ingredients);
            
            var requestBody = new
            {
                model = "gpt-4o",
                messages = new[]
                {
                    new { role = "system", content = "You are a helpful chef assistant that creates recipes. Always respond with valid JSON." },
                    new { role = "user", content = prompt }
                },
                max_tokens = 2000,
                temperature = 0.7
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync("https://api.githubcopilot.com/chat/completions", content);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Copilot API error: {StatusCode} - {Error}", response.StatusCode, errorContent);
                return GenerateMockRecipes(ingredients);
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            var copilotResponse = JsonSerializer.Deserialize<CopilotResponse>(responseJson);
            
            var recipeContent = copilotResponse?.Choices?.FirstOrDefault()?.Message?.Content;
            if (string.IsNullOrEmpty(recipeContent))
            {
                return GenerateMockRecipes(ingredients);
            }

            var jsonStart = recipeContent.IndexOf('[');
            var jsonEnd = recipeContent.LastIndexOf(']') + 1;
            if (jsonStart >= 0 && jsonEnd > jsonStart)
            {
                recipeContent = recipeContent.Substring(jsonStart, jsonEnd - jsonStart);
            }

            var recipes = JsonSerializer.Deserialize<List<Recipe>>(recipeContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return recipes ?? GenerateMockRecipes(ingredients);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating recipes from Copilot API");
            return GenerateMockRecipes(ingredients);
        }
    }

    private string BuildPrompt(List<string> ingredients)
    {
        var ingredientList = string.Join(", ", ingredients);
        return $@"Given these ingredients: {ingredientList}

Create exactly 3 different recipes that primarily use these ingredients. For each recipe, also suggest 2-3 additional ingredients that would enhance the dish.

Respond with a JSON array in this exact format (no markdown, just JSON):
[
  {{
    ""title"": ""Recipe Name"",
    ""ingredients"": [""ingredient 1 with quantity"", ""ingredient 2 with quantity""],
    ""instructions"": [""Step 1"", ""Step 2"", ""Step 3""],
    ""suggestedAdditions"": [""optional ingredient 1"", ""optional ingredient 2""]
  }}
]";
    }

    private List<Recipe> GenerateMockRecipes(List<string> ingredients)
    {
        var primaryIngredient = ingredients.FirstOrDefault() ?? "ingredients";
        
        return new List<Recipe>
        {
            new Recipe
            {
                Title = $"Simple {primaryIngredient} Stir-Fry",
                Ingredients = ingredients.Select(i => $"1 cup {i}").Concat(new[] { "2 tbsp oil", "Salt to taste" }).ToList(),
                Instructions = new List<string>
                {
                    "Heat oil in a large pan or wok over high heat.",
                    $"Add {primaryIngredient} and cook for 3-4 minutes.",
                    "Add remaining ingredients and stir-fry for 5 minutes.",
                    "Season with salt and serve hot."
                },
                SuggestedAdditions = new List<string> { "Soy sauce", "Garlic", "Ginger" }
            },
            new Recipe
            {
                Title = $"Roasted {primaryIngredient} Bowl",
                Ingredients = ingredients.Select(i => $"1 cup {i}").Concat(new[] { "2 tbsp olive oil", "1 tsp herbs" }).ToList(),
                Instructions = new List<string>
                {
                    "Preheat oven to 400°F (200°C).",
                    "Toss all ingredients with olive oil and herbs.",
                    "Spread on a baking sheet and roast for 25-30 minutes.",
                    "Serve warm as a bowl or side dish."
                },
                SuggestedAdditions = new List<string> { "Lemon juice", "Parmesan cheese", "Fresh herbs" }
            },
            new Recipe
            {
                Title = $"Creamy {primaryIngredient} Soup",
                Ingredients = ingredients.Select(i => $"1 cup {i}").Concat(new[] { "2 cups broth", "1/2 cup cream" }).ToList(),
                Instructions = new List<string>
                {
                    "Sauté ingredients in a large pot for 5 minutes.",
                    "Add broth and bring to a boil.",
                    "Reduce heat and simmer for 20 minutes.",
                    "Blend until smooth, stir in cream, and serve."
                },
                SuggestedAdditions = new List<string> { "Croutons", "Fresh chives", "Black pepper" }
            }
        };
    }
}

public class CopilotResponse
{
    [JsonPropertyName("choices")]
    public List<CopilotChoice>? Choices { get; set; }
}

public class CopilotChoice
{
    [JsonPropertyName("message")]
    public CopilotMessage? Message { get; set; }
}

public class CopilotMessage
{
    [JsonPropertyName("content")]
    public string? Content { get; set; }
}
