import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Modal } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Colors } from './constants/Colors';
import { FloatingBottomNavBar } from './components';
import { useAppStore, useActiveTab, useUser } from './store/useAppStore';
import {
  House,
  Compass,
  Camera,
  User,
  Gear,
} from 'phosphor-react-native';

// Screens
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import PreviewScreen from './screens/PreviewScreen';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const activeTab = useActiveTab();
  const user = useUser();
  const { setActiveTab, setUser } = useAppStore();
  
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    // Initialize mock user for development
    setUser({
      id: 'mock_user_1',
      email: 'demo@postify.com',
      name: 'Demo User',
      isPremium: false, // Set to true to test premium features
      favoritePoseIds: [],
      createdAt: new Date(),
    });
  }, []);

  const handleTabPress = (tabKey: string) => {
    if (tabKey === 'Camera') {
      setShowCameraModal(true);
    } else {
      setActiveTab(tabKey);
    }
  };

  const handlePhotoTaken = (photoUri: string) => {
    setCapturedPhotoUri(photoUri);
    setShowCameraModal(false);
    setShowPreviewModal(true);
  };

  const handleCloseCamera = () => {
    setShowCameraModal(false);
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setCapturedPhotoUri(null);
  };

  const tabs = [
    {
      key: 'Home',
      title: 'Home',
      icon: (
        <House
          size={24}
          color={activeTab === 'Home' ? Colors.background.primary : Colors.text.secondary}
          weight={activeTab === 'Home' ? 'fill' : 'regular'}
        />
      ),
      onPress: () => handleTabPress('Home'),
    },
    {
      key: 'Explore',
      title: 'Explore',
      icon: (
        <Compass
          size={24}
          color={activeTab === 'Explore' ? Colors.background.primary : Colors.text.secondary}
          weight={activeTab === 'Explore' ? 'fill' : 'regular'}
        />
      ),
      onPress: () => handleTabPress('Explore'),
    },
    {
      key: 'Camera',
      title: 'Camera',
      icon: (
        <Camera
          size={24}
          color={activeTab === 'Camera' ? Colors.background.primary : Colors.text.secondary}
          weight={activeTab === 'Camera' ? 'fill' : 'regular'}
        />
      ),
      onPress: () => handleTabPress('Camera'),
    },
    {
      key: 'Profile',
      title: 'Profile',
      icon: (
        <User
          size={24}
          color={activeTab === 'Profile' ? Colors.background.primary : Colors.text.secondary}
          weight={activeTab === 'Profile' ? 'fill' : 'regular'}
        />
      ),
      onPress: () => handleTabPress('Profile'),
    },
    {
      key: 'Settings',
      title: 'Settings',
      icon: (
        <Gear
          size={24}
          color={activeTab === 'Settings' ? Colors.background.primary : Colors.text.secondary}
          weight={activeTab === 'Settings' ? 'fill' : 'regular'}
        />
      ),
      onPress: () => handleTabPress('Settings'),
    },
  ];

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Explore':
        return (
          <View style={styles.placeholderScreen}>
            {/* TODO: Implement Explore screen */}
          </View>
        );
      case 'Profile':
        return (
          <View style={styles.placeholderScreen}>
            {/* TODO: Implement Profile screen */}
          </View>
        );
      case 'Settings':
        return (
          <View style={styles.placeholderScreen}>
            {/* TODO: Implement Settings screen */}
          </View>
        );
      default:
        return <HomeScreen />;
    }
  };

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={Colors.background.primary} />
      
      {/* Main Content */}
      {renderActiveScreen()}
      
      {/* Floating Navigation Bar */}
      <FloatingBottomNavBar tabs={tabs} activeTab={activeTab} />
      
      {/* Camera Modal */}
      <Modal
        visible={showCameraModal}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CameraScreen
          onClose={handleCloseCamera}
          onPhotoTaken={handlePhotoTaken}
        />
      </Modal>
      
      {/* Preview Modal */}
      <Modal
        visible={showPreviewModal}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {capturedPhotoUri && (
          <PreviewScreen
            photoUri={capturedPhotoUri}
            onClose={handleClosePreview}
            onBack={() => {
              setShowPreviewModal(false);
              setShowCameraModal(true);
            }}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  
  placeholderScreen: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
