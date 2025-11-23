import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setLanguage } from '../modules/app/redux/appSlice';
import { COLORS } from '../utils/constants';

interface LanguageToggleProps {
  style?: any;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ style }) => {
  const dispatch = useDispatch();
  const { language } = useSelector((state: RootState) => state.app);

  return (
    <TouchableOpacity 
      style={[styles.languageToggle, style]}
      onPress={() => dispatch(setLanguage(language === 'en' ? 'ar' : 'en'))}
    >
      <Text style={styles.languageText}>
        {language === 'en' ? 'عربي' : 'EN'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  languageToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 16,
  },
  languageText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
});

export default LanguageToggle;