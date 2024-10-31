import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';

export default function SettingsScreen() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text style={styles.header}>Settings</Text>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(158, 134, 255, 0.1)' }]}>
                <Ionicons name="person-outline" size={20} color="#9E86FF" />
              </View>
              <Text style={styles.settingText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Ionicons name="notifications-outline" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch 
              value={true}
              trackColor={{ false: '#2C2B3E', true: 'rgba(158, 134, 255, 0.3)' }}
              thumbColor={true ? '#9E86FF' : '#666'}
            />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 183, 77, 0.1)' }]}>
                <Ionicons name="color-palette-outline" size={20} color="#FFB74D" />
              </View>
              <Text style={styles.settingText}>Appearance</Text>
            </View>
            <Text style={styles.settingValue}>Dark</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 138, 101, 0.1)' }]}>
                <Ionicons name="language-outline" size={20} color="#FF8A65" />
              </View>
              <Text style={styles.settingText}>Language</Text>
            </View>
            <Text style={styles.settingValue}>English</Text>
          </TouchableOpacity>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(128, 128, 128, 0.1)' }]}>
                <Ionicons name="information-circle-outline" size={20} color="#808080" />
              </View>
              <Text style={styles.settingText}>Version</Text>
            </View>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(158, 134, 255, 0.1)' }]}>
                <Ionicons name="document-text-outline" size={20} color="#9E86FF" />
              </View>
              <Text style={styles.settingText}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(158, 134, 255, 0.1)' }]}>
                <Ionicons name="shield-outline" size={20} color="#9E86FF" />
              </View>
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleLogout}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(244, 67, 54, 0.1)' }]}>
                <Ionicons name="log-out-outline" size={20} color="#F44336" />
              </View>
              <Text style={[styles.settingText, styles.dangerText]}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(20,20,24)',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2C2B3E',
    marginHorizontal: 20,
    marginBottom: 1,
    borderRadius: 12,
    marginVertical: 4,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  settingValue: {
    color: '#666',
    fontSize: 16,
  },
  dangerItem: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  dangerText: {
    color: '#F44336',
  },
}); 