import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Dimensions,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

const { width } = Dimensions.get('window');

interface LocationCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  poseCount?: number;
  onPress?: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({
  name,
  description,
  imageUrl,
  poseCount,
  onPress,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay} />
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
          {poseCount && (
            <Text style={styles.poseCount}>
              {poseCount} poses available
            </Text>
          )}
        </View>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.7, // 70% of screen width for horizontal scrolling
    height: 200,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  
  imageStyle: {
    borderRadius: 16,
  },
  
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
  },
  
  contentContainer: {
    padding: 16,
    paddingTop: 24,
  },
  
  title: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  
  description: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  
  poseCount: {
    ...Typography.styles.caption,
    color: Colors.accent.primary,
    fontWeight: '500',
  },
  
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});

export default LocationCard; 