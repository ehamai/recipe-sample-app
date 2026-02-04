import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { RecipeCard } from '../components/RecipeCard';
import { ShoppingList } from '../components/ShoppingList';
import type { SavedRecipe, Recipe } from '../types';

export function SavedRecipesPage() {
  const { user, login } = useAuth();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [shoppingList, setShoppingList] = useState<{ name: string; isRecommended: boolean }[] | null>(null);

  useEffect(() => {
    if (user) {
      fetchSavedRecipes();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSavedRecipes = async () => {
    try {
      const response = await axios.get('/api/recipes/saved');
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to fetch saved recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id: number) => {
    try {
      await axios.delete(`/api/recipes/saved/${id}`);
      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    }
  };

  const createShoppingList = async (recipe: Recipe) => {
    try {
      const response = await axios.post('/api/shopping-list', {
        ingredientsOnHand: [],
        recipeIngredients: recipe.ingredients,
        suggestedAdditions: recipe.suggestedAdditions
      });
      setShoppingList(response.data.items);
    } catch (err) {
      console.error('Failed to create shopping list:', err);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Saved Recipes</h2>
        <p className="text-gray-600 mb-6">Please log in to view your saved recipes.</p>
        <button
          onClick={login}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Login with GitHub
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Saved Recipes</h2>
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          You haven't saved any recipes yet. Generate some recipes and save your favorites!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={{
                title: recipe.title,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                suggestedAdditions: recipe.suggestedAdditions
              }}
              onCreateShoppingList={createShoppingList}
              isSaved={true}
              onDelete={() => deleteRecipe(recipe.id)}
            />
          ))}
        </div>
      )}

      {shoppingList && (
        <ShoppingList
          items={shoppingList}
          onClose={() => setShoppingList(null)}
        />
      )}
    </div>
  );
}
