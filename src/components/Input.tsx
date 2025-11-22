import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../utils/constants';

interface InputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  style?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={COLORS.GRAY}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.MARGIN,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.BLACK,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: SIZES.BORDER_RADIUS,
    paddingHorizontal: SIZES.PADDING,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.BLACK,
    backgroundColor: COLORS.WHITE,
  },
  inputError: {
    borderColor: COLORS.ERROR,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.ERROR,
    marginTop: 4,
  },
});

export default Input;