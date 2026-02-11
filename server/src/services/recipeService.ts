import axios from 'axios';
import { Recipe } from '../models/Recipe.js';

interface CopilotResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
}

export async function generateRecipes(
  ingredients: string[],
  accessToken?: string
): Promise<Recipe[]> {
  if (!accessToken) {
    console.warn('No access token provided, returning mock recipes');
    return generateMockRecipes(ingredients);
  }

  try {
    const prompt = buildPrompt(ingredients);

    const requestBody = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful chef assistant that creates recipes. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    };

    const response = await axios.post<CopilotResponse>(
      'https://api.githubcopilot.com/chat/completions',
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'User-Agent': 'RecipeApp',
        },
      }
    );

    const recipeContent = response.data.choices?.[0]?.message?.content;
    
    if (!recipeContent) {
      console.warn('No content in Copilot response, returning mock recipes');
      return generateMockRecipes(ingredients);
    }

    // Extract JSON array from response (find [ to ] bounds)
    const jsonStart = recipeContent.indexOf('[');
    const jsonEnd = recipeContent.lastIndexOf(']') + 1;
    
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const jsonStr = recipeContent.substring(jsonStart, jsonEnd);
      const recipes = JSON.parse(jsonStr) as Recipe[];
      return recipes;
    }

    return generateMockRecipes(ingredients);
  } catch (error) {
    console.error('Error generating recipes from Copilot API:', error);
    return generateMockRecipes(ingredients);
  }
}

function buildPrompt(ingredients: string[]): string {
  const ingredientList = ingredients.join(', ');
  
  return `Given these ingredients: ${ingredientList}

Create exactly 8 different recipes that primarily use these ingredients. For each recipe, also suggest 2-3 additional ingredients that would enhance the dish.

Respond with a JSON array in this exact format (no markdown, just JSON):
[
  {
    "title": "Recipe Name",
    "description": "A brief one-sentence description of the dish",
    "skillLevel": "Beginner",
    "cookTimeMinutes": 25,
    "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
    "instructions": ["Step 1", "Step 2", "Step 3"],
    "suggestedAdditions": ["optional ingredient 1", "optional ingredient 2"]
  }
]

For skillLevel, use one of: Beginner, Intermediate, Advanced based on technique complexity.
For cookTimeMinutes, estimate total active cooking time in minutes.`;
}

