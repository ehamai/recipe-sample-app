export interface Ingredient {
  id: number;
  name: string;
  category: string;
}

export interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  suggestedAdditions: string[];
}

export interface SavedRecipe {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string[];
  suggestedAdditions: string[];
  createdAt: string;
}

export interface User {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
}
