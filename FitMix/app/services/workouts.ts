import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

export interface Program {
  id: string;  // Make id required
  userId: string;
  name: string;
  exercises: Exercise[];
  createdAt: string;
  type: 'custom' | 'ai';
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
