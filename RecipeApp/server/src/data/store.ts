import { Ingredient } from '../models/Ingredient.js';
import { SavedRecipe } from '../models/SavedRecipe.js';

// In-memory data store
class DataStore {
  private ingredients: Ingredient[] = [];
  private savedRecipes: Map<number, SavedRecipe> = new Map();
  private nextRecipeId: number = 1;

  constructor() {
    this.seedIngredients();
  }

  private seedIngredients(): void {
    this.ingredients = [
      // Proteins
      { id: 1, name: 'Chicken Breast', category: 'Proteins' },
      { id: 2, name: 'Ground Beef', category: 'Proteins' },
      { id: 3, name: 'Salmon', category: 'Proteins' },
      { id: 4, name: 'Eggs', category: 'Proteins' },
      { id: 5, name: 'Tofu', category: 'Proteins' },

      // Vegetables
      { id: 6, name: 'Broccoli', category: 'Vegetables' },
      { id: 7, name: 'Carrots', category: 'Vegetables' },
      { id: 8, name: 'Bell Peppers', category: 'Vegetables' },
      { id: 9, name: 'Onions', category: 'Vegetables' },
      { id: 10, name: 'Tomatoes', category: 'Vegetables' },
      { id: 11, name: 'Spinach', category: 'Vegetables' },
      { id: 12, name: 'Garlic', category: 'Vegetables' },

      // Dairy
      { id: 13, name: 'Milk', category: 'Dairy' },
      { id: 14, name: 'Cheese', category: 'Dairy' },
      { id: 15, name: 'Butter', category: 'Dairy' },
      { id: 16, name: 'Yogurt', category: 'Dairy' },
      { id: 17, name: 'Cream', category: 'Dairy' },

      // Pantry
      { id: 18, name: 'Flour', category: 'Pantry' },
      { id: 19, name: 'Rice', category: 'Pantry' },
      { id: 20, name: 'Pasta', category: 'Pantry' },
      { id: 21, name: 'Olive Oil', category: 'Pantry' },
      { id: 22, name: 'Soy Sauce', category: 'Pantry' },
      { id: 23, name: 'Vinegar', category: 'Pantry' },

      // Spices
      { id: 24, name: 'Salt', category: 'Spices' },
      { id: 25, name: 'Black Pepper', category: 'Spices' },
      { id: 26, name: 'Cumin', category: 'Spices' },
      { id: 27, name: 'Paprika', category: 'Spices' },
      { id: 28, name: 'Cinnamon', category: 'Spices' },
      { id: 29, name: 'Oregano', category: 'Spices' },

      // Fruits
      { id: 30, name: 'Apples', category: 'Fruits' },
      { id: 31, name: 'Bananas', category: 'Fruits' },
      { id: 32, name: 'Berries', category: 'Fruits' },
      { id: 33, name: 'Lemons', category: 'Fruits' },
      { id: 34, name: 'Oranges', category: 'Fruits' },

      // Grains
      { id: 35, name: 'Bread', category: 'Grains' },
      { id: 36, name: 'Oats', category: 'Grains' },
      { id: 37, name: 'Quinoa', category: 'Grains' },
      { id: 38, name: 'Brown Rice', category: 'Grains' },
    ];
  }

  // Ingredient methods
  getAllIngredients(): Ingredient[] {
    return [...this.ingredients];
  }

  getIngredientsByCategory(): Record<string, Ingredient[]> {
    return this.ingredients.reduce((acc, ingredient) => {
      if (!acc[ingredient.category]) {
        acc[ingredient.category] = [];
      }
      acc[ingredient.category].push(ingredient);
      return acc;
    }, {} as Record<string, Ingredient[]>);
  }

  // SavedRecipe methods
  getSavedRecipesByUser(userId: string): SavedRecipe[] {
    return Array.from(this.savedRecipes.values()).filter(
      (recipe) => recipe.userId === userId
    );
  }

  getSavedRecipeById(id: number): SavedRecipe | undefined {
    return this.savedRecipes.get(id);
  }

  addSavedRecipe(recipe: Omit<SavedRecipe, 'id' | 'createdAt'>): SavedRecipe {
    const newRecipe: SavedRecipe = {
      ...recipe,
      id: this.nextRecipeId++,
      createdAt: new Date(),
    };
    this.savedRecipes.set(newRecipe.id, newRecipe);
    return newRecipe;
  }

  deleteSavedRecipe(id: number, userId: string): boolean {
    const recipe = this.savedRecipes.get(id);
    if (recipe && recipe.userId === userId) {
      this.savedRecipes.delete(id);
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const store = new DataStore();
