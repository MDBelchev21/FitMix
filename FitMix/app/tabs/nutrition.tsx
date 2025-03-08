import React, { useState } from 'react';
import {
  View,
  Text,
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
import { geminiService, MealType, MealSuggestion } from '../services/gemini';
import { useTranslation } from '../context/TranslationContext';
import { useTheme } from '../context/ThemeContext';
import { MotiView } from 'moti';

export default function NutritionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selectedMealType, setSelectedMealType] = useState<MealType>('balanced');
  const [mealSuggestion, setMealSuggestion] = useState<MealSuggestion | null>(null);
  const [loading, setLoading] = useState(false);

  const mealTypes = [
    { type: 'high-protein', icon: 'drumstick-bite' },
    { type: 'low-carb', icon: 'leaf' },
    { type: 'high-carb', icon: 'bread-slice' },
    { type: 'balanced', icon: 'balance-scale' },
    { type: 'keto', icon: 'bacon' },
    { type: 'vegetarian', icon: 'carrot' }
  ];

  const handleGenerateMeal = async () => {
    setLoading(true);
    try {
      const suggestion = await geminiService.generateMealSuggestion(selectedMealType);
      setMealSuggestion(suggestion);
    } catch (error) {
      console.error('Error generating meal:', error);
      Alert.alert(t.nutritionScreen.error, t.nutritionScreen.updateFailed);
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
              <Text style={[styles.title, isDarkMode ? styles.textLight : styles.textDark]}>{t.nutritionScreen.title}</Text>
            </View>

            <ScrollView style={styles.scrollView}>
              <View style={styles.mealTypeSection}>
                <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>
                  {t.nutritionScreen.selectMealType}
                </Text>
                <View style={styles.mealTypeGrid}>
                  {mealTypes.map(({ type, icon }) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.mealTypeButton,
                        selectedMealType === type && styles.selectedMealTypeButton,
                        isDarkMode ? styles.darkButton : styles.lightButton
                      ]}
                      onPress={() => setSelectedMealType(type as MealType)}
                    >
                      <LinearGradient
                        colors={selectedMealType === type ? 
                          ['#4B7BFF', '#3461D9'] : 
                          isDarkMode ? ['#333333', '#333333'] : ['#f0f0f0', '#f0f0f0']
                        }
                        style={styles.mealTypeGradient}
                      >
                        <FontAwesome5 
                          name={icon} 
                          size={24} 
                          color={selectedMealType === type ? '#FFFFFF' : isDarkMode ? '#CCCCCC' : '#666666'} 
                          style={styles.mealTypeIcon}
                        />
                        <Text style={[
                          styles.mealTypeText,
                          selectedMealType === type && styles.selectedMealTypeText,
                          selectedMealType !== type && (isDarkMode ? styles.textLight : styles.textDark)
                        ]}>
                          {t.nutritionScreen.mealTypes[type as keyof typeof t.nutritionScreen.mealTypes]}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity 
                  style={[styles.generateButton, isDarkMode ? styles.darkButton : styles.lightButton]}
                  onPress={handleGenerateMeal}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={isDarkMode ? "white" : "black"} />
                  ) : (
                    <Text style={[styles.generateButtonText, isDarkMode ? styles.textLight : styles.textDark]}>
                      {t.nutritionScreen.generateMeal}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4B7BFF" />
                  <Text style={[styles.loadingText, isDarkMode ? styles.textLight : styles.textDark]}>
                    {t.nutritionScreen.generating}
                  </Text>
                </View>
              )}

              {mealSuggestion && !loading && (
                <MotiView
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  style={styles.resultSection}
                >
                  <View style={[styles.section, isDarkMode ? styles.darkSection : styles.lightSection]}>
                    <Text style={[styles.recipeName, isDarkMode ? styles.textLight : styles.textDark]}>
                      {mealSuggestion.name}
                    </Text>
                    
                    <View style={styles.macrosGrid}>
                      {Object.entries(mealSuggestion.macros).map(([key, value]) => (
                        <View key={key} style={styles.macroItem}>
                          <Text style={[styles.macroLabel, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                            {t.nutritionScreen.macros[key as keyof typeof t.nutritionScreen.macros]}
                          </Text>
                          <Text style={[styles.macroValue, isDarkMode ? styles.textLight : styles.textDark]}>
                            {String(value)}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.tagsContainer}>
                      {mealSuggestion.tags.map((tag: string, index: number) => (
                        <View key={index} style={[styles.tag, isDarkMode ? styles.darkTag : styles.lightTag]}>
                          <Text style={[styles.tagText, isDarkMode ? styles.textLight : styles.textDark]}>
                            {tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={[styles.section, isDarkMode ? styles.darkSection : styles.lightSection]}>
                    <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>
                      {t.nutritionScreen.ingredients}
                    </Text>
                    {mealSuggestion.ingredients.map((ingredient: any, index: number) => (
                      <Text key={index} style={[styles.ingredientText, isDarkMode ? styles.textLight : styles.textDark]}>
                        • {ingredient.amount} {ingredient.item}
                      </Text>
                    ))}
                  </View>

                  <View style={[styles.section, isDarkMode ? styles.darkSection : styles.lightSection]}>
                    <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>
                      {t.nutritionScreen.instructions}
                    </Text>
                    {mealSuggestion.instructions.map((instruction: string, index: number) => (
                      <Text key={index} style={[styles.instructionText, isDarkMode ? styles.textLight : styles.textDark]}>
                        {index + 1}. {instruction}
                      </Text>
                    ))}
                  </View>

                  <View style={[styles.section, isDarkMode ? styles.darkSection : styles.lightSection]}>
                    <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>
                      {t.nutritionScreen.benefits}
                    </Text>
                    {mealSuggestion.nutritionalBenefits.map((benefit: string, index: number) => (
                      <Text key={index} style={[styles.benefitText, isDarkMode ? styles.textLight : styles.textDark]}>
                        • {benefit}
                      </Text>
                    ))}
                  </View>

                  <TouchableOpacity 
                    style={[styles.tryAgainButton, isDarkMode ? styles.darkButton : styles.lightButton]}
                    onPress={handleGenerateMeal}
                  >
                    <Text style={[styles.tryAgainButtonText, isDarkMode ? styles.textLight : styles.textDark]}>
                      {t.nutritionScreen.tryAgain}
                    </Text>
                  </TouchableOpacity>
                </MotiView>
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
  mealTypeSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  mealTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mealTypeButton: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedMealTypeButton: {
    borderWidth: 2,
    borderColor: '#4B7BFF',
  },
  mealTypeGradient: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealTypeIcon: {
    marginBottom: 8,
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedMealTypeText: {
    color: '#FFFFFF',
  },
  generateButton: {
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  generateButtonText: {
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
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  macrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  macroItem: {
    width: '48%',
    marginBottom: 10,
  },
  macroLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
  },
  ingredientText: {
    fontSize: 16,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  benefitText: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  tryAgainButton: {
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
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
    color: '#ffffff',
  },
  textDark: {
    color: '#000000',
  },
  textLightSecondary: {
    color: '#cccccc',
  },
  textDarkSecondary: {
    color: '#666666',
  },
  darkButton: {
    backgroundColor: '#333333',
  },
  lightButton: {
    backgroundColor: '#f5f5f5',
  },
  darkSection: {
    backgroundColor: '#333333',
  },
  lightSection: {
    backgroundColor: '#f5f5f5',
  },
  darkTag: {
    backgroundColor: '#444444',
  },
  lightTag: {
    backgroundColor: '#e0e0e0',
  },
});