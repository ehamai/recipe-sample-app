# RecipeApp - .NET 8 Web API Project Setup

## Project Overview
A complete .NET 8 Web API project configured for a recipe management application with PostgreSQL database support, GitHub OAuth authentication, and SPA static file serving.

## Project Structure
```
RecipeApp/
├── Controllers/          # API endpoint controllers (placeholder)
├── Models/              # Data models
│   ├── Ingredient.cs    # Ingredient entity
│   ├── Recipe.cs        # Recipe DTO and request/response models
│   └── SavedRecipe.cs   # SavedRecipe entity
├── Services/            # Business logic services (placeholder)
├── Data/                
│   └── AppDbContext.cs  # Entity Framework Core DbContext with seed data
├── Properties/
├── Program.cs           # Application startup configuration
├── appsettings.json     # Configuration file
├── appsettings.Development.json
└── RecipeApp.csproj     # Project file
```

## Models

### Ingredient.cs
- **Id**: int (Primary Key)
- **Name**: string
- **Category**: string (Proteins, Vegetables, Dairy, Pantry, Spices, Fruits, Grains)

### SavedRecipe.cs
- **Id**: int (Primary Key)
- **UserId**: string (User identifier for ownership)
- **Title**: string
- **IngredientsJson**: string (JSON array of ingredients)
- **Instructions**: string
- **SuggestedAdditionsJson**: string? (Optional JSON array)
- **CreatedAt**: DateTime (UTC)

### Recipe.cs (DTO)
- **Title**: string
- **Ingredients**: List<string>
- **Instructions**: List<string>
- **SuggestedAdditions**: List<string>

### GenerateRecipesRequest
- **Ingredients**: List<string>

### GenerateRecipesResponse
- **Recipes**: List<Recipe>

## Database

### AppDbContext
- DbSet<Ingredient>
- DbSet<SavedRecipe>
- Seeded with 38 common ingredients across 7 categories:
  - **Proteins**: Chicken Breast, Ground Beef, Salmon, Eggs, Tofu
  - **Vegetables**: Broccoli, Carrots, Bell Peppers, Onions, Tomatoes, Spinach, Garlic
  - **Dairy**: Milk, Cheese, Butter, Yogurt, Cream
  - **Pantry**: Flour, Rice, Pasta, Olive Oil, Soy Sauce, Vinegar
  - **Spices**: Salt, Black Pepper, Cumin, Paprika, Cinnamon, Oregano
  - **Fruits**: Apples, Bananas, Berries, Lemons, Oranges
  - **Grains**: Bread, Oats, Quinoa, Brown Rice

## Installed NuGet Packages

| Package | Version | Purpose |
|---------|---------|---------|
| Npgsql.EntityFrameworkCore.PostgreSQL | 8.0.2 | PostgreSQL database provider |
| Microsoft.AspNetCore.Authentication.Cookies | 2.3.9 | Cookie-based authentication |
| Microsoft.AspNetCore.Authentication.OAuth | 2.3.9 | OAuth authentication (GitHub) |
| Microsoft.AspNetCore.SpaServices.Extensions | 8.0.6 | Single Page Application support |
| Microsoft.AspNetCore.OpenApi | 8.0.14 | OpenAPI/Swagger support |
| Swashbuckle.AspNetCore | 6.6.2 | Swagger UI and documentation |

## Configuration (Program.cs)

### Services Registered
1. **Swagger/OpenAPI**: API documentation
2. **Entity Framework Core**: PostgreSQL database context
3. **Authentication**: 
   - Cookie authentication (default)
   - GitHub OAuth
4. **CORS**: Enabled for development environment
5. **Controllers**: ASP.NET Core MVC controllers

### Middleware Pipeline
1. Swagger UI (development only)
2. HTTPS Redirection
3. Authentication & Authorization
4. Controller routing
5. Static file serving for SPA (production only)
6. SPA fallback routing

## Configuration Files

### appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=5432;Database=recipeapp;User Id=postgres;Password=password;"
  },
  "GitHub": {
    "ClientId": "",
    "ClientSecret": ""
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

**Required Configuration**:
- Update `GitHub:ClientId` and `GitHub:ClientSecret` with GitHub OAuth app credentials
- Update `ConnectionStrings:DefaultConnection` with your PostgreSQL connection string

## Build & Run

### Prerequisites
- .NET 8 SDK
- PostgreSQL database (local or remote)

### Commands

```bash
# Restore dependencies
dotnet restore

# Build the project
dotnet build

# Build in Release mode
dotnet build --configuration Release

# Run the application
dotnet run

# Create database migrations (after setting up EF Core)
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Build Status
✅ **Build Successful** - Project builds without errors or warnings in both Debug and Release configurations

## Development Features

- **Swagger UI**: Available at `/swagger` in development
- **Hot Reload**: Supported for development iteration
- **CORS**: Enabled for all origins in development
- **OAuth**: GitHub authentication ready to configure
- **PostgreSQL**: Configured for relational data storage
- **SPA Support**: Static files serving configured for production

## Next Steps

1. **Create Controllers**: Implement API endpoints in the Controllers/ folder
2. **Create Services**: Add business logic in the Services/ folder
3. **Configure Database**: Set up PostgreSQL and run migrations
4. **Configure OAuth**: Register GitHub OAuth app and update appsettings.json
5. **Implement Authentication**: Add auth controller endpoints
6. **Create Frontend**: Build SPA in ClientApp/ directory
7. **Unit Tests**: Add xUnit test projects

## Notes

- Uses modern .NET 8 minimal API patterns
- Entity Framework Core code-first approach ready
- Nullable reference types enabled for safety
- Implicit usings enabled for cleaner code
