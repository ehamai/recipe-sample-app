import { useState } from 'react';
import axios from 'axios';
import type { Recipe } from '../types';

interface Props {
  recipe: Recipe;
  onCreateShoppingList: (recipe: Recipe) => void;
  isSaved?: boolean;
  onDelete?: () => void;
}

export function RecipeCard({ recipe, onCreateShoppingList, isSaved = false, onDelete }: Props) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post('/api/recipes/saved', recipe);
      setSaved(true);
    } catch (error) {
      console.error('Failed to save recipe:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-emerald-600 text-white px-4 py-3">
        <h3 className="text-lg font-semibold">{recipe.title}</h3>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Ingredients:</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Instructions:</h4>
          <ol className="list-decimal list-inside text-gray-600 text-sm space-y-1">
            {recipe.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        {recipe.suggestedAdditions.length > 0 && (
          <div className="mb-4 p-3 bg-amber-50 rounded-lg">
            <h4 className="font-medium text-amber-800 mb-1">💡 Suggested Additions:</h4>
            <p className="text-amber-700 text-sm">{recipe.suggestedAdditions.join(', ')}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2 border-t">
          {!saved && !isSaved && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : '💾 Save Recipe'}
            </button>
          )}
          {saved && <span className="flex-1 text-center text-emerald-600 py-2">✓ Saved</span>}
          <button
            onClick={() => onCreateShoppingList(recipe)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🛒 Shopping List
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
