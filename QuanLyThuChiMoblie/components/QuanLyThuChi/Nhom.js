import React, {useState, useContext, useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View,  ActivityIndicator, FlatList, ScrollView, Image, Alert, TouchableOpacity} from "react-native";
import MyStyles from '../../styles/MyStyles';
import { Button, Text, TextInput, Checkbox, List, IconButton } from "react-native-paper";
import Styles from './Styles';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import { MyUserContext } from '../../configs/Contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from "react-native-dialog"; 

const Nhom =()=>{
    
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
                console.log(`Đã thêm user leader ID ${userId} vào group:`);
              }                     
          } catch (error) {
              console.error(`Error adding user with ID ${userId} to group:`, error);
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
    setLoading(true);
    try {
        if (!currentuser) {
          console.error('currentuser is null or undefined');
          return;
        } 
        const token = await AsyncStorage.getItem('token');
        console.log(token) ;
        const response = await authApi(token).get(endpoints['groups']);                       
        console.log(response.data)
        
        if(response.status===200) {
          const groups = response.data;
          const groupsUserIn = [];
        
          for (const group of groups) {
            const groupId = group.id;
            try {
                const memberResponse = await authApi(token).get(endpoints['groupMember'](groupId));
                if (memberResponse.status === 200) {
                    const members = memberResponse.data;
                    
                    // Kiểm tra xem user_id có nằm trong danh sách thành viên hay không
                    const userId = currentuser.id;
                    const isUserInGroup = members.some(member => member.user=== userId);
                    if (isUserInGroup) {
                      console.log(`User ID ${userId} is in group ID ${groupId}`);
                      groupsUserIn.push(group);
                  }
                }
            } catch (error) {
                console.error(`Lỗi khi lấy thành viên của nhóm ${groupId}:`, error);
            }
          }
          setGroup(groupsUserIn)
          
        }          
    } catch (error) {           
        console.error("Lỗi !!!", error);
    }  
    setLoading(false);
};
  useEffect(() => {
    hienThiDanhSachNhom();
  }, []);
  useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('token');
                console.log(token) ;
                const response = await authApi(token).get(endpoints['users']);
                console.log(response.data);          
                setUsers(response.data);
                setfilterUsers(response.data);
            } catch (error) {                
                console.error("Lỗi hien thi User", error);
            }  
            setLoading(false);
        };
        fetchUsers();
    }, []);
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
        console.log(token) ;
        console.log(groupName) ;
        console.log(currentuser.id) ;
        const requestData = {
          name: groupName,
          create_by: currentuser.id
      };
      console.log(requestData);
        const response = await authApi(token).post(endpoints['groups'], requestData,{
            headers: {
                'Content-Type': 'application/json',
              },
        });       
          if (response.status === 201) {
            Alert.alert('Tạo nhóm thành công');
            setShowDialog(false); 
            hienThiDanhSachNhom();                    
                const secondResponse = await authApi(token).get(endpoints['groups']);
                const groupsList = secondResponse.data; // Giả sử phản hồi trả về một object có key 'groups' chứa danh sách nhóm
                console.log('Danh sách nhóm:', groupsList);                            
                let groupId = null;
                for (let i = 0; i < groupsList.length; i++) {
                  if (groupsList[i].name === groupName) {
                    groupId = groupsList[i].id;
                    break;
                  }
                }           
                if (groupId) {
                  console.log(`ID của nhóm "${groupName}":`, groupId);
                  addLeaderToGroup(groupId,token, currentuser.id);
                  addUserToGroup(groupId,selectedUsers,token);
                  
                } else {
                  console.log(`Không tìm thấy nhóm có tên "${groupName}".`);
                }                       
          } else {
            Alert.alert('Tạo nhóm thất bại', 'Có lỗi xảy ra, vui lòng thử lại.');
          }  
      } catch (error) {
        console.error('Lỗi khi tạo nhóm:', error);
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
                      <ScrollView style={Styles.userList}>
                                
                            {/* {users.map(user => <List.Item key={user.id} title={[user.last_name , user.fisrt_name]} description={user.username}
                            left={()=> <Image style={Styles.avatar} source={{uri:user.avatar}}/>} />)} */}
                          {users && users.length > 0 ? (
                             
                              filterusers.map((user) => (
                                user.id !== currentuser.id && (
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
              <IconButton icon="format-list-bulleted" size={20} />
              <Text style={[Styles.boldText, Styles.fontSize]} >Danh sách các nhóm bạn đã tham gia</Text>           
              </View>
         {!showSearch && (                    
                    <ScrollView style={Styles.scrollView}>
                        {group.map(group => (
                            <TouchableOpacity
                                key={group.id}
                                style={Styles.groupButton}
                                onPress={() => onPressGroup(group.id)}
                            >
                                <View style={Styles.groupContainer}>
                                    {/* <Image
                                        source={require('./path_to_your_icon.png')} // Thay đổi path tới icon của bạn
                                        style={Styles.groupIcon}
                                    /> */}
                                    <IconButton icon="wechat" size={20} />
                                    <Text style={Styles.groupButtonText}>{group.name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
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
