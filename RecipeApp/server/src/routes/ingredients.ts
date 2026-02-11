import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

// GET /api/ingredients - Get all ingredients grouped by category
router.get('/', (req: Request, res: Response) => {
  const ingredientsByCategory = store.getIngredientsByCategory();
  
  // Transform to match .NET API response format: { category: [{id, name}, ...] }
  const grouped: Record<string, { id: number; name: string }[]> = {};
  
  for (const [category, ingredients] of Object.entries(ingredientsByCategory)) {
    grouped[category] = ingredients
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ id, name }) => ({ id, name }));
  }
  
  res.json(grouped);
});

export default router;
