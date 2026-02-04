import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { IngredientSelector } from '../components/IngredientSelector';
import { RecipeCard } from '../components/RecipeCard';
import { ShoppingList } from '../components/ShoppingList';
import type { Recipe } from '../types';

export function HomePage() {
  const { user, login } = useAuth();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shoppingList, setShoppingList] = useState<{ name: string; isRecommended: boolean }[] | null>(null);

  const generateRecipes = async () => {
    if (selectedIngredients.length === 0) {
      setError('Please select at least one ingredient');
      return;
    }

    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const response = await axios.post('/api/recipes/generate', {
        ingredients: selectedIngredients
      });
      setRecipes(response.data.recipes);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Please log in to generate recipes');
      } else {
        setError('Failed to generate recipes. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const createShoppingList = async (recipe: Recipe) => {
    try {
      const response = await axios.post('/api/shopping-list', {
        ingredientsOnHand: selectedIngredients,
        recipeIngredients: recipe.ingredients,
        suggestedAdditions: recipe.suggestedAdditions
      });
      setShoppingList(response.data.items);
    } catch (err) {
      console.error('Failed to create shopping list:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">What's in your kitchen?</h2>
          <p className="text-gray-600">Select ingredients you have and we'll suggest delicious recipes!</p>
        </div>

        <IngredientSelector
          selectedIngredients={selectedIngredients}
          onSelectionChange={setSelectedIngredients}
        />

        <div className="mt-6 text-center">
          {!user ? (
            <button
              onClick={login}
              className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-semibold"
            >
              Login with GitHub to Generate Recipes
            </button>
          ) : (
            <button
              onClick={generateRecipes}
              disabled={loading || selectedIngredients.length === 0}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating Recipes...
                </span>
              ) : (
                '✨ Generate Recipes'
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {recipes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Recipes</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  recipe={recipe}
                  onCreateShoppingList={createShoppingList}
                />
              ))}
            </div>
          </div>
        )}

        {shoppingList && (
          <ShoppingList
            items={shoppingList}
            onClose={() => setShoppingList(null)}
          />
        )}
      </div>
    </div>
  );
}
