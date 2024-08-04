import React, {useState, useContext, useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View,  ActivityIndicator, FlatList, ScrollView, Image, Alert, TouchableOpacity, RefreshControl } from "react-native";
import MyStyles from '../../styles/MyStyles';
import { Button, Text, TextInput, Checkbox, List, IconButton } from "react-native-paper";
import Styles from './Styles';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import { MyUserContext } from '../../configs/Contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from "react-native-dialog"; 
import { isCloseToBottom } from "../Utils/Utils";
import { useNavigation } from '@react-navigation/native';

const Nhom =()=>{
    const navigation = useNavigation();
    const currentuser = useContext(MyUserContext);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [filterusers, setfilterUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false); // State để hiển thị dialog
    const [groupName, setGroupName] = useState('');
    const [group, setGroup]= useState([]);
    const [pageU, setPageU]= useState(1);
    const [pageG, setPageG]= useState(1);
    const [id, setId]=useState("");
    const onPressGroup = (group) => {
      navigation.navigate('GroupDetail', { group});
  };
    const Refesh=()=>{ 
      setPageG(1);     
      hienThiDanhSachNhom(); 
  }
    const loadMoreU = ({nativeEvent}) => {
      if (loading===false && isCloseToBottom(nativeEvent) && pageU !==0) {
          setPageU(pageU + 1);
          console.log(pageU)
      }
    }
    const loadMoreG = ({nativeEvent}) => {
      if (loading===false && isCloseToBottom(nativeEvent) && pageG !==0) {
          setPageG(pageG + 1);
          console.log(pageG)
      }
    }
    const addLeaderToGroup = async (groupId, token,leaderId) => {     
          try {  
            if (!currentuser) {
              console.error('currentuser is null or undefined');
              return;
            }         
            const response = await authApi(token).post(
              endpoints['addUserToGroup'](groupId),
              { user_id: leaderId,
                is_leader: true
               },
              {
                  headers: {
                      'Content-Type': 'application/json',
                  },
              }
            ) 
              if (response.status===201) {
                console.log(`Đã thêm user leader ID vào group:`);
              }                     
          } catch (error) {
              console.error(`Error adding user with ID  to group:`, error);
          }
      }
  
    const addUserToGroup = async (groupId, userIds,token) => {
      for (const userId of userIds) {
          try {     
            const response = await authApi(token).post(
              endpoints['addUserToGroup'](groupId),
              { 
                user_id: userId               
               },
              {
                  headers: {
                      'Content-Type': 'application/json',
                  },
              }
            ) 
              if (response.status===201) {
                console.log(`Đã thêm user ID ${userId} vào group:`);
              }                     
          } catch (error) {
              console.error(`Error adding user with ID ${userId} to group:`, error);
          }
      }
  };
  const hienThiDanhSachNhom = async () => {
    if (!currentuser) {
      console.error('currentuser is null or undefined');
      return;
    } 
    if(pageG>0){      
    try {     
        setLoading(true);
        let url = `${endpoints['groups']}?page=${pageG}`
        let token = await AsyncStorage.getItem('token');
        let response = await authApi(token).get(url);
                                     
        if (pageG === 1)
          setGroup(response.data.results);
        else if (pageG > 1)
          setGroup(current => {
              return [...current, ...response.data.results]
          });
        if (response.data.next === null)
          setPageG(0);         
    } catch (error) {           
        console.error("Lỗi tải group", error);
    }  
    finally {
      setLoading(false);
    }
  }
};
const fetchUsers = async () => {
  if (!currentuser) {
    console.error('currentuser is null or undefined');
    return;
  }
  if(pageU>0){
            setLoading(true);
            try {
                let token = await AsyncStorage.getItem('token');               
                const url = `${endpoints['users']}?page=${pageU}`
                const response = await authApi(token).get(url);
                console.log(response.data);                      
                if (pageU === 1){
                  setUsers(response.data.results);
                  setfilterUsers(response.data.results);
                }
                else if (pageU > 1){
                  setUsers(prevUsers => [...prevUsers, ...response.data.results]);
                  setfilterUsers(prevUsers => [...prevUsers, ...response.data.results]);
                }
                if (response.data.next === null)
                  setPageU(0); 
            } catch (error) {                
                console.error("Lỗi hien thi User", error);
            }  
            setLoading(false);
          }
        };
  useEffect(() => {
    hienThiDanhSachNhom();
    setId(currentuser.id)
  }, [pageG]);
  useEffect(() => {     
        fetchUsers();
        
    }, [pageU]);
    // useEffect(() => {
    //     // Log the users state whenever it changes
    //     console.log("Users state:", users);
    // }, [users]);
    const Search = (query) => {
        setSearchQuery(query);
        const filteredUsers = users.filter(user => {
            if (user.username && typeof user.username === 'string') {
                return user.username.toLowerCase().includes(query.toLowerCase());
            }
            return false; // Nếu user.name không phải là chuỗi, bỏ qua user này
        });
        setfilterUsers(filteredUsers);
        // Add logic to filter the user list based on search query
    }
    
  const CreateGroup = () => {
      // Logic to create a group with selectedUsers
      setShowDialog(true); 
      
  }
  const CreateGroupDialog= async () =>{
    setLoading(true);
    try {
        if (!currentuser) {
          console.error('currentuser is null or undefined');
          return;
        }
        const token = await AsyncStorage.getItem('token');        
        const requestData = {
          name: groupName,         
      };
      console.log(requestData);
        const response = await authApi(token).post(endpoints['createGroup'], requestData,{
            headers: {
                'Content-Type': 'application/json',
              },
        });       
          if (response.status === 201) {
            Alert.alert('Tạo nhóm thành công');
            setShowDialog(false);           
            let gr = response.data;                                                                 
                  addLeaderToGroup(gr.id,token, currentuser.id);
                  addUserToGroup(gr.id,selectedUsers,token);                                                      
          } else {
            Alert.alert('Tạo nhóm thất bại', 'Có lỗi xảy ra, vui lòng thử lại.');
          }  
      } catch (error) {
        console.error('Lỗi khi tạo nhóm:', error);
        Alert.alert('Tạo nhóm thất bại', 'Tên nhóm đã tồn tại')
      } finally {
        setLoading(false);
      }
    
    
    }
    const HienThiSearch =async () =>{
      setShowSearch(prevShowSearch =>!prevShowSearch);
      
    }
    const DanhSachUserSelection = (userId) => {
      setSelectedUsers((prevSelected) => {
          if (prevSelected.includes(userId)) {
              return prevSelected.filter(id => id !== userId);
          } else {
              return [...prevSelected, userId];
          }
      });
  }
    return (
      <View style={Styles.container}>     
        <Button icon="account-group" mode="contained"
                onPress={HienThiSearch}
                style={[Styles.button,MyStyles.subject]}
                contentStyle={Styles.buttonContent}
                labelStyle={Styles.buttonLabel}>
           + Tạo nhóm mới
        </Button>
       
          {showSearch && (
                  <View style={Styles.searchSection}>
                      <TextInput
                          mode="outlined"
                          placeholder="Tìm kiếm user"
                          value={searchQuery}
                          onChangeText={Search}
                          style={Styles.searchInput}
                      />
                       {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                      <ScrollView style={Styles.userList} onScroll={loadMoreU}>
                           <RefreshControl onRefresh={() => filterusers()} />
                           {loading && <ActivityIndicator/>}
                            {/* {users.map(user => <List.Item key={user.id} title={[user.last_name , user.fisrt_name]} description={user.username}
                            left={()=> <Image style={Styles.avatar} source={{uri:user.avatar}}/>} />)} */}
                          {users && users.length > 0 ? (
                             
                              filterusers.map((user) => (
                                user.id !== id && (
                                  <View key={user.id} style={Styles.userItem}>
                                      <Checkbox
                                          status={selectedUsers.includes(user.id) ? 'checked' : 'unchecked'}
                                          onPress={() => DanhSachUserSelection(user.id)}
                                      />
                                    <Image style={Styles.avatar} source={{uri: `https://res.cloudinary.com/chithien26/`+user.avatar}}/>
                                     <View style={Styles.Column}>
                                            <Text  style={Styles.boldText}>{user.last_name} {user.first_name}</Text>
                                            <Text>{user.username}</Text>
                                            
                                        </View>
                                  </View>
                              ))
                            )
                          ) : (
                              <Text>No users available</Text>
                          )}
                          {loading && pageU > 1 && <ActivityIndicator/>}
                      </ScrollView>)}
                      <Button
                          mode="contained"
                          onPress={() => {
                            CreateGroup();
                        }}
                          style={Styles.createGroupButton}>
                          Tạo nhóm
                      </Button>
                  </View>
              )}
              <View style={[Styles.headerContainer, { flexDirection: 'row', alignItems: 'center' }]}>           
              <IconButton  icon="format-list-bulleted" size={20} />
              <Text style={[Styles.boldText, Styles.fontSize]} >Danh sách các nhóm bạn đã tham gia</Text>           
              </View>
         {!showSearch && (                    
                    <ScrollView style={Styles.scrollView} onScroll={loadMoreG}>
                       <RefreshControl onRefresh={() => Refesh()} />
                       {loading && <ActivityIndicator/>}
                        {
                         group.map(group => (
                            <TouchableOpacity
                                key={group.id}
                                style={Styles.groupButton}
                                onPress={() => onPressGroup(group)}
                            >
                                <View style={Styles.groupContainer}>
                                    
                                    <IconButton icon="wechat" size={20} />
                                    <Text style={Styles.groupButtonText}>{group.name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        {loading && pageG > 1 && <ActivityIndicator/>}
                    </ScrollView> 
               
            )}
             
        <Dialog.Container visible={showDialog}>
                <Dialog.Title>Tạo nhóm mới</Dialog.Title>
                <Dialog.Input
                    placeholder="Nhập tên nhóm"
                    value={groupName}
                    onChangeText={setGroupName}
                />
                <Dialog.Button label="Hủy" onPress={() => setShowDialog(false)} />
                <Dialog.Button label="Tạo" onPress={CreateGroupDialog} />
            </Dialog.Container>
      </View>
    );


}
export default Nhom
