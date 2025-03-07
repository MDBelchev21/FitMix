import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { workoutsService, Exercise } from '../../services/workouts';

export default function CreateWorkout() {
  const [programName, setProgramName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([{ name: '', sets: 0, reps: 0, description: '' }]);

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 0, reps: 0, description: '' }]);
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string) => {
    const updatedExercises = [...exercises];
    if (field === 'sets' || field === 'reps') {
      const numValue = Math.max(0, parseInt(value) || 0);
      updatedExercises[index] = { 
        ...updatedExercises[index], 
        [field]: numValue
      };
    } else {
      updatedExercises[index] = {
        ...updatedExercises[index], 
        [field]: value 
      };
    }
    setExercises(updatedExercises);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const saveProgram = async () => {
    try {
      if (!programName.trim()) {
        Alert.alert('Error', 'Please enter a program name');
        return;
      }

      // More detailed validation
      const invalidExercises = exercises.filter(ex => 
        !ex.name.trim() || 
        typeof ex.sets !== 'number' || 
        ex.sets <= 0 ||
        typeof ex.reps !== 'number' || 
        ex.reps <= 0 ||
        !ex.description?.trim()
      );

      if (invalidExercises.length > 0) {
        Alert.alert('Error', 'Please ensure all exercises have a name, description, and valid numbers for sets and reps (greater than 0)');
        return;
      }

      const programData = {
        name: programName,
        days: [
          {
            day: 1,
            exercises: exercises.map(ex => ({
              name: ex.name.trim(),
              sets: ex.sets,
              reps: ex.reps,
              description: ex.description.trim(),
              weight: 0
            })),
            completed: false
          }
        ],
        type: 'custom' as const,
        createdAt: new Date().toISOString(),
        currentDay: 1,
        lastWorkout: undefined
      };

      await workoutsService.createProgram(programData);

      router.push({
        pathname: '/tabs/workouts',
        params: { refresh: Date.now().toString() }
      });
    } catch (error) {
      console.error('Error saving program:', error);
      Alert.alert('Error', 'Failed to save workout program');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#000000', '#000000']}
        style={styles.background}
      >
        <Stack.Screen
          options={{
            title: 'Create Workout',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTitleStyle: {
              color: '#FFFFFF',
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <FontAwesome5 name="arrow-left" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            ),
          }}
        />

        <ScrollView style={styles.content}>
          <View style={styles.form}>
            <Text style={styles.label}>Program Name</Text>
            <TextInput
              style={styles.input}
              value={programName}
              onChangeText={setProgramName}
              placeholder="Enter program name"
              placeholderTextColor="#666"
            />

            <Text style={styles.sectionTitle}>Exercises</Text>
            {exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseItem}>
                <Text style={styles.exerciseNumber}>Exercise {index + 1}</Text>
                <TextInput
                  style={styles.input}
                  value={exercise.name}
                  onChangeText={(text) => updateExercise(index, 'name', text)}
                  placeholder="Exercise name"
                  placeholderTextColor="#666"
                />
                <View style={styles.exerciseDetails}>
                  <View style={styles.detailInput}>
                    <Text style={styles.detailLabel}>Sets</Text>
                    <TextInput
                      style={styles.numberInput}
                      value={exercise.sets.toString()}
                      onChangeText={(text) => updateExercise(index, 'sets', text)}
                      keyboardType="numeric"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.detailInput}>
                    <Text style={styles.detailLabel}>Reps</Text>
                    <TextInput
                      style={styles.numberInput}
                      value={exercise.reps.toString()}
                      onChangeText={(text) => updateExercise(index, 'reps', text)}
                      keyboardType="numeric"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.detailInput}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <TextInput
                      style={styles.numberInput}
                      value={exercise.description}
                      onChangeText={(text) => updateExercise(index, 'description', text)}
                      placeholderTextColor="#666"
                    />
                  </View>
                  <TouchableOpacity style={styles.removeButton} onPress={() => removeExercise(index)}>
                    <FontAwesome5 name="trash" size={20} color="#FF0000" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={addExercise}>
              <FontAwesome5 name="plus" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Exercise</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={saveProgram}>
              <Text style={styles.saveButtonText}>Save Program</Text>
            </TouchableOpacity>
          </View>
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
  form: {
    gap: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16,
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    color: '#FFFFFF',
  },
  exerciseItem: {
    backgroundColor: '#1A1A1A',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    gap: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  exerciseNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  detailInput: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  numberInput: {
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16,
    color: '#FFFFFF',
  },
  removeButton: {
    padding: 10,
  },
  addButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  saveButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});