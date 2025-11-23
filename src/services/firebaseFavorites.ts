import firestore from '@react-native-firebase/firestore';

const FAVORITES_COLLECTION = 'FavoritesItems';

export const firebaseFavoritesService = {
  /**
   * Save user favorites to Firestore
   */
  async saveFavorites(userId: string, favorites: string[]): Promise<void> {
    try {
      await firestore()
        .collection(FAVORITES_COLLECTION)
        .doc(userId)
        .set({
          favorites,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    } catch (error) {
      console.error('Error saving favorites to Firestore:', error);
      throw error;
    }
  },

  /**
   * Load user favorites from Firestore
   */
  async loadFavorites(userId: string): Promise<string[]> {
    try {
      const doc = await firestore()
        .collection(FAVORITES_COLLECTION)
        .doc(userId)
        .get();

      if (doc.exists()) {
        const data = doc.data();
        return data?.favorites || [];
      }
      return [];
    } catch (error) {
      console.error('Error loading favorites from Firestore:', error);
      return [];
    }
  },

  /**
   * Add event to favorites
   */
  async addToFavorites(userId: string, eventId: string): Promise<void> {
    try {
      await firestore()
        .collection(FAVORITES_COLLECTION)
        .doc(userId)
        .set({
          favorites: firestore.FieldValue.arrayUnion(eventId),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  /**
   * Remove event from favorites
   */
  async removeFromFavorites(userId: string, eventId: string): Promise<void> {
    try {
      await firestore()
        .collection(FAVORITES_COLLECTION)
        .doc(userId)
        .set({
          favorites: firestore.FieldValue.arrayRemove(eventId),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },

  /**
   * Clear all favorites for user
   */
  async clearFavorites(userId: string): Promise<void> {
    try {
      await firestore()
        .collection(FAVORITES_COLLECTION)
        .doc(userId)
        .delete();
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw error;
    }
  }
};