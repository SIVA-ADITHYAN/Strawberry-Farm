import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import ProcessScreen from './screens/ProcessScreen';
import BerrySweetRootsScreen from './screens/BerrySweetRootsScreen';

export type RootStackParamList = {
  Home: undefined;
  Process: undefined;
  BerrySweetRoots: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: '#ffffff' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Process" component={ProcessScreen} />
          <Stack.Screen name="BerrySweetRoots" component={BerrySweetRootsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
