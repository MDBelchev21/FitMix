import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Program, WorkoutDay, workoutsService } from '../../services/workouts';
import { MotiView } from 'moti';

export default function WorkoutDetails() {
  const { id } = useLocalSearchParams();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activeWorkout, setActiveWorkout] = useState(false);

  useEffect(() => {
    loadProgram();
  }, [id]);

  const loadProgram = async () => {
    try {
      setLoading(true);
      const data = await workoutsService.getProgram(id as string);
      setProgram(data);
      if (data && data.days) {
        const currentDay = data.currentDay || 
          (data.days.findIndex(d => !d.completed) + 1) || 
          1;
        setSelectedDay(currentDay);
      }
    } catch (error) {
      console.error('Error loading program:', error);
      Alert.alert('Error', 'Failed to load workout program');
    } finally {
      setLoading(false);
    }
  };

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    setActiveWorkout(false);
  };

  const startWorkout = () => {
    setActiveWorkout(true);
  };

  const finishWorkout = async () => {
    if (!program || !selectedDay) return;
    
    try {
      await workoutsService.updateWorkoutProgress(program.id, selectedDay, true);
      setActiveWorkout(false);
      loadProgram();
    } catch (error) {
      console.error('Error updating workout progress:', error);
      Alert.alert('Error', 'Failed to save workout progress');
    }
  };

  const updateWeight = async (exerciseIndex: number, weight: string) => {
    if (!program || !selectedDay) return;
    
    const numWeight = parseFloat(weight);
    if (isNaN(numWeight)) return;

    try {
      await workoutsService.updateExerciseWeight(program.id, selectedDay, exerciseIndex, numWeight);
      loadProgram();
    } catch (error) {
      console.error('Error updating weight:', error);
      Alert.alert('Error', 'Failed to save weight');
    }
  };

  const renderDayButton = (day: WorkoutDay) => (
    <TouchableOpacity
      key={day.day}
      onPress={() => handleDaySelect(day.day)}
      style={[
        styles.dayButton,
        selectedDay === day.day && styles.selectedDayButton,
        day.completed && styles.completedDayButton
      ]}
    >
      <Text style={[
        styles.dayButtonText,
        selectedDay === day.day && styles.selectedDayButtonText
      ]}>
        Day {day.day}
      </Text>
      {day.completed && (
        <FontAwesome5 name="check" size={12} color="#4CAF50" style={styles.checkIcon} />
      )}
    </TouchableOpacity>
  );

  const renderExercise = (exercise: any, index: number) => (
    <MotiView
      key={index}
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 100 }}
      style={styles.exerciseCard}
    >
      <LinearGradient
        colors={['#1A1A1A', '#1A1A1A']}
        style={styles.exerciseGradient}
      >
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <View style={styles.exerciseDetails}>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Sets</Text>
            <Text style={styles.detailValue}>{exercise.sets}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Reps</Text>
            <Text style={styles.detailValue}>{exercise.reps}</Text>
          </View>
          {activeWorkout && (
            <View style={styles.weightInputContainer}>
              <Text style={styles.detailLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.weightInput}
                keyboardType="numeric"
                defaultValue={exercise.weight?.toString()}
                onEndEditing={(e) => updateWeight(index, e.nativeEvent.text)}
                placeholder="0"
                placeholderTextColor="#666"
              />
            </View>
          )}
        </View>
        <Text style={styles.exerciseDescription}>
          {exercise.description}
        </Text>
      </LinearGradient>
    </MotiView>
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome5 name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {loading ? (
            <Text style={styles.loadingText}>Loading program...</Text>
          ) : program ? (
            <>
              <Text style={styles.title}>{program.name}</Text>
              <Text style={styles.subtitle}>
                {program.type === 'ai' ? 'AI-Generated Program' : 'Custom Program'}
              </Text>

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.daysContainer}
              >
                {program.days?.map(day => renderDayButton(day))}
              </ScrollView>

              {selectedDay && (
                <View style={styles.workoutContainer}>
                  <View style={styles.workoutHeader}>
                    <Text style={styles.dayTitle}>Day {selectedDay} Workout</Text>
                    {!activeWorkout ? (
                      <TouchableOpacity
                        style={styles.startButton}
                        onPress={startWorkout}
                      >
                        <LinearGradient
                          colors={['#4CAF50', '#45A049']}
                          style={styles.startButtonGradient}
                        >
                          <FontAwesome5 name="play" size={16} color="#FFFFFF" />
                          <Text style={styles.startButtonText}>Start Workout</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.finishButton}
                        onPress={finishWorkout}
                      >
                        <LinearGradient
                          colors={['#4CAF50', '#45A049']}
                          style={styles.startButtonGradient}
                        >
                          <FontAwesome5 name="check" size={16} color="#FFFFFF" />
                          <Text style={styles.startButtonText}>Finish Workout</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.exercisesContainer}>
                    {program.days[selectedDay - 1].exercises.map((exercise, index) => 
                      renderExercise(exercise, index)
                    )}
                  </View>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.errorText}>Program not found</Text>
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
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  daysContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dayButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: '#4B7BFF',
  },
  completedDayButton: {
    backgroundColor: '#1A1A1A',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  dayButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 5,
  },
  selectedDayButtonText: {
    fontWeight: 'bold',
  },
  checkIcon: {
    marginLeft: 5,
  },
  workoutContainer: {
    flex: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  startButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  finishButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  exercisesContainer: {
    gap: 15,
  },
  exerciseCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  exerciseGradient: {
    padding: 20,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 10,
  },
  detailBox: {
    backgroundColor: '#333333',
    padding: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  detailLabel: {
    color: '#666666',
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
  },
  weightInputContainer: {
    backgroundColor: '#333333',
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  weightInput: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 80,
    padding: 0,
  },
});
