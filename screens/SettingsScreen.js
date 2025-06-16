import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';

const SettingsScreen = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}>
      <View style={styles.row}>
        <Text style={[styles.label, theme === 'dark' && { color: '#fff' }]}>Dark Mode</Text>
        <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  label: {
    fontSize: 18,
  },
});

export default SettingsScreen;
