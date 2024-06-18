import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { useRoute } from '@react-navigation/native';
import { MyDispatchContext, MyUserContext, TransactionContext} from "../../configs/Contexts";
import GroupDetailStyle from '../../styles/GroupDetailStyle';
import { Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { isCloseToBottom, formatAmount, formatDate } from "../Utils/Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApi, endpoints } from '../../configs/APIs';
import Style from '../User/Style';

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
    
    const Refesh=()=>{
       
        loadGroup(); 
    };
    useEffect(() => {
        loadGroup(); // Gọi loadSelf khi thành phần Profile được render
    }, []);
      const loadGroup = async () => {
        let url = `${endpoints['transactionGroup'](group.id)}`;
        console.log(url)
        try {   
          setLoading(true);
            let token = await AsyncStorage.getItem('token');
            let res = await authApi(token).get(url);
            if (res.status===200)
                      setTransactions(res.data);
              } catch (ex) {
                  console.error(ex);
              } finally {
                  setLoading(false);
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
            <View>

            <ScrollView  >
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
                                   
                    </ScrollView>
                </View> 
                         
        </View>
    );
};

export default GroupDetail;
