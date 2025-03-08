import { geminiConfig } from '../config/gemini';
import { WorkoutDay } from './workouts';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type MealType = 'high-protein' | 'low-carb' | 'high-carb' | 'balanced' | 'keto' | 'vegetarian';

export interface MealSuggestion {
  name: string;
  ingredients: Array<{
    item: string;
    amount: string;
  }>;
  instructions: string[];
  nutritionalBenefits: string[];
  macros: {
    calories: string;
    protein: string;
    carbs: string;
    fats: string;
  };
  tags: string[];
}

export const geminiService = {
  async initializeClient() {
    const apiKey = await geminiConfig.getApiKey();
    return new GoogleGenerativeAI(apiKey);
  },

  async generateWorkoutProgram(goal: string, experience: string, daysPerWeek: string) {
    const genAI = await this.initializeClient();
    const model = genAI.getGenerativeModel({ model: geminiConfig.model });
    
    const prompt = `Generate a ${daysPerWeek}-day workout program for ${experience} level, goal: ${goal}.
Return ONLY a valid JSON array of workout days, where each day has:
{
  "day": number (1-${daysPerWeek}),
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": number (2-5),
      "reps": number (6-15),
      "description": "Brief instructions"
    }
  ]
}

Include compound exercises like squats, deadlifts, bench press for muscle gain and strength.
For weight loss, include both compound movements and higher rep ranges.
For endurance, focus on bodyweight exercises and higher rep ranges.

Organize exercises logically by muscle groups for each day.
Ensure proper rest between muscle groups across days.

Respond ONLY with the JSON array, no additional text or formatting.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim()
        .replace(/```json\s*|\s*```/g, '')
        .replace(/[\u201C\u201D]/g, '"')
        .trim();
      
      try {
        console.log('Raw Gemini response:', text);
        const days = JSON.parse(text) as WorkoutDay[];
        return days;
      } catch (error) {
        console.error('Failed to parse Gemini response:', error);
        console.error('Raw text:', text);
        return [];
      }
    } catch (error) {
      console.error('Error generating workout program:', error);
      throw error;
    }
  },

  async generateSingleDayWorkout(goal: string, experience: string, maxAttempts = 5) {
    const genAI = await this.initializeClient();
    const model = genAI.getGenerativeModel({ model: geminiConfig.model });
    
    const prompt = `Generate a single day workout for ${experience} level, goal: ${goal}.
Return ONLY a valid JSON array of exercises in this format:
[
  {
    "name": "Exercise Name",
    "sets": number (2-5),
    "reps": number (6-15),
    "description": "Brief instructions"
  }
]

Include 4-6 exercises.
Include compound exercises like squats, deadlifts, bench press for muscle gain and strength.
For weight loss, include both compound movements and higher rep ranges.
For endurance, focus on bodyweight exercises and higher rep ranges.

Organize exercises logically by muscle groups.
Respond ONLY with the JSON array, no additional text or formatting.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim()
        .replace(/```json\s*|\s*```/g, '')
        .replace(/[\u201C\u201D]/g, '"')
        .trim();
      
      try {
        console.log('Raw Gemini response:', text);
        const exercises = JSON.parse(text) as any[];
        return exercises;
      } catch (error) {
        console.error('Failed to parse Gemini response:', error);
        console.error('Raw text:', text);
        return [];
      }
    } catch (error) {
      console.error('Error generating workout:', error);
      return [];
    }
  },

  async generateMealSuggestion(mealType: MealType) {
    const genAI = await this.initializeClient();
    const model = genAI.getGenerativeModel({ model: geminiConfig.model });
    
    const prompt = `Generate a healthy ${mealType} meal recipe.
Return ONLY a valid JSON object with this structure:
{
  "name": "Name of the dish",
  "ingredients": [
    {
      "item": "Ingredient name",
      "amount": "Amount with unit (e.g., '2 cups', '300g')"
    }
  ],
  "instructions": [
    "Step by step cooking instructions"
  ],
  "nutritionalBenefits": [
    "List of health benefits and nutritional value"
  ],
  "macros": {
    "calories": "Approximate calories per serving",
    "protein": "Protein content in grams",
    "carbs": "Carbohydrate content in grams",
    "fats": "Fat content in grams"
  },
  "tags": [
    "List of relevant tags (e.g., 'High Protein', 'Low Carb', 'Quick', 'Easy')"
  ]
}

Focus on:
- For high-protein: lean meats, eggs, legumes
- For low-carb: vegetables, proteins, healthy fats
- For high-carb: whole grains, fruits, legumes
- For balanced: mix of proteins, carbs, and healthy fats
- For keto: high fat, very low carb, moderate protein
- For vegetarian: plant-based proteins, whole grains, vegetables

Keep instructions clear and concise.
Respond ONLY with the JSON object, no additional text.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim()
        .replace(/```json\s*|\s*```/g, '')
        .replace(/[\u201C\u201D]/g, '"')
        .trim();
      
      try {
        const recipe = JSON.parse(text);
        
        // Validate response structure
        if (!recipe.name || !Array.isArray(recipe.ingredients) || !Array.isArray(recipe.instructions) || 
            !Array.isArray(recipe.nutritionalBenefits) || !recipe.macros) {
          console.error('Invalid recipe structure:', recipe);
          return null;
        }

        return recipe;
      } catch (error) {
        console.error('Failed to parse recipe response:', error);
        console.error('Raw text:', text);
        return null;
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      throw error;
    }
  }
};
