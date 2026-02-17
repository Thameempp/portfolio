import { db } from './firebase';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    setDoc,
    query,
    orderBy
} from 'firebase/firestore';

export const dbService = {
    // Generic fetch
    async getCollection(collectionName) {
        try {
            const querySnapshot = await getDocs(collection(db, collectionName));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error(`Error getting ${collectionName}:`, error);
            throw error;
        }
    },

    // Generic add
    async addDocument(collectionName, data) {
        try {
            const docRef = await addDoc(collection(db, collectionName), data);
            return { id: docRef.id, ...data };
        } catch (error) {
            console.error(`Error adding to ${collectionName}:`, error);
            throw error;
        }
    },

    // Generic update
    async updateDocument(collectionName, id, data) {
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, data);
            return { id, ...data };
        } catch (error) {
            console.error(`Error updating in ${collectionName}:`, error);
            throw error;
        }
    },

    // Generic delete
    async deleteDocument(collectionName, id) {
        try {
            await deleteDoc(doc(db, collectionName, id));
            return id;
        } catch (error) {
            console.error(`Error deleting from ${collectionName}:`, error);
            throw error;
        }
    },

    // Get a config document by ID (e.g., 'github', 'imagekit')
    async getConfig(configId) {
        try {
            const docRef = doc(db, 'config', configId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            console.error(`Error getting config '${configId}':`, error);
            return null;
        }
    },

    // Save a config document by ID (upsert)
    async saveConfig(configId, data) {
        try {
            const docRef = doc(db, 'config', configId);
            await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
            return data;
        } catch (error) {
            console.error(`Error saving config '${configId}':`, error);
            throw error;
        }
    }
};
