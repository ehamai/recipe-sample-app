export interface SavedRecipe {
  id: number;
  userId: string;
  title: string;
  description: string;
  skillLevel: string;
  cookTimeMinutes: number;
  ingredientsJson: string;
  instructions: string;
  suggestedAdditionsJson?: string;
  createdAt: Date;
}

// Helper type for API responses (parsed JSON fields)
export interface SavedRecipeDto {
  id: number;
  userId: string;
  title: string;
  description: string;
  skillLevel: string;
  cookTimeMinutes: number;
  ingredients: string[];
  instructions: string[];
  suggestedAdditions: string[];
  createdAt: Date;
}
