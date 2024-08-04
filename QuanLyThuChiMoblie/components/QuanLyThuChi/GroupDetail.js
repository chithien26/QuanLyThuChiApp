import React, { useContext, useState, useEffect , useCallback} from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator,Alert } from "react-native";
import { useRoute } from '@react-navigation/native';
import { MyDispatchContext, MyUserContext, TransactionContext} from "../../configs/Contexts";
import GroupDetailStyle from '../../styles/GroupDetailStyle';
import { Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { isCloseToBottom, formatAmount, formatDate } from "../Utils/Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApi, endpoints } from '../../configs/APIs';
import Style from '../User/Style';
import Styles from './Styles';
import Dialog from "react-native-dialog";
import { useFocusEffect } from '@react-navigation/native';


const GroupDetail = () => {
    const user = useContext(MyUserContext);
    const route = useRoute();
    const [transactions,setTransactions] = useState([]);
    const { group } = route.params;
    const navigation = useNavigation();
    const onPressThemThuChi = (group) => {
        navigation.navigate('AddThuChiGroup', { group });
    };
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(true);
    const [show1, setShow1] = useState(false);
    const [userMap, setUserMap] = useState({});
    const [users,setUsers] = useState([]);
    const [showUser, setShowUser] = useState(false);
    const [showDialog, setShowDialog] = useState(false); 
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedTransaction1, setSelectedTransaction1] = useState(null);
    const onPressShowDaDuyet = () => {
        setShow(true);
       
    };
    const updateTransaction = async () => {
        try {
            setShowDialog(false);
            setLoading(true);          
            let token = await AsyncStorage.getItem('token');
            const updatedTransaction = {
                name: selectedTransaction1.name,
                amount: selectedTransaction1.amount,
                description: selectedTransaction1.description,
                // Thêm các trường khác nếu cần thiết
            };
            const headers = {
                
                Authorization: `Bearer ${token}`,
               
            };
            
            let res = await authApi(token).put(endpoints['putTransactionGroup'](selectedTransaction1.id), updatedTransaction, { headers });
    
            if (res.status === 200) {
                Alert.alert('Cập nhật thành công');
                const updatedTransactions = transactions.map(transaction =>
                    transaction.id === selectedTransaction1.id ? updatedTransaction : transaction
                );
                setTransactions(updatedTransactions);
            }
            setLoading(false);
           
            // Cập nhật lại filterTransaction nếu cần
        } catch (error) {
            console.error('Error updating transaction:', error);
            setLoading(false);
            // Xử lý lỗi khi cập nhật không thành công
            // Ví dụ: Hiển thị thông báo lỗi
        }
    };
    const handleChangeAmount = (text) => {
        // Xóa bỏ các ký tự không phải số từ chuỗi nhập vào
        const cleanedValue = text.replace(/[^0-9]/g, '');
        // Chuyển chuỗi đã làm sạch thành số nguyên
        const amount = parseInt(cleanedValue, 10);
        // Cập nhật state
        setSelectedTransaction1({ ...selectedTransaction1, amount });
    };
    const ChinhSuaThuChi = (transaction) => {
        setSelectedTransaction1(transaction);
      setShowDialog(true); 
    }
    
    useFocusEffect(
        useCallback(() => {
           loadGroup();        
        
       
        }, [])
    ); 
    const onPresShowListUser =()=>{
        setShowUser(!showUser); 
        loadGroup();
        loadUserGroup();      
    }
    const onPressShowChuaDuyet = () => {
        setShow(false);
    };
    const Refesh=()=>{
       console.log(group);
        loadGroup(); 
    };
    useEffect(() => {
        loadGroup(); // Gọi loadSelf khi thành phần Profile được render
        loadUserGroup();
        loadUsersInfo(users);
    }, []);
    const filteredTransactions = transactions.filter(transaction => transaction.accept === show);
    const loadGroup = async () => {
        let url = `${endpoints['transactionGroup'](group.id)}`;
        
        try {   
          setLoading(true);
            let token = await AsyncStorage.getItem('token');
            let res = await authApi(token).get(url);
            if (res.status === 200) {
                
                setTransactions(res.data);
                res.data.forEach(transaction => {
                    if (transaction.user !== user.id && !userMap[transaction.user]) {
                        loadUser(transaction.user);
                        
                    }
                });
            }
              } catch (ex) {
                  console.error(ex);
              } finally {
                  setLoading(false);
              }         
      };
      const loadUserGroup = async () => {
        let url = `${endpoints['groupMember'](group.id)}`;
        console.log(url);
        try {
            setLoading(true);
            let token = await AsyncStorage.getItem('token');
            let res = await authApi(token).get(url);
            if (res.status === 200) {
                                      
                setUsers(res.data);
                console.log(users);
                loadUsersInfo(users);
            }
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };
    
    const AcceptTransaction = async (id) => {
        console.log(id)
        
        try {
            
            setLoading(true);
            let token = await AsyncStorage.getItem('token');
            const updatedTransaction = {
                accept :"true"
            };
            const headers = {
                Authorization: `Bearer ${token}`,
               
            };
            
            let res = await authApi(token).put(endpoints['accept'](id), updatedTransaction, { headers });
    
            if (res.status === 200) {
                Alert.alert('Cập nhật thành công');
                
            }
            setLoading(false);
           
            // Cập nhật lại filterTransaction nếu cần
        } catch (error) {
            console.error('Error updating transaction:', error);
            setLoading(false);
            // Xử lý lỗi khi cập nhật không thành công
            // Ví dụ: Hiển thị thông báo lỗi
        }
    };
    const deleteTransaction = async (id) => {
        try {
            
            setLoading(true);
            let token = await AsyncStorage.getItem('token');
            console.log(id);
            console.log(token);
            let res = await authApi(token).delete(endpoints['deleteTransactionGroup'](id));
    
            if (res.status === 204) {
                Alert.alert('Xóa thành công');             
            }
            setLoading(false);
           
            // Cập nhật lại filterTransaction nếu cần
        } catch (error) {
            console.error('Error delete transaction:', error);
            setLoading(false);
            // Xử lý lỗi khi cập nhật không thành công
            // Ví dụ: Hiển thị thông báo lỗi
        }
    };
      const loadUser = async (userId) => {
        
        let url = `${endpoints['userDetail'](userId)}`; // Endpoint để lấy thông tin người dùng
        try {
           
            let token = await AsyncStorage.getItem('token');
            let res = await authApi(token).get(url);                  
            if (res.status === 200) {
                setUserMap(prevUserMap => ({ ...prevUserMap, [userId]: res.data }));
              
                
            }
        } catch (ex) {
            console.error(ex);
        }
    };
    const loadUsersInfo = async (userIds) => {
        try {
            for (const userId of userIds) {
                await loadUser(userId.user);
            }
            console.log('Thông tin của tất cả người dùng đã được tải thành công.');
        } catch (error) {
            console.error('Đã xảy ra lỗi khi tải thông tin người dùng:', error);
        }
    };
    
    
    return (
        <View style={GroupDetailStyle.container}>
            <View style={GroupDetailStyle.row}>
                <Button  icon={() => <IconButton icon='arrow-left' color='#000' size={30} />}
                 mode='contained'
                 onPress={() => navigation.goBack()}
                 style={GroupDetailStyle.button}>
                </Button>
                <Text style={GroupDetailStyle.groupName}> {group.name}</Text>
            </View>
            <View style={[GroupDetailStyle.buttonView, GroupDetailStyle.row]}>
                <Button style={GroupDetailStyle.buttonType} onPress={() => onPressThemThuChi(group)}>Thêm thu chi</Button>
                <Button style={GroupDetailStyle.buttonType} onPress={() => onPressThemThuChi(group)}>Lịch họp</Button>
            </View>  
            <View style={[GroupDetailStyle.buttonView, GroupDetailStyle.row]}>
                <Button  style={GroupDetailStyle.buttonType} 
                    onPress={onPressShowDaDuyet}
                    mode={show ? 'contained' : 'outlined'}>Đã duyệt</Button>
                <Button  style={GroupDetailStyle.buttonType} 
                    onPress={onPressShowChuaDuyet}
                    mode={show ? 'outlined' : 'contained'}>Chưa duyệt</Button>
            </View>
            <View style={[GroupDetailStyle.buttonView, GroupDetailStyle.row]}>
                <Button  style={GroupDetailStyle.buttonType} 
                    onPress={onPresShowListUser}
                    >Thành viên</Button>
                    <Button  style={GroupDetailStyle.buttonType} 
                    onPress={onPresShowListUser}
                    >Kết thúc</Button>
            </View>
            {showUser && (
                    Object.values(userMap).map(user => (
                        <View key={user.id} style={Styles.userItem}>
                            <Image style={Styles.avatar} source={{ uri: `https://res.cloudinary.com/chithien26/${user.avatar}` }}/>
                            <View style={Styles.Column}>
                                <Text style={Styles.boldText}>{user.last_name} {user.first_name}</Text>
                                <Text>{user.username}</Text>
                            </View>
                        </View>

                    ))
                )}     
            <View>

            <ScrollView style={Style.contentContainer}  >
                        <RefreshControl onRefresh={() => Refesh()} />
                        {loading && <ActivityIndicator/>}
                        <View >
                        {filteredTransactions !== null &&
                            filteredTransactions.slice().sort((a, b) => b.id - a.id).map((transaction) => (
                                  
                                    <View key={transaction.id} style={Style.transactionRow}>
                                        <TouchableOpacity style={Style.transactionContainer} onPress={()=>{ChinhSuaThuChi(transaction);} }>
                                            <View style={Style.transactionContent}>
                                                {/* Tên giao dịch */}
                                                <Text style={Style.transactionName}>{transaction.name}</Text>

                                                {/* Số tiền */}
                                                <View style={Style.detailContainer}>
                                                    <Text style={Style.detailLabel}>Số tiền:</Text>
                                                    <Text style={Style.detailText}>{formatAmount(transaction.amount)} đ</Text>
                                                </View>

                                                {/* Mô tả */}
                                                <View style={Style.detailContainer}>
                                                    <Text style={Style.detailLabel}>Mô tả:</Text>
                                                    <Text style={Style.detailText}>{transaction.description}</Text>
                                                </View>
                                                <View style={Style.detailContainer}>
                                                    <Text style={Style.detailLabel}>Bởi:</Text>
                                                    <Text style={Style.detailText}>
                                                        {transaction.user === user.id 
                                                            ? 'tôi' 
                                                            : (userMap[transaction.user]?.username || 'Loading...')}

                                                    </Text>
                                                </View>
                                                
                                                
                                            </View>
                                            
                                            {/* Thời gian */}
                                            <Text style={Style.timestamp}>{formatDate(transaction.timestamp)}</Text>
                                        </TouchableOpacity>
                                        {!show&&users.map((user1) => (
                                        user1.user === user.id && user1.is_leader===true ? (
                                            <View key={user1.id} style={[Style.detailContainer, GroupDetailStyle.btNgang]}>
                                                <Button style={GroupDetailStyle.bgButton}
                                                onPress={() => {                                                  
                                                    AcceptTransaction(transaction.id);
                                                }}
                                                >Duyệt</Button>
                                                <Button style={GroupDetailStyle.bgButton1}
                                                onPress={() => {                                                  
                                                    deleteTransaction(transaction.id);
                                                }}
                                                >Xóa</Button>
                                            </View>
                                        ) : null
                                             
                                         ))}
                                        <View>
                                            {group.create_by !== user.id && transaction.accept==false &&(
                                                <Button style={GroupDetailStyle.bgButton1}
                                                onPress={() => {                                                  
                                                    deleteTransaction(transaction.id);
                                                }}
                                                >Xóa</Button>
                                            )
                                            
                                            }
                                        </View>
                                        {
                                            user.id === group.create_by && transaction.accept!==false &&(
                                                <View>
                                                <Button style={GroupDetailStyle.bgButton1}
                                                onPress={() => {                                                  
                                                    deleteTransaction(transaction.id);
                                                }}>
                                                    Xóa 
                                                </Button>
                                            </View>
                                            )
                                        }
                                       
                                        <Dialog.Container visible={showDialog && user.id === group.create_by}>
                                        {selectedTransaction1 &&  (
                                                    <>
                                                      <Dialog.Title> Cập nhật thông tin</Dialog.Title>
                                                        <Dialog.Input
                                                            label="Tên giao dịch"
                                                            placeholder={selectedTransaction1.name}
                                                            value={selectedTransaction1.name}
                                                            onChangeText={(text) => setSelectedTransaction1({ ...selectedTransaction1, name: text })}
                                                        />
                                                        <Dialog.Input
                                                            label="Số tiền"
                                                             keyboardType="numeric"
                                                            placeholder={(selectedTransaction1.amount)}
                                                            value={`${selectedTransaction1.amount}`}
                                                            onChangeText={(handleChangeAmount)}
                                                        />
                                                        <Dialog.Input
                                                            label="Mô tả"
                                                            placeholder={selectedTransaction1.description}
                                                            value={selectedTransaction1.description}
                                                            onChangeText={(text) => setSelectedTransaction1({ ...selectedTransaction1, description: text })}
                                                        />
                                                    </>
                                                )}
                                                <Dialog.Button label="Hủy" onPress={() => setShowDialog(false)} />
                                                <Dialog.Button label="Cập nhật" onPress={() => {
                                                    updateTransaction();
                                                    setShowDialog(false);
                                                }} />
                                            </Dialog.Container>     
                                    </View>
                                ))}
                        </View>
                                   
                    </ScrollView>
                    
                </View> 
                       
        </View>
    );
};

export default GroupDetail;
