import { collection, addDoc, getDocs, deleteDoc, doc, query, where, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  description: string;
  weight?: number;
}

export interface WorkoutDay {
  day: number;
  exercises: Exercise[];
  completed?: boolean;
}

export interface Program {
  id: string;
  userId: string;
  name: string;
  days: WorkoutDay[];
  createdAt: string;
  type: 'custom' | 'ai';
  currentDay?: number;
  lastWorkout?: string;
}

const COLLECTION_NAME = 'workouts';

export const workoutsService = {
  async createProgram(program: Omit<Program, 'id' | 'userId'>): Promise<string> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User must be logged in to create a program');

      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...program,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  },

  async getUserPrograms(): Promise<Program[]> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User must be logged in to fetch programs');

      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Program));
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  },

  async getProgram(programId: string): Promise<Program | null> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User must be logged in to fetch program');

      const docRef = doc(db, COLLECTION_NAME, programId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data();
      if (data.userId !== user.uid) throw new Error('Unauthorized access to program');

      return {
        id: docSnap.id,
        ...data
      } as Program;
    } catch (error) {
      console.error('Error fetching program:', error);
      throw error;
    }
  },

  async updateExerciseWeight(
    programId: string,
    dayNumber: number,
    exerciseIndex: number,
    weight: number
  ): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User must be logged in');

      const docRef = doc(db, COLLECTION_NAME, programId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) throw new Error('Program not found');
      
      const data = docSnap.data() as Program;
      if (data.userId !== user.uid) throw new Error('Unauthorized');

      // Update the weight for the specific exercise
      const updatedDays = [...data.days];
      const day = updatedDays[dayNumber - 1];
      if (!day) throw new Error('Day not found');

      const exercise = day.exercises[exerciseIndex];
      if (!exercise) throw new Error('Exercise not found');

      exercise.weight = weight;

      await updateDoc(docRef, { days: updatedDays });
    } catch (error) {
      console.error('Error updating exercise weight:', error);
      throw error;
    }
  },

  async updateWorkoutProgress(
    programId: string,
    dayNumber: number,
    completed: boolean
  ): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User must be logged in');

      const docRef = doc(db, COLLECTION_NAME, programId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) throw new Error('Program not found');
      
      const data = docSnap.data() as Program;
      if (data.userId !== user.uid) throw new Error('Unauthorized');

      // Update the completion status for the specific day
      const updatedDays = [...data.days];
      const day = updatedDays[dayNumber - 1];
      if (!day) throw new Error('Day not found');

      day.completed = completed;

      await updateDoc(docRef, { 
        days: updatedDays,
        currentDay: dayNumber,
        lastWorkout: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating workout progress:', error);
      throw error;
    }
  },

  async deleteProgram(programId: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User must be logged in to delete a program');

      await deleteDoc(doc(db, COLLECTION_NAME, programId));
    } catch (error) {
      console.error('Error deleting program:', error);
      throw error;
    }
  }
};
