import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { LocationCard } from '../components';
import { useAppStore, usePopularLocations, useIsLoading } from '../store/useAppStore';

const HomeScreen: React.FC = () => {
  const popularLocations = usePopularLocations();
  const isLoading = useIsLoading();
  const { setPopularLocations, setLoading } = useAppStore();

  // Mock data for development - replace with Firebase fetch
  const mockPopularLocations = [
    {
      id: '1',
      name: 'Golden Gate Bridge',
      description: 'Iconic bridge perfect for sunset photography',
      imageUrl: 'https://images.unsplash.com/photo-1564133068-8b1e6c66e6f8?w=500',
      coordinates: { latitude: 37.8199, longitude: -122.4783 },
      poseIds: ['pose1', 'pose2'],
      isPopular: true,
    },
    {
      id: '2',
      name: 'Central Park',
      description: 'Urban oasis with endless photography opportunities',
      imageUrl: 'https://images.unsplash.com/photo-1512673974067-e8b8c5b8b0a9?w=500',
      coordinates: { latitude: 40.7829, longitude: -73.9654 },
      poseIds: ['pose3', 'pose4'],
      isPopular: true,
    },
    {
      id: '3',
      name: 'Beach Sunset',
      description: 'Perfect beach location for golden hour shots',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
      coordinates: { latitude: 34.0195, longitude: -118.4912 },
      poseIds: ['pose5', 'pose6'],
      isPopular: true,
    },
  ];

  const fetchPopularLocations = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual Firebase fetch
      // const locations = await firestore().collection('locations').where('isPopular', '==', true).get();
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPopularLocations(mockPopularLocations);
    } catch (error) {
      console.error('Error fetching popular locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularLocations();
  }, []);

  const handleLocationPress = (locationId: string) => {
    // TODO: Navigate to location detail or camera with location poses
    console.log('Location pressed:', locationId);
  };

  const renderLocationCard = ({ item }: { item: typeof mockPopularLocations[0] }) => (
    <LocationCard
      id={item.id}
      name={item.name}
      description={item.description}
      imageUrl={item.imageUrl}
      poseCount={item.poseIds.length}
      onPress={() => handleLocationPress(item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Popular Locations</Text>
      <Text style={styles.emptyStateText}>
        Check back later for curated photography locations
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Discover</Text>
        <Text style={styles.title}>Popular Locations</Text>
      </View>

      <FlatList
        data={popularLocations}
        renderItem={renderLocationCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.locationsList}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchPopularLocations}
            tintColor={Colors.accent.primary}
          />
        }
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading popular locations...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  greeting: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    marginBottom: 4,
  },

  title: {
    ...Typography.styles.h1,
    color: Colors.text.primary,
  },

  locationsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },

  emptyStateTitle: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyStateText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },
});

export default HomeScreen; 