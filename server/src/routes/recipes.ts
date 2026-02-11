import { Router, Request, Response } from 'express';
import { isAuthenticated, getAccessToken } from '../middleware/auth.js';
import { store } from '../data/store.js';
import { generateRecipes } from '../services/recipeService.js';
import { Recipe, GenerateRecipesRequest } from '../models/Recipe.js';

const router = Router();

// POST /api/recipes/generate - Generate recipes using Copilot API
router.post('/generate', isAuthenticated, async (req: Request, res: Response) => {
  const { ingredients } = req.body as GenerateRecipesRequest;
  
  if (!ingredients || ingredients.length === 0) {
    res.status(400).json({ error: 'At least one ingredient is required' });
    return;
  }
  
  const accessToken = getAccessToken(req);
  const recipes = await generateRecipes(ingredients, accessToken);
  
  res.json({ recipes });
});

// GET /api/recipes/saved - Get user's saved recipes
router.get('/saved', isAuthenticated, (req: Request, res: Response) => {
  const userId = req.session.user?.id;
  
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  const savedRecipes = store.getSavedRecipesByUser(userId);
  
  // Transform to match .NET API response format
  const result = savedRecipes
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      skillLevel: r.skillLevel,
      cookTimeMinutes: r.cookTimeMinutes,
      ingredients: JSON.parse(r.ingredientsJson),
      instructions: r.instructions.split('\n').filter((s) => s.trim() !== ''),
      suggestedAdditions: r.suggestedAdditionsJson 
        ? JSON.parse(r.suggestedAdditionsJson) 
        : [],
      createdAt: r.createdAt,
    }));
  
  res.json(result);
});

// POST /api/recipes/saved - Save a recipe
router.post('/saved', isAuthenticated, (req: Request, res: Response) => {
  const userId = req.session.user?.id;
  
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  const recipe = req.body as Recipe;
  
  const savedRecipe = store.addSavedRecipe({
    userId,
    title: recipe.title,
    description: recipe.description,
    skillLevel: recipe.skillLevel,
    cookTimeMinutes: recipe.cookTimeMinutes,
    ingredientsJson: JSON.stringify(recipe.ingredients),
    instructions: recipe.instructions.join('\n'),
    suggestedAdditionsJson: JSON.stringify(recipe.suggestedAdditions),
  });
  
  res.json({ id: savedRecipe.id });
});

// DELETE /api/recipes/saved/:id - Delete a saved recipe
router.delete('/saved/:id', isAuthenticated, (req: Request, res: Response) => {
  const userId = req.session.user?.id;
  
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid recipe ID' });
    return;
  }
  
  const deleted = store.deleteSavedRecipe(id, userId);
  
  if (!deleted) {
    res.status(404).json({ error: 'Recipe not found' });
    return;
  }
  
  res.json({ success: true });
});

export default router;