function generateMockRecipes(ingredients: string[]): Recipe[] {
  const primaryIngredient = ingredients[0] || 'ingredients';

  return [
    {
      title: `Simple ${primaryIngredient} Stir-Fry`,
      description: `A quick and flavorful stir-fry featuring fresh ${primaryIngredient} with savory seasonings.`,
      skillLevel: 'Beginner',
      cookTimeMinutes: 15,
      ingredients: [
        ...ingredients.map((i) => `1 cup ${i}`),
        '2 tbsp oil',
        'Salt to taste',
      ],
      instructions: [
        'Heat oil in a large pan or wok over high heat.',
        `Add ${primaryIngredient} and cook for 3-4 minutes.`,
        'Add remaining ingredients and stir-fry for 5 minutes.',
        'Season with salt and serve hot.',
      ],
      suggestedAdditions: ['Soy sauce', 'Garlic', 'Ginger'],
    },
    {
      title: `Roasted ${primaryIngredient} Bowl`,
      description: `Perfectly roasted ${primaryIngredient} served in a wholesome bowl with herbs and olive oil.`,
      skillLevel: 'Beginner',
      cookTimeMinutes: 35,
      ingredients: [
        ...ingredients.map((i) => `1 cup ${i}`),
        '2 tbsp olive oil',
        '1 tsp herbs',
      ],
      instructions: [
        'Preheat oven to 400°F (200°C).',
        'Toss all ingredients with olive oil and herbs.',
        'Spread on a baking sheet and roast for 25-30 minutes.',
        'Serve warm as a bowl or side dish.',
      ],
      suggestedAdditions: ['Lemon juice', 'Parmesan cheese', 'Fresh herbs'],
    },
    {
      title: `Creamy ${primaryIngredient} Soup`,
      description: `A rich and velvety soup made with ${primaryIngredient} and a touch of cream.`,
      skillLevel: 'Intermediate',
      cookTimeMinutes: 30,
      ingredients: [
        ...ingredients.map((i) => `1 cup ${i}`),
        '2 cups broth',
        '1/2 cup cream',
      ],
      instructions: [
        'Sauté ingredients in a large pot for 5 minutes.',
        'Add broth and bring to a boil.',
        'Reduce heat and simmer for 20 minutes.',
        'Blend until smooth, stir in cream, and serve.',
      ],
      suggestedAdditions: ['Croutons', 'Fresh chives', 'Black pepper'],
    },
    {
      title: `Grilled ${primaryIngredient} Skewers`,
      description: `Tender grilled ${primaryIngredient} on skewers with a zesty marinade.`,
      skillLevel: 'Beginner',
      cookTimeMinutes: 20,
      ingredients: [
        ...ingredients.map((i) => `1 cup ${i}`),
        '2 tbsp olive oil',
        '1 tbsp lemon juice',
        '1 tsp paprika',
      ],
      instructions: [
        'Thread ingredients onto skewers.',
        'Brush with olive oil and lemon juice, sprinkle with paprika.',
        'Grill over medium-high heat for 8-10 minutes, turning occasionally.',
        'Serve with your favorite dipping sauce.',
      ],
      suggestedAdditions: ['Tzatziki sauce', 'Red onion', 'Bell peppers'],
    },
    {
      title: `${primaryIngredient} Fried Rice`,
      description: `A satisfying fried rice packed with ${primaryIngredient} and aromatic seasonings.`,
      skillLevel: 'Beginner',
      cookTimeMinutes: 20,
      ingredients: [
        ...ingredients.map((i) => `1 cup ${i}`),
        '2 cups cooked rice',
        '2 eggs',
        '2 tbsp soy sauce',
      ],
      instructions: [
        'Heat oil in a wok over high heat.',
        'Scramble eggs and set aside.',
        `Stir-fry ${primaryIngredient} for 3 minutes, add rice.`,
        'Add soy sauce and eggs, toss until combined.',
      ],
      suggestedAdditions: ['Green onions', 'Sesame oil', 'Peas'],
    },
    {
      title: `Mediterranean ${primaryIngredient} Salad`,
      description: `A fresh and vibrant salad featuring ${primaryIngredient} with Mediterranean flavors.`,
      skillLevel: 'Beginner',
      cookTimeMinutes: 10,
      ingredients: [
        ...ingredients.map((i) => `1 cup ${i}`),
        '2 tbsp olive oil',
        '1 tbsp red wine vinegar',
        '1/4 cup feta cheese',
      ],
      instructions: [
        'Chop all ingredients into bite-sized pieces.',
        'Whisk together olive oil and vinegar for dressing.',
        'Toss ingredients with dressing.',
        'Top with crumbled feta and serve chilled.',
      ],
      suggestedAdditions: ['Kalamata olives', 'Cucumber', 'Cherry tomatoes'],
    },
    {
      title: `Baked ${primaryIngredient} Casserole`,
      description: `A comforting casserole with layers of ${primaryIngredient} and melted cheese.`,
      skillLevel: 'Intermediate',
      cookTimeMinutes: 45,
      ingredients: [
        ...ingredients.map((i) => `1 cup ${i}`),
        '1 cup shredded cheese',
        '1/2 cup cream',
        '1/4 cup breadcrumbs',
      ],
      instructions: [
        'Preheat oven to 375°F (190°C).',
        'Layer ingredients in a baking dish with cream.',
        'Top with cheese and breadcrumbs.',
        'Bake for 35-40 minutes until golden and bubbly.',
      ],
      suggestedAdditions: ['Fresh thyme', 'Garlic powder', 'Parmesan'],
    },
    {
      title: `Spicy ${primaryIngredient} Tacos`,
      description: `Zesty tacos filled with seasoned ${primaryIngredient} and fresh toppings.`,
      skillLevel: 'Beginner',
      cookTimeMinutes: 25,
      ingredients: [
        ...ingredients.map((i) => `1 cup ${i}`),
        '8 small tortillas',
        '1 tbsp taco seasoning',
        '1/2 cup salsa',
      ],
      instructions: [
        `Season ${primaryIngredient} with taco seasoning.`,
        'Cook in a skillet over medium heat for 10 minutes.',
        'Warm tortillas in a dry pan.',
        'Fill tortillas with cooked filling and top with salsa.',
      ],
      suggestedAdditions: ['Sour cream', 'Lime wedges', 'Cilantro'],
    },
  ];
}
