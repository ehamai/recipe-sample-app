export interface Recipe {
  title: string;
  description: string;
  skillLevel: string; // Beginner, Intermediate, Advanced
  cookTimeMinutes: number;
  ingredients: string[];
  instructions: string[];
  suggestedAdditions: string[];
}

export interface GenerateRecipesRequest {
  ingredients: string[];
}

export interface GenerateRecipesResponse {
  recipes: Recipe[];
}
