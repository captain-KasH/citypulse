import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../utils/constants';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, onBackPress, rightComponent }) => {
  return (
    <View style={styles.container}>
      {onBackPress && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      )}
      
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      
      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SIZES.HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.PADDING,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backText: {
    fontSize: 24,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.BLACK,
    textAlign: 'center',
  },
  rightContainer: {
    width: 48,
    alignItems: 'flex-end',
  },
});

export default Header;