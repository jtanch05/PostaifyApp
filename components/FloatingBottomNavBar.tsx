import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  SafeAreaView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface TabItem {
  key: string;
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

interface FloatingBottomNavBarProps {
  tabs: TabItem[];
  activeTab: string;
}

const FloatingBottomNavBar: React.FC<FloatingBottomNavBarProps> = ({
  tabs,
  activeTab,
}) => {
  return (
    <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
      <View style={styles.container} pointerEvents="box-none">
        <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
          <View style={styles.tabContainer}>
            {tabs.map((tab) => (
              <Pressable
                key={tab.key}
                style={({ pressed }) => [
                  styles.tab,
                  activeTab === tab.key && styles.activeTab,
                  pressed && styles.pressedTab,
                ]}
                onPress={tab.onPress}
              >
                <View style={styles.iconContainer}>
                  {tab.icon}
                </View>
                <Text
                  style={[
                    styles.tabTitle,
                    activeTab === tab.key && styles.activeTabTitle,
                  ]}
                >
                  {tab.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </BlurView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  
  blurContainer: {
    borderRadius: 24, // Pill-shaped
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 30, 30, 0.8)', // Fallback color
  },
  
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    minHeight: 60,
  },
  
  activeTab: {
    backgroundColor: Colors.accent.primary,
  },
  
  pressedTab: {
    opacity: 0.7,
  },
  
  iconContainer: {
    marginBottom: 4,
  },
  
  tabTitle: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  
  activeTabTitle: {
    color: Colors.background.primary,
    fontWeight: '600',
  },
});

export default FloatingBottomNavBar; 