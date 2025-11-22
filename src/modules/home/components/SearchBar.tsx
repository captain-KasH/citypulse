import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Event } from '../../../store/slices/eventSlice';
import { COLORS, SIZES, FEATURE_FLAGS } from '../../../utils/constants';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  suggestions: Event[];
  onSuggestionPress: (eventId: string) => void;
  onFocus?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  suggestions,
  onSuggestionPress,
  onFocus,
}) => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeywordChange = (text: string) => {
    setKeyword(text);
    onSearch(text);
    if (FEATURE_FLAGS.ENABLE_SEARCH_SUGGESTIONS) {
      setShowSuggestions(text.length > 0);
    }
  };

  const handleSuggestionPress = (eventId: string) => {
    setKeyword('');
    setShowSuggestions(false);
    onSuggestionPress(eventId);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        placeholder={t('home.searchPlaceholder')}
        value={keyword}
        onChangeText={handleKeywordChange}
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={COLORS.GRAY}
      />

      {FEATURE_FLAGS.ENABLE_SEARCH_SUGGESTIONS && showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item.id)}
              >
                <Text style={styles.suggestionText} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.suggestionSubtext} numberOfLines={1}>
                  {item.venue}, {item.city}
                </Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
      
      {FEATURE_FLAGS.ENABLE_SEARCH_SUGGESTIONS && showSuggestions && keyword.length > 0 && suggestions.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>{t('home.noEvents')}</Text>
        </View>
      )}


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.PADDING,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: SIZES.BORDER_RADIUS,
    paddingHorizontal: SIZES.PADDING,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.BLACK,
    backgroundColor: COLORS.WHITE,
    marginBottom: 8,
  },
  inputFocused: {
    borderColor: COLORS.PRIMARY,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionsList: {
    maxHeight: 200,
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZES.BORDER_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
  },
  suggestionItem: {
    paddingHorizontal: SIZES.PADDING,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  suggestionText: {
    fontSize: 16,
    color: COLORS.BLACK,
    fontWeight: '500',
  },
  suggestionSubtext: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginTop: 2,
  },
  noResultsContainer: {
    marginTop: 8,
    padding: SIZES.PADDING,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: SIZES.BORDER_RADIUS,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
});

export default SearchBar;