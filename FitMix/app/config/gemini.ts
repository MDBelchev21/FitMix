import AsyncStorage from '@react-native-async-storage/async-storage';

export const geminiConfig = {
  model: "gemini-2.0-flash",
  getApiKey: async () => {
    try {
      const apiKey = "AIzaSyAJCfWEp2K1pxIcxiNzelNdu2MKN0258Ck";
      if (!apiKey) {
        throw new Error('Gemini API key not found. Please set it in the app settings.');
      }
      return apiKey;
    } catch (error) {
      console.error('Error retrieving Gemini API key:', error);
      throw error;
    }
  }
};