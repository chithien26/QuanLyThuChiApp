import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, TextInput } from "react-native";

const Tab = createBottomTabNavigator();
function HomeScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
  
  function SettingsScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
const ThuTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Thu ' }} />
      <Tab.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'chi' }} />
    </Tab.Navigator>
  );
};

export default ThuTabs;
