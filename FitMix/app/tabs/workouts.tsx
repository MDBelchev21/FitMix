import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { SafeAreaView } from 'react-native-safe-area-context';
import { workoutsService, Program } from '../services/workouts';
import { useTranslation } from '../context/TranslationContext';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../config/firebase';

export default function WorkoutsScreen() {
  const { refresh } = useLocalSearchParams();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = auth.currentUser;
      if (!user) {
        router.replace('/');
        return;
      }

      const userPrograms = await workoutsService.getUserPrograms();
      setPrograms(userPrograms);
    } catch (error) {
      console.error('Error loading programs:', error);
      setError(t.failedToLoadWorkoutPrograms);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        router.replace('/');
      }
    });

    loadPrograms();
    return () => unsubscribe();
  }, [refresh]);

  const handleCreatePress = () => {
    if (!auth.currentUser) {
      router.replace('/');
      return;
    }
    router.push('/tabs/workouts/create');
  };

  const handleAIGeneratorPress = () => {
    if (!auth.currentUser) {
      router.replace('/');
      return;
    }
    router.push('/tabs/workouts/ai-generator');
  };

  const deleteProgram = async (programId: string) => {
    if (!auth.currentUser) {
      router.replace('/');
      return;
    }

    Alert.alert(
      t.deleteWorkout,
      t.areYouSureYouWantToDeleteThisWorkoutProgram,
      [
        {
          text: t.cancel,
          style: "cancel"
        },
        {
          text: t.delete,
          onPress: async () => {
            try {
              await workoutsService.deleteProgram(programId);
              setPrograms(programs.filter(p => p.id !== programId));
            } catch (error) {
              console.error('Error deleting program:', error);
              Alert.alert(t.error, t.failedToDeleteWorkoutProgram);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const renderProgramCard = (program: Program, index: number) => {
    if (!program.id) return null;

    return (
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: index * 100, type: 'timing', duration: 500 }}
        key={program.id}
      >
        <TouchableOpacity
          style={[styles.cardContainer, isDarkMode ? styles.darkItem : styles.lightItem]}
          onPress={() => {
            if (!auth.currentUser) {
              router.replace('/');
              return;
            }
            router.push({
              pathname: '/tabs/workouts/details',
              params: { id: program.id }
            });
          }}
        >
          <LinearGradient
            colors={program.type === 'custom' ? ['#7CB9E8', '#72A0C1'] : ['#4B7BFF', '#3461D9']}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardInner}>
              <View style={styles.iconContainer}>
                <FontAwesome5 
                  name={program.type === 'custom' ? 'dumbbell' : 'robot'} 
                  size={24} 
                  color="#FFF" 
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{program.name}</Text>
                <Text style={styles.cardDescription}>
                  {program.days?.length || 0} {t.days}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteProgram(program.id!)}
              >
                <FontAwesome5 name="trash-alt" size={18} color="#FF4B4B" />
              </TouchableOpacity>
              <FontAwesome5 name="chevron-right" size={20} color="#FFF" style={styles.chevron} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>
    );
  };

  const renderCreateSection = () => (
    <View style={styles.createSection}>
      <TouchableOpacity 
        style={styles.createButton} 
        onPress={handleCreatePress}
      >
        <LinearGradient
          colors={['#FF4B4B', '#FF6B6B']}
          style={styles.createButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontAwesome5 name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>{t.createProgram}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.createButton} 
        onPress={handleAIGeneratorPress}
      >
        <LinearGradient
          colors={['#FF4B4B', '#FF6B6B']}
          style={styles.createButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontAwesome5 name="robot" size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>{t.aiGenerator}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

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
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.push('/tabs/home')}
            >
              <FontAwesome5 name="arrow-left" size={20} color={isDarkMode ? "white" : "black"} />
            </TouchableOpacity>
            <Text style={[styles.title, isDarkMode ? styles.textLight : styles.textDark]}>{t.workouts}</Text>
          </View>
          <Text style={[styles.subtitle, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
            {t.createAndManageYourWorkoutPrograms}
          </Text>

          {renderCreateSection()}
          
          {loading ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="dumbbell" size={50} color={isDarkMode ? "#999" : "#666"} />
              <Text style={[styles.emptyStateText, isDarkMode ? styles.textLight : styles.textDark]}>
                {t.loading}
              </Text>
            </View>
          ) : error ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="dumbbell" size={50} color={isDarkMode ? "#999" : "#666"} />
              <Text style={[styles.emptyStateText, isDarkMode ? styles.textLight : styles.textDark]}>
                {error}
              </Text>
            </View>
          ) : programs.length > 0 ? (
            <View style={styles.programsContainer}>
              <Text style={[styles.sectionTitle, isDarkMode ? styles.textLight : styles.textDark]}>
                {t.yourPrograms}
              </Text>
              {programs.map((program, index) => renderProgramCard(program, index))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome5 name="dumbbell" size={50} color={isDarkMode ? "#999" : "#666"} />
              <Text style={[styles.emptyStateText, isDarkMode ? styles.textLight : styles.textDark]}>
                {t.noProgramsYet}
              </Text>
              <Text style={[styles.emptyStateSubtext, isDarkMode ? styles.textLightSecondary : styles.textDarkSecondary]}>
                {t.createYourFirstWorkoutProgramOrLetAIGenerateOneForYou}
              </Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  createSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  createButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    gap: 10,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  programsContainer: {
    flex: 1,
  },
  cardContainer: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  card: {
    borderRadius: 12,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  deleteButton: {
    padding: 10,
    marginRight: 5,
  },
  chevron: {
    opacity: 0.8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: '80%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  darkMode: {
    backgroundColor: '#1a1a1a',
  },
  lightMode: {
    backgroundColor: '#ffffff',
  },
  darkItem: {
    backgroundColor: '#2a2a2a',
  },
  lightItem: {
    backgroundColor: '#f5f5f5',
  },
  textLight: {
    color: 'white',
  },
  textDark: {
    color: 'black',
  },
  textLightSecondary: {
    color: '#999',
  },
  textDarkSecondary: {
    color: '#666',
  },
});