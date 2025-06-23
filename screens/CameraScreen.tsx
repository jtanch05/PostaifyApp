import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { PrimaryButton } from '../components';
import { Camera as CameraIcon, Circle, X } from 'phosphor-react-native';

interface Pose {
  id: string;
  name: string;
  description: string;
  category: string;
  templateImageUrl: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

interface CameraScreenProps {
  onClose: () => void;
  onPhotoTaken: (photoUri: string) => void;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ onClose, onPhotoTaken }) => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [selectedPose, setSelectedPose] = useState<Pose | null>(null);
  const [showPoseOverlay, setShowPoseOverlay] = useState(false);
  const [availablePoses, setAvailablePoses] = useState<Pose[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  
  const cameraRef = useRef<CameraView>(null);

  // Mock poses data - replace with Firebase fetch
  const mockNightPoses: Pose[] = [
    {
      id: 'night1',
      name: 'Night Portrait',
      description: 'Perfect for low-light selfies',
      category: 'Night Shots',
      templateImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      difficulty: 'beginner',
      tags: ['night', 'portrait', 'selfie'],
    },
    {
      id: 'night2',
      name: 'Silhouette',
      description: 'Create dramatic silhouette effects',
      category: 'Night Shots',
      templateImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
      difficulty: 'intermediate',
      tags: ['night', 'silhouette', 'dramatic'],
    },
  ];

  useEffect(() => {
    setupCamera();
  }, []);

  const setupCamera = async () => {
    // Request camera permission
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert('Camera Permission', 'Camera access is required to take photos.');
        return;
      }
    }

    // Request location permission
    if (!locationPermission?.granted) {
      const result = await requestLocationPermission();
      if (!result.granted) {
        Alert.alert('Location Permission', 'Location access helps find relevant poses.');
      }
    }

    // Get current location and determine poses
    await getCurrentLocationAndPoses();
  };

  const getCurrentLocationAndPoses = async () => {
    try {
      if (locationPermission?.granted) {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
        
        // TODO: Check for nearby locations within 5km radius
        // For now, using the test case scenario (Kulai, Johor, Malaysia at 10:47 PM)
        const currentHour = new Date().getHours();
        
        // Since it's night time (10:47 PM), prioritize Night Shots category
        if (currentHour >= 19 || currentHour <= 6) {
          setAvailablePoses(mockNightPoses);
        } else {
          // In a real app, this would fetch generic poses from Firebase
          setAvailablePoses(mockNightPoses); // Using night poses for demo
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
      // Fallback to generic poses
      setAvailablePoses(mockNightPoses);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (photo?.uri) {
          onPhotoTaken(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const selectPose = (pose: Pose) => {
    setSelectedPose(pose);
    setShowPoseOverlay(true);
  };

  const clearPose = () => {
    setSelectedPose(null);
    setShowPoseOverlay(false);
  };

  if (!cameraPermission?.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            This app needs camera access to take photos and provide pose guidance.
          </Text>
          <PrimaryButton
            title="Grant Permission"
            onPress={requestCameraPermission}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        {/* Pose overlay */}
        {showPoseOverlay && selectedPose && (
          <View style={styles.poseOverlay}>
            <Image
              source={{ uri: selectedPose.templateImageUrl }}
              style={styles.poseTemplate}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Header */}
        <SafeAreaView style={styles.header}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.text.primary} />
          </Pressable>
          
          {selectedPose && (
            <View style={styles.poseInfo}>
              <Text style={styles.poseName}>{selectedPose.name}</Text>
              <Pressable style={styles.clearPoseButton} onPress={clearPose}>
                <Text style={styles.clearPoseText}>Clear</Text>
              </Pressable>
            </View>
          )}

          <Pressable style={styles.flipButton} onPress={toggleCameraFacing}>
            <CameraIcon size={24} color={Colors.text.primary} />
          </Pressable>
        </SafeAreaView>

        {/* Camera controls */}
        <View style={styles.controls}>
          {/* Poses button */}
          <PrimaryButton
            title={`Poses (${availablePoses.length})`}
            variant="secondary"
            size="small"
            onPress={() => {
              // TODO: Open bottom sheet with available poses
              Alert.alert(
                'Available Poses',
                availablePoses.map(pose => `• ${pose.name}`).join('\n'),
                [
                  ...availablePoses.map(pose => ({
                    text: pose.name,
                    onPress: () => selectPose(pose),
                  })),
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
          />

          {/* Capture button */}
          <Pressable style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner}>
              <Circle size={60} color={Colors.text.primary} weight="thin" />
            </View>
          </Pressable>

          {/* Placeholder for balance */}
          <View style={styles.placeholder} />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  camera: {
    flex: 1,
  },

  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  permissionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  permissionTitle: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },

  permissionText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  poseInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  poseName: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    marginRight: 12,
  },

  clearPoseButton: {
    backgroundColor: Colors.accent.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  clearPoseText: {
    ...Typography.styles.caption,
    color: Colors.background.primary,
    fontWeight: '600',
  },

  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  poseOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },

  poseTemplate: {
    width: '70%',
    height: '70%',
    opacity: 0.3,
  },

  controls: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },

  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholder: {
    width: 80,
    height: 44,
  },
});

export default CameraScreen; 