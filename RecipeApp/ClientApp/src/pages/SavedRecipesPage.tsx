import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { RecipeCard } from '../components/RecipeCard';
import { ShoppingList } from '../components/ShoppingList';
import type { SavedRecipe, Recipe } from '../types';
import {
  Button,
  Spinner,
  Title1,
  Body1,
  Card,
} from '@fluentui/react-components';
import { PersonAccounts24Regular, BookOpen24Regular } from '@fluentui/react-icons';

export const SavedRecipesPage = () => {
  const { user, login } = useAuth();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [shoppingList, setShoppingList] = useState<{ name: string; isRecommended: boolean }[] | null>(null);

  const fetchSavedRecipes = useCallback(async () => {
    try {
      const response = await axios.get('/api/recipes/saved');
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to fetch saved recipes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchSavedRecipes();
    } else {
      setLoading(false);
    }
  }, [user, fetchSavedRecipes]);

  const deleteRecipe = useCallback(async (id: number) => {
    try {
      await axios.delete(`/api/recipes/saved/${id}`);
      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    }
  }, []);

  const createShoppingList = useCallback(async (recipe: Recipe) => {
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
  }, []);

  const closeShoppingList = useCallback(() => {
    setShoppingList(null);
  }, []);

  if (!user) {
    return (
      <div className="py-16 px-4">
        <div className="text-center">
          <div className="inline-block mb-4">
            <span className="text-5xl">📚</span>
          </div>
          <Title1 className="mb-4 block">Saved Recipes</Title1>
          <Body1 className="mb-6 block text-gray-600 max-w-md mx-auto">
            Log in to view and manage your collection of saved recipes.
          </Body1>
          <Button
            appearance="primary"
            icon={<PersonAccounts24Regular />}
            onClick={login}
            size="large"
            style={{ borderRadius: '12px', padding: '12px 32px' }}
          >
            Login with GitHub
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <span className="text-5xl">📚</span>
        </div>
        <Title1 className="mb-3 block">Your Saved Recipes</Title1>
        <Body1 className="text-gray-600">
          Your personal collection of favorite recipes
        </Body1>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="large" label="Loading recipes..." />
        </div>
      ) : recipes.length === 0 ? (
        <Card className="py-16 text-center shadow-card" style={{ borderRadius: '16px' }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <BookOpen24Regular className="text-gray-400" />
          </div>
          <Body1 className="text-gray-500">
            You haven't saved any recipes yet. Generate some recipes and save your favorites!
          </Body1>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={{
                title: recipe.title,
                description: recipe.description,
                skillLevel: recipe.skillLevel,
                cookTimeMinutes: recipe.cookTimeMinutes,
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
          onClose={closeShoppingList}
        />
      )}
    </div>
  );
};
