import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiConfig } from '../config/gemini';
import { WorkoutDay } from './workouts';

const genAI = new GoogleGenerativeAI(geminiConfig.apiKey);

export const geminiService = {
  async generateWorkoutProgram(goal: string, experience: string, daysPerWeek: string) {
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
        
        if (!Array.isArray(days)) {
          console.error('Invalid response format: not an array');
          return [];
        }

        for (let i = 0; i < days.length; i++) {
          const day = days[i];
          
          if (typeof day !== 'object') {
            console.error(`Day ${i} is not an object:`, day);
            return [];
          }
          
          if (typeof day.day !== 'number' || day.day < 1 || day.day > parseInt(daysPerWeek)) {
            console.error(`Day ${i} has invalid day number (must be 1-${daysPerWeek}):`, day.day);
            return [];
          }
          
          if (!Array.isArray(day.exercises)) {
            console.error(`Day ${i} has invalid exercises property:`, day.exercises);
            return [];
          }
          
          for (let j = 0; j < day.exercises.length; j++) {
            const ex = day.exercises[j];
            if (!ex || typeof ex !== 'object') {
              console.error(`Exercise ${j} in day ${i} is invalid:`, ex);
              return [];
            }
            
            if (typeof ex.name !== 'string') {
              console.error(`Exercise ${j} in day ${i} has invalid name:`, ex.name);
              return [];
            }
            
            if (typeof ex.sets !== 'number' || ex.sets < 2 || ex.sets > 5) {
              console.error(`Exercise ${j} in day ${i} has invalid sets (must be 2-5):`, ex.sets);
              return [];
            }
            
            if (typeof ex.reps !== 'number' || ex.reps < 6 || ex.reps > 15) {
              console.error(`Exercise ${j} in day ${i} has invalid reps (must be 6-15):`, ex.reps);
              return [];
            }
            
            if (typeof ex.description !== 'string') {
              console.error(`Exercise ${j} in day ${i} has invalid description:`, ex.description);
              return [];
            }
          }
        }

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
  }
};
