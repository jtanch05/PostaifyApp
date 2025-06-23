import React from 'react';
import { Pressable, Text, StyleSheet, PressableProps } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface PrimaryButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  style,
  disabled,
  ...pressableProps
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        styles[size],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      {...pressableProps}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 24, // Pill-shaped
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  
  // Variants
  primary: {
    backgroundColor: Colors.accent.primary,
  },
  
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.accent.primary,
  },
  
  // Sizes
  small: {
    height: 32,
    paddingHorizontal: 16,
  },
  
  medium: {
    height: 48,
    paddingHorizontal: 24,
  },
  
  large: {
    height: 56,
    paddingHorizontal: 32,
  },
  
  // States
  pressed: {
    opacity: 0.8,
  },
  
  disabled: {
    opacity: 0.5,
  },
  
  // Text styles
  text: {
    ...Typography.styles.body,
    fontWeight: '600',
  },
  
  primaryText: {
    color: Colors.background.primary,
  },
  
  secondaryText: {
    color: Colors.accent.primary,
  },
});

export default PrimaryButton; 