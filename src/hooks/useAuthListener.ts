import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { firebaseAuthService } from '../services/firebaseAuth';
import { loginSuccess, logout } from '../modules/auth/redux/authSlice';
import { User } from '../modules/auth/redux/authSlice';

export const useAuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          isGuest: firebaseUser.isAnonymous,
        };
        dispatch(loginSuccess(user));
      } else {
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, [dispatch]);
};