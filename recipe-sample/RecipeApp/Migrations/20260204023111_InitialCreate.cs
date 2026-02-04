using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RecipeApp.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ingredients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ingredients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SavedRecipes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    IngredientsJson = table.Column<string>(type: "text", nullable: false),
                    Instructions = table.Column<string>(type: "text", nullable: false),
                    SuggestedAdditionsJson = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedRecipes", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Ingredients",
                columns: new[] { "Id", "Category", "Name" },
                values: new object[,]
                {
                    { 1, "Proteins", "Chicken Breast" },
                    { 2, "Proteins", "Ground Beef" },
                    { 3, "Proteins", "Salmon" },
                    { 4, "Proteins", "Eggs" },
                    { 5, "Proteins", "Tofu" },
                    { 6, "Vegetables", "Broccoli" },
                    { 7, "Vegetables", "Carrots" },
                    { 8, "Vegetables", "Bell Peppers" },
                    { 9, "Vegetables", "Onions" },
                    { 10, "Vegetables", "Tomatoes" },
                    { 11, "Vegetables", "Spinach" },
                    { 12, "Vegetables", "Garlic" },
                    { 13, "Dairy", "Milk" },
                    { 14, "Dairy", "Cheese" },
                    { 15, "Dairy", "Butter" },
                    { 16, "Dairy", "Yogurt" },
                    { 17, "Dairy", "Cream" },
                    { 18, "Pantry", "Flour" },
                    { 19, "Pantry", "Rice" },
                    { 20, "Pantry", "Pasta" },
                    { 21, "Pantry", "Olive Oil" },
                    { 22, "Pantry", "Soy Sauce" },
                    { 23, "Pantry", "Vinegar" },
                    { 24, "Spices", "Salt" },
                    { 25, "Spices", "Black Pepper" },
                    { 26, "Spices", "Cumin" },
                    { 27, "Spices", "Paprika" },
                    { 28, "Spices", "Cinnamon" },
                    { 29, "Spices", "Oregano" },
                    { 30, "Fruits", "Apples" },
                    { 31, "Fruits", "Bananas" },
                    { 32, "Fruits", "Berries" },
                    { 33, "Fruits", "Lemons" },
                    { 34, "Fruits", "Oranges" },
                    { 35, "Grains", "Bread" },
                    { 36, "Grains", "Oats" },
                    { 37, "Grains", "Quinoa" },
                    { 38, "Grains", "Brown Rice" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ingredients");

            migrationBuilder.DropTable(
                name: "SavedRecipes");
        }
    }
}
