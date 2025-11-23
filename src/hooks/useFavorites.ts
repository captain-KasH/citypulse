import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleFavorite, loadFavorites, clearUserFavorites } from '../modules/event/redux/eventSlice';
import { firebaseFavoritesService } from '../services/firebaseFavorites';

export const useFavorites = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { favorites } = useSelector((state: RootState) => state.event);

  const handleToggleFavorite = async (eventId: string) => {
    if (!user || user.isGuest) return;

    const userId = user.id;
    const userFavorites = favorites[userId] || [];
    const isFavorite = userFavorites.includes(eventId);

    // Update Redux state immediately for better UX
    dispatch(toggleFavorite({ eventId, userId }));

    try {
      if (isFavorite) {
        await firebaseFavoritesService.removeFromFavorites(userId, eventId);
      } else {
        await firebaseFavoritesService.addToFavorites(userId, eventId);
      }
    } catch (error) {
      // Revert Redux state if Firebase operation fails
      dispatch(toggleFavorite({ eventId, userId }));
      console.error('Failed to sync favorites with Firebase:', error);
    }
  };

  const loadUserFavorites = async () => {
    if (!user || user.isGuest) return;

    try {
      const userFavorites = await firebaseFavoritesService.loadFavorites(user.id);
      dispatch(loadFavorites({ userId: user.id, favorites: userFavorites }));
    } catch (error) {
      console.error('Failed to load favorites from Firebase:', error);
    }
  };

  const clearAllFavorites = async () => {
    if (!user || user.isGuest) return;

    try {
      await firebaseFavoritesService.clearFavorites(user.id);
      dispatch(clearUserFavorites(user.id));
    } catch (error) {
      console.error('Failed to clear favorites:', error);
    }
  };

  return {
    favorites: user ? favorites[user.id] || [] : [],
    handleToggleFavorite,
    loadUserFavorites,
    clearAllFavorites,
  };
};