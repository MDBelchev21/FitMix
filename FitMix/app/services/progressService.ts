<<<<<<< HEAD
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
=======
import firestore from '@react-native-firebase/firestore';
>>>>>>> 931067cc11b0f87170b6b8f02051c37569c59eae

export interface MuscleProgress {
  muscle: string;
  progress: number;
  exerciseCount: number;
  averageWeight: number;
}

export interface WorkoutProgress {
  totalWorkouts: number;
  muscleProgress: { [key: string]: MuscleProgress };
}

export const progressService = {
  async calculateProgress(): Promise<WorkoutProgress> {
    try {
<<<<<<< HEAD
      const user = auth.currentUser;
      if (!user) throw new Error('User must be logged in to fetch progress');

      // Fetch completed workouts from Firebase
      const workoutsSnapshot = await getDocs(collection(db, 'completed_workouts'));
=======
      // Fetch completed workouts from Firebase
      const workoutsSnapshot = await firestore()
        .collection('completed_workouts')
        .get();

>>>>>>> 931067cc11b0f87170b6b8f02051c37569c59eae
      const workouts = workoutsSnapshot.docs.map(doc => doc.data());

      // Initialize progress tracking
      const muscleProgress: { [key: string]: MuscleProgress } = {
        chest: { muscle: 'Chest', progress: 0, exerciseCount: 0, averageWeight: 0 },
        biceps: { muscle: 'Biceps', progress: 0, exerciseCount: 0, averageWeight: 0 },
        triceps: { muscle: 'Triceps', progress: 0, exerciseCount: 0, averageWeight: 0 },
        shoulders: { muscle: 'Shoulders', progress: 0, exerciseCount: 0, averageWeight: 0 },
        back: { muscle: 'Back', progress: 0, exerciseCount: 0, averageWeight: 0 },
        abs: { muscle: 'Abs', progress: 0, exerciseCount: 0, averageWeight: 0 },
        quads: { muscle: 'Quads', progress: 0, exerciseCount: 0, averageWeight: 0 },
        calves: { muscle: 'Calves', progress: 0, exerciseCount: 0, averageWeight: 0 },
      };

      // Calculate progress for each muscle group
      workouts.forEach(workout => {
        if (workout.exercises) {
          workout.exercises.forEach((exercise: any) => {
            const muscleGroup = exercise.muscleGroup?.toLowerCase();
            if (muscleProgress[muscleGroup]) {
              muscleProgress[muscleGroup].exerciseCount++;
              muscleProgress[muscleGroup].averageWeight = 
                (muscleProgress[muscleGroup].averageWeight * (muscleProgress[muscleGroup].exerciseCount - 1) + 
                 (exercise.weight || 0)) / muscleProgress[muscleGroup].exerciseCount;
            }
          });
        }
      });

      // Calculate progress percentage based on exercise count and weight progression
      Object.keys(muscleProgress).forEach(muscle => {
        const progress = muscleProgress[muscle];
        // Calculate progress as a percentage (0-100) based on exercise count and weight progression
        const exerciseScore = Math.min(progress.exerciseCount * 5, 50); // Max 50% from exercise count
        const weightScore = Math.min(progress.averageWeight / 2, 50); // Max 50% from weight progression
        progress.progress = Math.round(exerciseScore + weightScore);
      });

      return {
        totalWorkouts: workouts.length,
        muscleProgress
      };
    } catch (error) {
      console.error('Error calculating progress:', error);
      throw error;
    }
  }
};
