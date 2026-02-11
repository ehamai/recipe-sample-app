import { useState, useCallback } from 'react';
import axios from 'axios';
import type { Recipe } from '../types';
import {
  Card,
  Body2,
  Caption1,
  Subtitle2,
} from '@fluentui/react-components';
import {
  Checkmark12Regular,
  Clock16Regular,
  Food16Regular,
} from '@fluentui/react-icons';
import { RecipeDetailDialog } from './RecipeDetailDialog';

// Skill level styling
const skillLevelStyles: Record<string, string> = {
  Beginner: 'skill-beginner',
  Intermediate: 'skill-intermediate',
  Advanced: 'skill-advanced',
};

interface Props {
  recipe: Recipe;
  onCreateShoppingList: (recipe: Recipe) => void;
  isSaved?: boolean;
  onDelete?: () => void;
}

export const RecipeCard = ({ recipe, onCreateShoppingList, isSaved = false }: Props) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await axios.post('/api/recipes/saved', recipe);
      setSaved(true);
    } catch (error) {
      console.error('Failed to save recipe:', error);
    } finally {
      setSaving(false);
    }
  }, [recipe]);

  const handleCardClick = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleShoppingList = useCallback(() => {
    onCreateShoppingList(recipe);
    setDialogOpen(false);
  }, [onCreateShoppingList, recipe]);

  const ingredientCount = recipe.ingredients.length;
  const cookTime = recipe.cookTimeMinutes || 30;
  const skillLevel = recipe.skillLevel || 'Beginner';
  const description = recipe.description || `A delicious ${recipe.title.toLowerCase()} recipe.`;
  const isRecipeSaved = saved || isSaved;

  return (
    <>
      <Card
        className="recipe-card cursor-pointer shadow-card hover:shadow-card-hover bg-white"
        onClick={handleCardClick}
        style={{ borderRadius: '16px', minHeight: '200px' }}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Header row: Skill badge + Saved indicator */}
          <div className="flex items-center justify-between mb-3">
            <span 
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${skillLevelStyles[skillLevel]}`}
            >
              {skillLevel}
            </span>
            {isRecipeSaved && (
              <span className="flex items-center gap-1 text-emerald-600">
                <Checkmark12Regular />
                <Caption1 className="text-emerald-600 font-medium">Saved</Caption1>
              </span>
            )}
          </div>

          {/* Title */}
          <Subtitle2 className="line-clamp-2 mb-2 leading-tight">{recipe.title}</Subtitle2>

          {/* Description */}
          <Body2 className="text-gray-500 line-clamp-3 mb-4 flex-grow">
            {description}
          </Body2>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5" aria-label={`Cook time: ${cookTime} minutes`}>
              <Clock16Regular className="text-gray-400" />
              <Caption1>{cookTime} min</Caption1>
            </div>
            <div className="flex items-center gap-1.5" aria-label={`${ingredientCount} ingredients`}>
              <Food16Regular className="text-gray-400" />
              <Caption1>{ingredientCount} items</Caption1>
            </div>
          </div>
        </div>
      </Card>

      {/* Detail Dialog */}
      <RecipeDetailDialog
        recipe={recipe}
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={!isRecipeSaved ? handleSave : undefined}
        onShoppingList={handleShoppingList}
        isSaved={isRecipeSaved}
        saving={saving}
      />
    </>
  );
};
