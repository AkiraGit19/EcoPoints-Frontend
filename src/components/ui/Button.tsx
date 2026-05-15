import React from 'react';
import { StyleSheet, Text, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { MotiPressable } from 'moti/interactions';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
}) => {
  const isOutline = variant === 'outline';

  return (
    <MotiPressable
      onPress={onPress}
      disabled={disabled || isLoading}
      animate={({ pressed }) => {
        'worklet';
        return {
          scale: pressed ? 0.95 : 1,
          opacity: disabled ? 0.5 : 1,
        };
      }}
      style={[
        styles.container,
        {
          backgroundColor: isOutline ? 'transparent' : colors[variant],
          borderColor: isOutline ? colors.primary : 'transparent',
          borderWidth: isOutline ? 2 : 0,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={isOutline ? colors.primary : colors.background} />
      ) : (
        <Text
          style={[
            typography.button,
            { color: isOutline ? colors.primary : colors.background },
          ]}
        >
          {title}
        </Text>
      )}
    </MotiPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
