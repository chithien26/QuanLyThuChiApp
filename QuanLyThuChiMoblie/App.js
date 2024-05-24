
import React from 'react';
import Login from './components/User/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Register from './components/User/Register';
import ThuTabs from './components/QuanLyThuChi/Thu';

const Stack =createStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator>
       <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }} // Ẩn tiêu đề của màn hình Login
       />
       <Stack.Screen
                name="Register"
                component={Register}
                
       />
       <Stack.Screen
                name="Thu"
                component={ThuTabs}
                options={{ headerShown: false }} // Ẩn tiêu đề của màn hình Thu
       />
    </Stack.Navigator>

  )
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
    
  );
}


