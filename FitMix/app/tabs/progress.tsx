import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ViewStyle, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { progressService, WorkoutProgress } from '../services/progressService';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import MuscleVisualization from '../components/MuscleVisualization';

interface MuscleGroupProps {
  name: string;
  progress: number;
  style?: ViewStyle;
  delay?: number;
}

const MuscleGroup: React.FC<MuscleGroupProps> = ({ name, progress, style, delay = 0 }) => {
  const getProgressGradient = (value: number) => {
    if (value >= 80) return ['#4CAF50', '#45a049'];
    if (value >= 60) return ['#8BC34A', '#7cb342'];
    if (value >= 40) return ['#FFEB3B', '#fdd835'];
    if (value >= 20) return ['#FFC107', '#ffb300'];
    return ['#FF5722', '#f4511e'];
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'timing', duration: 500 }}
      style={[styles.muscleCard, style]}
    >
      <LinearGradient
        colors={getProgressGradient(progress)}
        style={styles.muscleGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.muscleText}>{name}</Text>
        <Text style={styles.progressText}>{progress}%</Text>
      </LinearGradient>
    </MotiView>
  );
};

export default function Progress() {
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<WorkoutProgress | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<{ name: string; progress: number } | null>(null);

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

  const handleMusclePress = (muscleName: string, progress: number) => {
    setSelectedMuscle({ name: muscleName, progress });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.push('/tabs/home')}
            style={styles.backButton}
          >
            <FontAwesome5 name="arrow-left" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Progress Tracker</Text>
        </View>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 100, type: 'timing', duration: 500 }}
        >
          <LinearGradient
            colors={['#7CB9E8', '#72A0C1']}
            style={styles.statsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <FontAwesome5 name="dumbbell" size={24} color="#FFF" style={styles.statsIcon} />
            <Text style={styles.statsTitle}>Total Workouts</Text>
            <Text style={styles.statsValue}>{progressData?.totalWorkouts || 0}</Text>
          </LinearGradient>
        </MotiView>

        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Muscle Progress</Text>
        
        <View style={[styles.visualizationContainer, { backgroundColor: theme.colors.surface }]}>
          <MuscleVisualization 
            muscleProgress={progressData?.muscleProgress || {}}
            onMusclePress={handleMusclePress}
          />
        </View>

        {selectedMuscle && (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 300 }}
            style={[styles.selectedMuscleCard, { backgroundColor: theme.colors.surface }]}
          >
            <Text style={[styles.selectedMuscleName, { color: theme.colors.textPrimary }]}>
              {selectedMuscle.name}
            </Text>
            <Text style={[styles.selectedMuscleProgress, { color: theme.colors.textSecondary }]}>
              Progress: {selectedMuscle.progress}%
            </Text>
          </MotiView>
        )}

        <View style={styles.legend}>
          <Text style={[styles.legendTitle, { color: theme.colors.textPrimary }]}>Progress Level</Text>
          {[
            { color: '#4CAF50', text: 'Excellent (80-100%)' },
            { color: '#8BC34A', text: 'Good (60-79%)' },
            { color: '#FFEB3B', text: 'Average (40-59%)' },
            { color: '#FFC107', text: 'Fair (20-39%)' },
            { color: '#FF5722', text: 'Needs Work (0-19%)' }
          ].map((item, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 1000 + (index * 100), type: 'timing', duration: 500 }}
              style={styles.legendItem}
            >
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>{item.text}</Text>
            </MotiView>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsCard: {
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  statsIcon: {
    marginBottom: 10,
  },
  statsTitle: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5,
  },
  statsValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
  },
  visualizationContainer: {
    borderRadius: 16,
    margin: 10,
    padding: 10,
    minHeight: 500,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedMuscleCard: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedMuscleName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedMuscleProgress: {
    fontSize: 16,
  },
  legend: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
  },
});