import React,{useState} from 'react';
import { View , ScrollView, TouchableOpacity} from 'react-native';
import { Button,  TextInput , Text, IconButton} from "react-native-paper";
import { useRoute } from '@react-navigation/native';
import Style from '../User/Style';
import { formatAmount, formatDate } from '../Utils/Utils';
import CaNhanDetailStyle from '../../styles/CaNhanDetailStyle';
const CaNhanDetail = () => {
    const route = useRoute();
    const {transactions} = route.params;
    const [filterTransaction, setFilterTransaction]= useState('')
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const Search = (query) => {
        setLoading1(true);
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilterTransaction(transactions);
            setLoading1(false);
        } else {
            const timkiem = transactions.filter(trans => {
                if (trans.name && typeof trans.name === 'string') {
                    return trans.name.toLowerCase().includes(query.toLowerCase());
                }
                return false; 
            });
            setFilterTransaction(timkiem);
        }
    }
    return (
        <View style={CaNhanDetailStyle.searchSection}>
            <View style={CaNhanDetailStyle.type}>
            <Button
                style={[CaNhanDetailStyle.buttonType]}
                mode="contained"
                >
                Tiền chi
            </Button>
            <Button
                style={[CaNhanDetailStyle.buttonType]}
                mode="contained"
                >
                Tiền thu
            </Button>
        </View>
            <View >
                <TextInput
                    placeholder="Tìm kiếm khoản thu / thi "
                    value={searchQuery}
                    onChangeText={Search}
                    style={CaNhanDetailStyle.searchInput}
                    placeholderTextColor="#888888" // Màu chữ của placeholder
                />
            </View>
            {!loading1 && (
             <ScrollView  >                        
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
                     ) } 
                     {loading1 && (
                        <ScrollView  >                        
                                    {loading && <ActivityIndicator/>}
                                    <View >
                                    { filterTransaction !==null &&
                                    filterTransaction.slice().sort((a, b) => b.id - a.id).map((transaction) => (

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
                                ) }             
        </View>
    );
};

export default CaNhanDetail;