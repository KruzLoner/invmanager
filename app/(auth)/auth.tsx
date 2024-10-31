import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { Link } from 'expo-router';
import LoadingOverlay from '../../src/components/LoadingOverlay';

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    try {
      console.log('=== Starting Sign Up Process ===');
      setError('');
      setIsLoading(true);
      
      // Basic validation
      if (!firstName || !lastName || !email || !password || !phone) {
        console.log('Validation failed - missing fields');
        throw new Error('All fields are required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Password validation
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const signUpData = {
        email,
        password,
        firstName,
        lastName,
        phone,
      };

      console.log('Attempting to sign up with data:', {
        ...signUpData,
        password: '***'
      });

      // Call the signUp function from AuthContext
      await signUp(signUpData);
      console.log('Sign up successful');
      
    } catch (error: any) {
      console.log('Sign up error:', error.message);
      setError(error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
      console.log('=== Sign Up Process Complete ===');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Enter your details to get started</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputRow}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              placeholderTextColor="#666"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Doe"
              placeholderTextColor="#666"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.iconInput}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="john.doe@example.com"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.iconInput}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="+1 234 567 890"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.iconInput}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Enter your password"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.signUpButton}
          onPress={handleSignUp}
        >
          <Text style={styles.signUpButtonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {isLoading && <LoadingOverlay />}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(20,20,24)',
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  halfInput: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2C2B3E',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  iconInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2B3E',
    borderRadius: 12,
    padding: 16,
  },
  inputWithIcon: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  signUpButton: {
    backgroundColor: '#9E86FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#9E86FF',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
  },
}); 