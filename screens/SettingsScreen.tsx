import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Switch } from 'react-native';

const SettingsScreen = ({ navigation }: { navigation: any }) => {
  const [isExampleSettingEnabled, setIsExampleSettingEnabled] = useState(false);

  const handleLogout = () => {
    // For logout, just navigate back to Login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  const openWebpage = () => {
    Linking.openURL('https://zionportal.co.za');
  };

  const cancelation = () => {
    Linking.openURL('https://zionportal.co.za/delete-account');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Messages Setting</Text>
        <Switch
          value={isExampleSettingEnabled}
          onValueChange={setIsExampleSettingEnabled}
        />
      </View>

      <TouchableOpacity style={styles.linkButton} onPress={openWebpage}>
        <Text style={styles.linkText}>Visit Zion Portal Website</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={cancelation}>
        <Text style={styles.linkText}>Request profile deletion</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F0F0',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  settingText: {
    fontSize: 18,
    color: '#555',
  },
  linkButton: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: 'rgb(1, 235, 252)',
    borderRadius: 10,
    alignItems: 'center',
  },
  linkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 40,
    padding: 15,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
