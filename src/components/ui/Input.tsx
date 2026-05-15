import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    height: 56,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
});
