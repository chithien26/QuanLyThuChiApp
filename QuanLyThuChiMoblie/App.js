
import React, { Profiler, useContext, useReducer, useState } from 'react';
import Login from './components/User/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-paper';
import Register from './components/User/Register';
import { MyDispatchContext, MyUserContext} from './configs/Contexts';
import { MyUserReducer } from './configs/Reducer';
import Profile from './components/User/Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CaNhan from './components/QuanLyThuChi/CaNhan';
import Nhom from './components/QuanLyThuChi/Nhom';
import GroupDetail from './components/QuanLyThuChi/GroupDetail';
import CaNhanDetail from './components/QuanLyThuChi/CaNhanDetail';
import AddThuChiGroup from './components/QuanLyThuChi/AddThuChiGroup';



const Stack =createStackNavigator();
const Tab = createBottomTabNavigator();

const MyTab =() =>{
  return (
    <Tab.Navigator>
        <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false, title: "Thông tin", tabBarIcon: () => <Icon size={30} source="account"/> }}
      />
      <Tab.Screen
        name="CaNhan"
        component={CaNhan}
        options={{ headerShown: false, title: "Cá nhân", tabBarIcon: () => <Icon size={30} source="clipboard-edit-outline"/> }}
      />
       <Tab.Screen
        name="Nhom"
        component={Nhom}
        options={{ headerShown: false, title: "Nhóm", tabBarIcon: () => <Icon size={30} source="account-group"/> }}
      />
        
    </Tab.Navigator>
  )
}

const MyStack = () => {
  const user = useContext(MyUserContext); 
  return (
    <Stack.Navigator>
      {user ? (
        <><Stack.Screen
          name="MyTab"
          component={MyTab}
          options={{ headerShown: false }} />
          <Stack.Screen
            name="GroupDetail"
            component={GroupDetail}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="CaNhanDetail"
            component={CaNhanDetail}
            options={{ headerShown: false }} />
            <Stack.Screen
            name="AddThuChiGroup"
            component={AddThuChiGroup}
            options={{ headerShown: false }} />
        </>
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


