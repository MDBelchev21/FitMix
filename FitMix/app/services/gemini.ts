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
  }
};
