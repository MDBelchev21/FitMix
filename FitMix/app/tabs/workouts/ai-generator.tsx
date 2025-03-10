import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { workoutsService } from '../../services/workouts';
import { geminiService } from '../../services/gemini';
import { useTranslation } from '../../context/TranslationContext';
import { useTheme } from '../../context/ThemeContext';

type Goal = 'muscle-gain' | 'weight-loss' | 'strength' | 'endurance';

export default function AIGenerator() {
  const [goal, setGoal] = useState<Goal>('muscle-gain');
  const [experience, setExperience] = useState('beginner');
  const [daysPerWeek, setDaysPerWeek] = useState('3');
  const [generating, setGenerating] = useState(false);
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();


  const goals: Goal[] = ['muscle-gain', 'weight-loss', 'strength', 'endurance'];
  const experienceLevels = ['beginner', 'intermediate', 'advanced'];

  const getGoalTranslation = (g: Goal) => {
    switch(g) {
      case 'muscle-gain': return t.muscleGain;
      case 'weight-loss': return t.weightLoss;
      case 'strength': return t.strength;
      case 'endurance': return t.endurance;
    }
  };

  const getExperienceTranslation = (level: string) => {
    switch(level) {
      case 'beginner': return t.beginner;
      case 'intermediate': return t.intermediate;
      case 'advanced': return t.advanced;
      default: return level;
    }
  };

  const generateProgram = async () => {
    try {
      setGenerating(true);
      
      const days = await geminiService.generateWorkoutProgram(
        goal,
        experience,
        daysPerWeek
      );

      if (!days || !Array.isArray(days) || days.length === 0) {
        Alert.alert(t.error, t.failedToGenerateProgram);
        return;
      }

      await workoutsService.createProgram({
        name: `${getGoalTranslation(goal)} ${t.program}`,
        days,
        type: 'ai',
        createdAt: new Date().toISOString(),
      });

      router.push({
        pathname: '/tabs/workouts',
        params: { refresh: Date.now().toString() }
      });
    } catch (error) {
      console.error('Error generating program:', error);
      Alert.alert(t.error, t.failedToGenerateProgram);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkMode : styles.lightMode]}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2a2a2a'] : ['#ffffff', '#f5f5f5']}
        style={styles.background}
      >
        <Stack.Screen
          options={{
            headerShown: false
          }}
        />

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome5 name="arrow-left" size={20} color={isDarkMode ? "#FFFFFF" : "#000000"} />
          </TouchableOpacity>

          <Text style={[styles.title, isDarkMode ? styles.textLight : styles.textDark]}>{t.aiWorkoutGenerator}</Text>
          <Text style={[styles.subtitle, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            {t.letAICreateWorkoutProgram}
          </Text>

          <View style={styles.form}>
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 100 }}
            >
              <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>{t.whatsYourGoal}</Text>
              <View style={styles.goalButtons}>
                {goals.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.goalButton]}
                    onPress={() => setGoal(g)}>
                    <LinearGradient
                      colors={goal === g ? ['#4B7BFF', '#3461D9'] : isDarkMode ? ['#1A1A1A', '#1A1A1A'] : ['#f0f0f0', '#f0f0f0']}
                      style={styles.goalButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <FontAwesome5 
                        name={
                          g === 'muscle-gain' ? 'dumbbell' :
                          g === 'weight-loss' ? 'weight' :
                          g === 'strength' ? 'fist-raised' : 'running'
                        } 
                        size={24} 
                        color={goal === g ? '#FFFFFF' : isDarkMode ? '#666666' : '#333333'} 
                        style={styles.goalIcon}
                      />
                      <Text style={[
                        styles.goalButtonText, 
                        goal === g && styles.goalButtonTextActive,
                        goal !== g && (isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary)
                      ]}>
                        {getGoalTranslation(g)}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 200 }}
            >
              <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>{t.experienceLevel}</Text>
              <View style={styles.experienceButtons}>
                {experienceLevels.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[styles.experienceButton]}
                    onPress={() => setExperience(level)}>
                    <LinearGradient
                      colors={experience === level ? ['#4B7BFF', '#3461D9'] : isDarkMode ? ['#1A1A1A', '#1A1A1A'] : ['#f0f0f0', '#f0f0f0']}
                      style={styles.experienceButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={[
                        styles.experienceButtonText, 
                        experience === level && styles.experienceButtonTextActive,
                        experience !== level && (isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary)
                      ]}>
                        {getExperienceTranslation(level)}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 300 }}
            >
              <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>{t.daysPerWeek}</Text>
              <View style={styles.daysContainer}>
                {[2,3,4,5,6].map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayButton]}
                    onPress={() => setDaysPerWeek(day.toString())}>
                    <LinearGradient
                      colors={parseInt(daysPerWeek) === day ? ['#4B7BFF', '#3461D9'] : isDarkMode ? ['#1A1A1A', '#1A1A1A'] : ['#f0f0f0', '#f0f0f0']}
                      style={styles.dayButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={[
                        styles.dayButtonText,
                        parseInt(daysPerWeek) === day && styles.dayButtonTextActive,
                        parseInt(daysPerWeek) !== day && (isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary)
                      ]}>
                        {day}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </MotiView>
          </View>
        </ScrollView>

        <View style={[styles.footer, isDarkMode ? styles.darkBorder : styles.lightBorder]}>
          <TouchableOpacity style={styles.generateButton} onPress={generateProgram} disabled={generating}>
            <LinearGradient
              colors={['#4B7BFF', '#3461D9']}
              style={styles.generateButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {generating ? (
                <Text style={styles.buttonText}>{t.generatingProgram}</Text>
              ) : (
                <>
                  <FontAwesome5 name="robot" size={20} color="white" />
                  <Text style={styles.buttonText}>{t.generateProgram}</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkMode: {
    backgroundColor: '#000000',
  },
  lightMode: {
    backgroundColor: '#ffffff',
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  form: {
    gap: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  goalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  goalButton: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  goalButtonGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  goalIcon: {
    marginBottom: 5,
  },
  goalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  goalButtonTextActive: {
    color: '#FFFFFF',
  },
  experienceButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  experienceButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  experienceButtonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  experienceButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  experienceButtonTextActive: {
    color: '#FFFFFF',
  },
  daysContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dayButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  dayButtonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  dayButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  darkBorder: {
    borderTopColor: '#333333',
  },
  lightBorder: {
    borderTopColor: '#e0e0e0',
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  generateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    gap: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  textLight: {
    color: '#FFFFFF',
  },
  textDark: {
    color: '#000000',
  },
  textLightSecondary: {
    color: '#666666',
  },
  textDarkSecondary: {
    color: '#666666',
  },
});
