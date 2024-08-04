import React,{ useContext, useState, useEffect , useCallback} from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { Button, Icon } from "react-native-paper";
import { MyDispatchContext, MyUserContext, TransactionContext} from "../../configs/Contexts";
import MyStyles from "../../styles/MyStyles";
import { useNavigation ,useRoute} from '@react-navigation/native';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import Style from "./Style";
import { Avatar } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { isCloseToBottom, formatAmount, formatDate } from "../Utils/Utils";
import { useFocusEffect } from '@react-navigation/native';

const Profile = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [transactions,setTransactions] = useState([]);
    const [page, setPage]= useState(1);
    const onPressXemThem = (transactions) => {
        navigation.navigate('CaNhanDetail', { transactions });
    };
    const avatarUrl = user && user.avatar
    ? `https://res.cloudinary.com/chithien26/${user.avatar}`
    : null;
    const Refesh=()=>{
        setPage(1);
        loadSelf(); 
    }
    useFocusEffect(
        useCallback(() => {
           loadSelf();
        }, [])
    );
    const loadMore = ({nativeEvent}) => {
        if (loading===false && isCloseToBottom(nativeEvent) && page !==0) {
            setPage(page + 1);
            console.log(page)
        }
      }
    
    const Logout = () => {
        dispatch({ type: "logout" });
        navigation.navigate('Login');
    };
    useEffect(() => {
        loadSelf(); // Gọi loadSelf khi thành phần Profile được render
    }, [page]);
    const loadSelf = async () => {
      if(page>0){
      let url = `${endpoints['transactionSelf']}?page=${page}`
      console.log(url)
      try {   
        setLoading(true);
          let token = await AsyncStorage.getItem('token');
          let res = await authApi(token).get(url);
          if (page === 1)
                    setTransactions(res.data.results);
                else if (page > 1)
                    setTransactions(current => {
                        return [...current, ...res.data.results]                        
                    });
                    
                if (res.data.next === null)
                    setPage(0);
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    };
    return (
        
        <View style={[MyStyles.container, MyStyles.margin]}>
            
            {user ? (
                <View style={Style.margin}>
                    <View style={Style.userInfoContainer}>
                        <View style={Style.ColumnPicture} >
                            <Avatar.Image
                                source={{ uri: avatarUrl }}
                                resizeMode="cover"
                                style={Style.avatar}
                                size={150}
                                />
                                
                                <Button icon="camera-plus"> Cập nhật ảnh đại diện</Button>
                        </View>
                         
                        <View style={Style.Column}>
                            <Text style={Style.userName}>{user.last_name} {user.first_name} </Text>
                            <Text style={Style.userName}>{user.email}  </Text>
                            <Button icon="lead-pencil" onPress={Logout}>Cập nhật thông tin</Button>
                            <Button icon="logout" onPress={Logout}>Đăng xuất</Button>
                        </View>
                        
                    </View>
                    <View style={Style.detailContainer}>
                        <Text style={Style.userName}>Hoạt động gần đây </Text>
                        
                        <TouchableOpacity 
                         onPress={() => onPressXemThem(transactions)}>
                           <Text style={Style.userName}>              Xem thêm</Text>
                        </TouchableOpacity>
                        
                    </View>
                    
                    <ScrollView  onScroll={loadMore}>
                        <RefreshControl onRefresh={() => Refesh()} />
                        {loading && <ActivityIndicator/>}
                        <View >
                        { transactions !==null &&
                         transactions.slice().sort((a, b) => b.id - a.id).map((transaction) => (

                                    <View key={transaction.id} style={Style.transactionRow}>
                                        <TouchableOpacity style={Style.transactionContainer} >
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
                                            </View>
                                            
                                            {/* Thời gian */}
                                            <Text style={Style.timestamp}>{formatDate(transaction.timestamp)}</Text>
                                        </TouchableOpacity>
                                            
                                        
                                    </View>
                                ))}
                        </View>
                        {loading && page > 1 && <ActivityIndicator/>}            
                    </ScrollView>
                   
                   
                </View>
                
            ) : (
                <Text style={MyStyles.subject}>Loading...</Text>
            )}
        </View>        
    );
}
export default Profile;
