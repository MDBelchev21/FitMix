import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { geminiService } from '../services/gemini';
import { useTranslation } from '../context/TranslationContext';
import { useTheme } from '../context/ThemeContext';

export default function NutritionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [ingredients, setIngredients] = useState('');
  const [mealSuggestion, setMealSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateMeal = async () => {
    if (!ingredients.trim()) {
      Alert.alert(t.error, t.noIngredients);
      return;
    }

    setLoading(true);
    try {
      const suggestion = await geminiService.generateMealSuggestion(ingredients);
      setMealSuggestion(suggestion);
    } catch (error) {
      console.error('Error generating meal:', error);
      Alert.alert(t.error, t.updateFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={[styles.container, isDarkMode ? styles.darkMode : styles.lightMode]}>
        <LinearGradient
          colors={isDarkMode ? ['#1a1a1a', '#2a2a2a'] : ['#ffffff', '#f5f5f5']}
          style={styles.background}
        >
          <View style={styles.mainContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.push('/tabs/home')} style={styles.backButton}>
                <FontAwesome5 name="arrow-left" size={20} color={isDarkMode ? "white" : "black"} />
              </TouchableOpacity>
              <Text style={[styles.title, isDarkMode ? styles.textLight : styles.textDark]}>{t.mealPlanner}</Text>
            </View>

            <ScrollView style={styles.scrollView}>
              <View style={styles.inputSection}>
                <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>{t.ingredients}</Text>
                <TextInput
                  style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                  value={ingredients}
                  onChangeText={setIngredients}
                  placeholder={t.enterIngredients}
                  placeholderTextColor={isDarkMode ? "#666" : "#999"}
                  multiline
                />
                <TouchableOpacity 
                  style={styles.generateButton}
                  onPress={handleGenerateMeal}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.generateButtonText}>{t.generateMeal}</Text>
                  )}
                </TouchableOpacity>
              </View>

              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FF4B4B" />
                  <Text style={[styles.loadingText, isDarkMode ? styles.textLight : styles.textDark]}>{t.generating}</Text>
                </View>
              )}

              {mealSuggestion && !loading && (
                <View style={styles.resultSection}>
                  <View style={[styles.section, isDarkMode ? styles.darkSection : styles.lightSection]}>
                    <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>{t.nutritionalInfo}</Text>
                    <Text style={[styles.text, isDarkMode ? styles.textLight : styles.textDark]}>{mealSuggestion.nutritionalInfo}</Text>
                  </View>

                  <View style={[styles.section, isDarkMode ? styles.darkSection : styles.lightSection]}>
                    <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>{t.cookingInstructions}</Text>
                    <Text style={[styles.text, isDarkMode ? styles.textLight : styles.textDark]}>{mealSuggestion.cookingInstructions}</Text>
                  </View>

                  <View style={[styles.section, isDarkMode ? styles.darkSection : styles.lightSection]}>
                    <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>{t.benefits}</Text>
                    <Text style={[styles.text, isDarkMode ? styles.textLight : styles.textDark]}>{mealSuggestion.benefits}</Text>
                  </View>

                  <TouchableOpacity 
                    style={[styles.tryAgainButton, isDarkMode ? styles.darkButton : styles.lightButton]}
                    onPress={handleGenerateMeal}
                  >
                    <Text style={[styles.tryAgainButtonText, isDarkMode ? styles.textLight : styles.textDark]}>{t.tryAgain}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  darkInput: {
    backgroundColor: '#2a2a2a',
    color: 'white',
  },
  lightInput: {
    backgroundColor: '#f5f5f5',
    color: 'black',
  },
  generateButton: {
    backgroundColor: '#FF4B4B',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  resultSection: {
    marginTop: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  darkSection: {
    backgroundColor: '#2a2a2a',
  },
  lightSection: {
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  tryAgainButton: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  darkButton: {
    backgroundColor: '#2a2a2a',
  },
  lightButton: {
    backgroundColor: '#f5f5f5',
  },
  tryAgainButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  darkMode: {
    backgroundColor: '#1a1a1a',
  },
  lightMode: {
    backgroundColor: '#ffffff',
  },
  textLight: {
    color: 'white',
  },
  textDark: {
    color: 'black',
  },
});