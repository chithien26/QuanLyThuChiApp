
import React, { Profiler, useContext, useReducer, useState } from 'react';
import Login from './components/User/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Register from './components/User/Register';
import { MyDispatchContext, MyUserContext} from './configs/Contexts';
import { MyUserReducer } from './configs/Reducer';
import Profile from './components/User/Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CaNhan from './components/QuanLyThuChi/CaNhan';
import Nhom from './components/QuanLyThuChi/Nhom';


const Stack =createStackNavigator();
const Tab = createBottomTabNavigator();

const MyTab =() =>{
  return (
    <Tab.Navigator>
        <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="CaNhan"
        component={CaNhan}
        options={{ headerShown: false }}
      />
       <Tab.Screen
        name="Nhom"
        component={Nhom}
        options={{ headerShown: false }}
      />   
    </Tab.Navigator>
  )
}

const MyStack = () => {
  const user = useContext(MyUserContext); 
  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen
          name="MyTab"
          component={MyTab}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }} // Ẩn tiêu đề của màn hình Login
          />
          <Stack.Screen
            name="Register"
            component={Register}
          />
        </>
      )}
    </Stack.Navigator>
  );

}

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  
  return (
    <NavigationContainer>
    <MyUserContext.Provider value={user}>
      
          <MyDispatchContext.Provider value={dispatch}>
               <MyStack />
         </MyDispatchContext.Provider>
      
    </MyUserContext.Provider>
</NavigationContainer>
    
  );
}


