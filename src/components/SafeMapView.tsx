import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { COLORS, SIZES } from '../utils/constants';

interface SafeMapViewProps {
  style?: any;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  marker?: {
    coordinate: {
      latitude: number;
      longitude: number;
    };
    title?: string;
    description?: string;
  };
  fallbackText?: string;
}

const SafeMapView: React.FC<SafeMapViewProps> = ({
  style,
  initialRegion,
  marker,
  fallbackText = 'Map unavailable'
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <View style={[styles.errorContainer, style]}>
        <Text style={styles.errorText}>📍</Text>
        <Text style={styles.errorMessage}>{fallbackText}</Text>
        <Text style={styles.coordinatesText}>
          {initialRegion.latitude.toFixed(4)}, {initialRegion.longitude.toFixed(4)}
        </Text>
      </View>
    );
  }

  return (
    <MapView
      style={style}
      initialRegion={initialRegion}
    >
      {marker && (
        <Marker
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: SIZES.BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 32,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: COLORS.GRAY,
    textAlign: 'center',
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 12,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
});

export default SafeMapView;