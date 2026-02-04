import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { IngredientSelector } from '../components/IngredientSelector';
import { RecipeCard } from '../components/RecipeCard';
import { ShoppingList } from '../components/ShoppingList';
import type { Recipe } from '../types';
import {
  Button,
  Spinner,
  MessageBar,
  MessageBarBody,
  Title1,
  Title3,
  Body1,
  Card,
} from '@fluentui/react-components';
import { Sparkle24Regular, PersonAccounts24Regular } from '@fluentui/react-icons';

export const HomePage = () => {
  const { user, login } = useAuth();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shoppingList, setShoppingList] = useState<{ name: string; isRecommended: boolean }[] | null>(null);

  const generateRecipes = useCallback(async () => {
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
    } catch (err: unknown) {
      const axiosError = err as { response?: { status: number } };
      if (axiosError.response?.status === 401) {
        setError('Please log in to generate recipes');
      } else {
        setError('Failed to generate recipes. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedIngredients]);

  const createShoppingList = useCallback(async (recipe: Recipe) => {
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
  }, [selectedIngredients]);

  const closeShoppingList = useCallback(() => {
    setShoppingList(null);
  }, []);

  return (
    <div className="py-8 px-4">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <span className="text-5xl">🍳</span>
        </div>
        <Title1 className="mb-3 block">What's in your kitchen?</Title1>
        <Body1 className="text-gray-600 max-w-md mx-auto">
          Select the ingredients you have on hand, and we'll suggest delicious recipes you can make!
        </Body1>
      </div>

      {/* Ingredient Selector */}
      <div className="mb-6">
        <IngredientSelector
          selectedIngredients={selectedIngredients}
          onSelectionChange={setSelectedIngredients}
        />
      </div>

      {/* Generate Button */}
      <div className="flex justify-center mb-8">
        {!user ? (
          <Button
            appearance="primary"
            icon={<PersonAccounts24Regular />}
            onClick={login}
            size="large"
            style={{ borderRadius: '12px', padding: '12px 32px' }}
          >
            Login with GitHub to Generate
          </Button>
        ) : (
          <Button
            appearance="primary"
            icon={loading ? <Spinner size="tiny" /> : <Sparkle24Regular />}
            onClick={generateRecipes}
            disabled={loading || selectedIngredients.length === 0}
            size="large"
            style={{ borderRadius: '12px', padding: '12px 32px' }}
          >
            {loading ? 'Generating...' : 'Generate Recipes'}
          </Button>
        )}
      </div>

      {error && (
        <MessageBar intent="error" className="mb-6" style={{ borderRadius: '12px' }}>
          <MessageBarBody>{error}</MessageBarBody>
        </MessageBar>
      )}

      {/* Recipe Results */}
      {recipes.length > 0 ? (
        <div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px bg-gray-200 flex-1" />
            <Title3 className="text-gray-700">Your Recipes</Title3>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {recipes.map((recipe, index) => (
              <RecipeCard
                key={index}
                recipe={recipe}
                onCreateShoppingList={createShoppingList}
              />
            ))}
          </div>
        </div>
      ) : (
        <Card
          className="flex items-center justify-center py-16 shadow-card"
          style={{ borderRadius: '16px' }}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Sparkle24Regular className="text-gray-400" />
            </div>
            <Body1 className="text-gray-500">
              Select ingredients and generate recipes to see them here
            </Body1>
          </div>
        </Card>
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
