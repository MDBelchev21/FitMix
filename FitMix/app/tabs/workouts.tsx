import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { SafeAreaView } from 'react-native-safe-area-context';
import { workoutsService, Program } from '../services/workouts';

export default function WorkoutsScreen() {
  const { refresh } = useLocalSearchParams();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const userPrograms = await workoutsService.getUserPrograms();
      setPrograms(userPrograms);
    } catch (error) {
      console.error('Error loading programs:', error);
      Alert.alert('Error', 'Failed to load workout programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, [refresh]);

  const handleCreatePress = () => {
    router.push('/tabs/workouts/create');
  };

  const handleAIGeneratorPress = () => {
    router.push('/tabs/workouts/ai-generator');
  };

  const deleteProgram = async (programId: string) => {
    try {
      Alert.alert(
        "Delete Workout",
        "Are you sure you want to delete this workout program?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            onPress: async () => {
              try {
                await workoutsService.deleteProgram(programId);
                setPrograms(programs.filter(p => p.id !== programId));
              } catch (error) {
                console.error('Error deleting program:', error);
                Alert.alert('Error', 'Failed to delete workout program');
              }
            },
            style: 'destructive'
          }
        ]
      );
    } catch (error) {
      console.error('Error showing delete dialog:', error);
    }
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
          style={styles.cardContainer}
          onPress={() => {
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
                  {program.exercises.length} exercises
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => program.id && deleteProgram(program.id)}
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
          <Text style={styles.createButtonText}>Create Program</Text>
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
          <Text style={styles.createButtonText}>AI Generator</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#000000', '#000000']}
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
              <FontAwesome5 name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Workouts</Text>
          </View>
          <Text style={styles.subtitle}>Create and manage your workout programs</Text>

          {renderCreateSection()}
          
          {loading ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="dumbbell" size={50} color="#666" />
              <Text style={styles.emptyStateText}>Loading...</Text>
            </View>
          ) : programs.length > 0 ? (
            <View style={styles.programsContainer}>
              <Text style={styles.sectionTitle}>Your Programs</Text>
              {programs.map((program, index) => renderProgramCard(program, index))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome5 name="dumbbell" size={50} color="#666" />
              <Text style={styles.emptyStateText}>No programs yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Create your first workout program or let AI generate one for you
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
    backgroundColor: '#000000',
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 30,
    marginTop: 10,
  },
  createSection: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  createButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    gap: 10,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  programsContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  cardContainer: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    marginLeft: 10,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
});
