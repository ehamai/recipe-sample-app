import { Router, Request, Response } from 'express';
import { isAuthenticated } from '../middleware/auth.js';

interface ShoppingListRequest {
  ingredientsOnHand: string[];
  recipeIngredients: string[];
  suggestedAdditions: string[];
}

interface ShoppingListItem {
  name: string;
  isRecommended: boolean;
}

const router = Router();

// POST /api/shopping-list - Generate shopping list
router.post('/', isAuthenticated, (req: Request, res: Response) => {
  const { ingredientsOnHand, recipeIngredients, suggestedAdditions } = req.body as ShoppingListRequest;
  
  // Create lowercase set of on-hand ingredients for matching
  const onHandSet = new Set(
    (ingredientsOnHand || []).map((i) => i.toLowerCase())
  );
  
  const shoppingList: ShoppingListItem[] = [];
  
  // Check recipe ingredients against what's on hand
  for (const ingredient of recipeIngredients || []) {
    const ingredientLower = ingredient.toLowerCase();
    
    // Check if ingredient matches any on-hand item (partial match both ways)
    const isOnHand = Array.from(onHandSet).some(
      (oh) => ingredientLower.includes(oh) || oh.includes(ingredientLower)
    );
    
    if (!isOnHand) {
      shoppingList.push({
        name: ingredient,
        isRecommended: false,
      });
    }
  }
  
  // Add suggested additions that aren't already in the list
  for (const suggestion of suggestedAdditions || []) {
    const alreadyInList = shoppingList.some(
      (item) => item.name.toLowerCase() === suggestion.toLowerCase()
    );
    
    if (!alreadyInList) {
      shoppingList.push({
        name: suggestion,
        isRecommended: true,
      });
    }
  }
  
  res.json({ items: shoppingList });
});

export default router;
