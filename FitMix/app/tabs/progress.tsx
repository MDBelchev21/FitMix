import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { View, StyleSheet, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { Stack } from 'expo-router';
import { progressService, WorkoutProgress } from '../services/progressService';

interface MuscleGroupProps {
  name: string;
  progress: number;
  style?: ViewStyle;
}

// Muscle group components
const MuscleGroup: React.FC<MuscleGroupProps> = ({ name, progress, style }) => {
  const getProgressColor = (value: number) => {
=======
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { progressService, WorkoutProgress } from '../services/progressService';

// Muscle group components
const MuscleGroup = ({ name, progress, style }) => {
  const getProgressColor = (value) => {
>>>>>>> 931067cc11b0f87170b6b8f02051c37569c59eae
    if (value >= 80) return '#4CAF50';
    if (value >= 60) return '#8BC34A';
    if (value >= 40) return '#FFEB3B';
    if (value >= 20) return '#FFC107';
    return '#FF5722';
  };

  return (
    <View
      style={[
        styles.muscle,
        style,
        { backgroundColor: getProgressColor(progress) },
      ]}
    >
      <Text style={styles.muscleText}>{name}</Text>
      <Text style={styles.progressText}>{progress}%</Text>
    </View>
  );
};

export default function Progress() {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<WorkoutProgress | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await progressService.calculateProgress();
      setProgressData(data);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Progress' }} />
      
      {/* Total Workouts Counter */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Total Workouts Completed</Text>
        <Text style={styles.statsValue}>{progressData?.totalWorkouts || 0}</Text>
      </View>

      <View style={styles.bodyContainer}>
        {/* Upper Body */}
        <View style={styles.upperBody}>
          <MuscleGroup
            name="Shoulders"
            progress={progressData?.muscleProgress.shoulders.progress || 0}
            style={styles.shoulders}
          />
          <View style={styles.torsoRow}>
            <MuscleGroup
              name="Biceps"
              progress={progressData?.muscleProgress.biceps.progress || 0}
              style={styles.biceps}
            />
            <MuscleGroup
              name="Chest"
              progress={progressData?.muscleProgress.chest.progress || 0}
              style={styles.chest}
            />
            <MuscleGroup
              name="Triceps"
              progress={progressData?.muscleProgress.triceps.progress || 0}
              style={styles.triceps}
            />
          </View>
          <MuscleGroup
            name="Back"
            progress={progressData?.muscleProgress.back.progress || 0}
            style={styles.back}
          />
          <MuscleGroup
            name="Abs"
            progress={progressData?.muscleProgress.abs.progress || 0}
            style={styles.abs}
          />
        </View>

        {/* Lower Body */}
        <View style={styles.lowerBody}>
          <MuscleGroup
            name="Quads"
            progress={progressData?.muscleProgress.quads.progress || 0}
            style={styles.quads}
          />
          <MuscleGroup
            name="Calves"
            progress={progressData?.muscleProgress.calves.progress || 0}
            style={styles.calves}
          />
        </View>
      </View>

      {/* Progress Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Progress Level</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text>Excellent (80-100%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#8BC34A' }]} />
            <Text>Good (60-79%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFEB3B' }]} />
            <Text>Average (40-59%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
            <Text>Fair (20-39%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FF5722' }]} />
            <Text>Needs Work (0-19%)</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upperBody: {
    width: '100%',
    alignItems: 'center',
  },
  lowerBody: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  torsoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  muscle: {
    padding: 10,
    borderRadius: 8,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muscleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  shoulders: {
    width: '40%',
    height: 40,
  },
  biceps: {
    width: 60,
    height: 100,
  },
  chest: {
    width: 120,
    height: 100,
  },
  triceps: {
    width: 60,
    height: 100,
  },
  back: {
    width: '60%',
    height: 80,
  },
  abs: {
    width: '40%',
    height: 100,
  },
  quads: {
    width: '50%',
    height: 120,
  },
  calves: {
    width: '30%',
    height: 80,
  },
  legend: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  legendItems: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
});