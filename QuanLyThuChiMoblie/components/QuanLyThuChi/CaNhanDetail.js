import React,{useState, useEffect, useCallback} from 'react';
import { View, TouchableOpacity, ScrollView, Alert, RefreshControl,ActivityIndicator, ImageBackground, Image} from "react-native";
import { Button,  TextInput , Text, IconButton} from "react-native-paper";
import { useRoute } from '@react-navigation/native';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import Style from '../User/Style';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatAmount, formatDate, isCloseToBottom } from '../Utils/Utils';
import CaNhanDetailStyle from '../../styles/CaNhanDetailStyle';
import Dialog from "react-native-dialog"; 
import { useFocusEffect } from '@react-navigation/native';


const CaNhanDetail = () => {
    const [showDialog, setShowDialog] = useState(false); 
    const [showDialog1, setShowDialog1] = useState(false);
    const [transactionsIncome,setTransactionsIncome] = useState([]); 
    const [transactionsExpense,setTransactionsExpense] = useState([]);
    // const route = useRoute();
    // const {transactions} = route.params;
    const [transactions,setTransactions] = useState([]);
    const [transactions1,setTransactions1] = useState([]);
    const [filterTransaction, setFilterTransaction] = useState(transactions);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [categories, setCategories] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [page, setPage]= useState(1);
    const [transactionType, setTransactionType] = useState('');
    // const onPressXemThem = (transactions) => {
    //     navigation.navigate('CaNhanDetail', { transactions });
    // };
    const Refesh=()=>{
        setPage(1);
        loadSelf(); 
    }
    useFocusEffect(
        useCallback(() => {
           Refesh();
        }, [])
    );
    const handleChangeAmount = (text) => {
        // Xóa bỏ các ký tự không phải số từ chuỗi nhập vào
        const cleanedValue = text.replace(/[^0-9]/g, '');
        // Chuyển chuỗi đã làm sạch thành số nguyên
        const amount = parseInt(cleanedValue, 10);
        // Cập nhật state
        setSelectedTransaction({ ...selectedTransaction, amount });
    };
    useEffect(() => {
        loadAllCategories();
        loadSelf();
    }, [page]);
    useEffect(() => {
        if (transactionType) {
          loadSelfThuChi(transactionType);
          setLoading2(true);
        }       
      }, [transactionType, page]);
    const loadMore = ({nativeEvent}) => {
        if (loading===false && isCloseToBottom(nativeEvent) && page !==0) {
            setPage(page + 1);
            console.log(page);
            loadAllCategories();
        }
      }
    const loadSelf = async () => {
        if(page>0){
        let url = `${endpoints['transactionSelf']}?page=${page}`
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
    const loadSelfThuChi = async (x) => {
        if(page>0){
        let url = `${endpoints['transactionSelf']}?type=${x}`;
        console.log(url)
        try {   
          setLoading(true);
            let token = await AsyncStorage.getItem('token');
            let res = await authApi(token).get(url);
            console.log(res.data.results)
            if (x === 'income') {
                setTransactionsIncome(res.data.results);
                console.log(transactionsIncome);
            } else {
                    setTransactionsExpense(res.data.results);
                    console.log(transactionsExpense);
                }
            if (page === 1)
                      setTransactions1(res.data.results);
                  else if (page > 1)
                    setTransactions1(current => {
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
    // const loadMore = ({nativeEvent}) => {
    //     if (loading===false && isCloseToBottom(nativeEvent) ) {
    //         try {
    //             setLoading(true);
    //             // Lấy dữ liệu từ API hoặc thực hiện hành động cần thiết
    //             // Ví dụ, lấy thêm các giao dịch mới và thêm vào filterTransaction
    //             const newTransactions =  loadAllCategories(); // Hàm lấy dữ liệu từ API
    //             if (newTransactions.length > 0) {
    //                 const updatedTransactions = [...filterTransaction, ...newTransactions];
    //                 setFilterTransaction(updatedTransactions);
    //             }
    //         } catch (error) {
    //             console.error('Error loading more data:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    
    //     }
    //   };
    const updateTransaction = async () => {
        try {
            setShowDialog(false);
            setLoading(true);
            
            let token = await AsyncStorage.getItem('token');
            const updatedTransaction = {
                name: selectedTransaction.name,
                amount: selectedTransaction.amount,
                description: selectedTransaction.description,
                // Thêm các trường khác nếu cần thiết
            };
            const headers = {
                
                Authorization: `Bearer ${token}`,
               
            };
            
            let res = await authApi(token).put(endpoints['putTransaction'](selectedTransaction.id), updatedTransaction, { headers });
    
            if (res.status === 200) {
                Alert.alert('Cập nhật thành công');
                const updatedTransactions = transactions.map(transaction =>
                    transaction.id === selectedTransaction.id ? updatedTransaction : transaction
                );
                setFilterTransaction(updatedTransactions);
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
    const loadAllCategories = async () => {
        let currentPage = 1;
        let allCategories = [];
        let hasMore = true;  
        while (hasMore) {
            let url = `${endpoints['category']}?page=${currentPage}`;
            try {
                setLoading(true);
                let token = await AsyncStorage.getItem('token');
                let res = await authApi(token).get(url);
                allCategories = [...allCategories, ...res.data.results];
                if (res.data.next !== null) {
                    currentPage += 1;
                } else {
                    hasMore = false;
                }
            } catch (ex) {
                console.error(ex);
                hasMore = false;  // Stop loop if there's an error
            } finally {
                setLoading(false);
            }
        }
        setCategories(allCategories);
    };

    const ChinhSuaThuChi = (transaction) => {
        setSelectedTransaction(transaction);
      setShowDialog(true); 
      
  }
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
    };
    const deleteTransaction = async () => {
        try {
            setShowDialog(false); // Close custom dialog
            setLoading(true);
            let token = await AsyncStorage.getItem('token');
            let res = await authApi(token).delete(endpoints['deleteTransaction'](selectedTransaction.id));

            if (res.status === 204) {
                Alert.alert('Xóa thành công');
                Refesh();
                // Update filtered transactions after deletion
                const updatedTransactions = filterTransaction.filter((transaction) => transaction.id !== selectedTransaction.id);
                setFilterTransaction(updatedTransactions);
            } else {
                Alert.alert('Xóa không thành công');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error deleting transaction:', error);
            setLoading(false);
            // Handle error deleting transaction
        }
    };
    const cancelDelete = () => {
        setShowDialog1(false); // Close custom dialog
        setSelectedTransaction(null); // Clear selected transaction
    };
    return (
        <View style={CaNhanDetailStyle.searchSection}>
            <View style={CaNhanDetailStyle.type}>
            <Button
                style={[CaNhanDetailStyle.buttonType]}
                mode="contained"
                onPress={() => {
                    setPage(1); // Reset page to 1
                    loadSelfThuChi('expense');
                    setTransactionType('expense')
                }}
                >
                Tiền chi
            </Button>
            <Button
                style={[CaNhanDetailStyle.buttonType]}
                mode="contained"
                onPress={() => {
                    setPage(1); // Reset page to 1
                    loadSelfThuChi('income');
                    setTransactionType('income')
                }}
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
            {!loading1 && !loading2 && (
             <ScrollView  onScroll={loadMore}> 
                 <RefreshControl onRefresh={() => Refesh()} />                       
                        {loading && <ActivityIndicator/>}
                        <View >
                        {transactions !== null && transactions.slice().sort((a, b) => b.id - a.id).map((transaction) => (

                                    <View key={transaction.id} style={Style.transactionRow}>
                                        <TouchableOpacity style={Style.transactionContainer} onPress={()=>{ChinhSuaThuChi(transaction);}}>
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
                                        <View style={CaNhanDetailStyle.type1}>
                                            <View  style={[CaNhanDetailStyle.buttonType]}>
                                                <Button
                                                    icon="pen"
                                                   
                                                    onPress={() => {
                                                        setSelectedTransaction(transaction);
                                                        setShowDialog(true);
                                                    }}
                                                >
                                                    Cập nhật
                                                </Button>
                                            </View>       
                                            <View  style={[CaNhanDetailStyle.buttonType]}>
                                                <Button
                                                    icon="delete"
                                                    onPress={() => {
                                                        setSelectedTransaction(transaction);
                                                        setShowDialog1(true);
                                                    }}
                                                >
                                                    Xóa
                                                </Button>
                                            </View> 
                                        </View>                   
                                        <Dialog.Container visible={showDialog}>
                                        {selectedTransaction && (
                                                    <>
                                                      <Dialog.Title> Cập nhật thông tin</Dialog.Title>
                                                        <Dialog.Input
                                                            label="Tên giao dịch"
                                                            placeholder={selectedTransaction.name}
                                                            value={selectedTransaction.name}
                                                            onChangeText={(text) => setSelectedTransaction({ ...selectedTransaction, name: text })}
                                                        />
                                                        <Dialog.Input
                                                            label="Số tiền"
                                                            placeholder={(selectedTransaction.amount)}
                                                            value={(`${selectedTransaction.amount}`)}
                                                            onChangeText={(handleChangeAmount)}
                                                        />
                                                        <Dialog.Input
                                                            label="Mô tả"
                                                            placeholder={selectedTransaction.description}
                                                            value={selectedTransaction.description}
                                                            onChangeText={(text) => setSelectedTransaction({ ...selectedTransaction, description: text })}
                                                        />
                                                    </>
                                                )}
                                                <Dialog.Button label="Hủy" onPress={() => setShowDialog(false)} />
                                                <Dialog.Button label="Cập nhật" onPress={() => {
                                                    updateTransaction();
                                                    setShowDialog(false);
                                                }} />
                                            </Dialog.Container>     
                                            <Dialog.Container visible={showDialog1}>
                                                {selectedTransaction && (
                                                    <>
                                                        <Dialog.Title>Xác nhận xóa giao dịch</Dialog.Title>
                                                        <Dialog.Description>
                                                            Bạn có chắc chắn muốn xóa giao dịch này?
                                                        </Dialog.Description>
                                                        <Dialog.Button label="Hủy" onPress={cancelDelete} />
                                                        <Dialog.Button label="Xóa" onPress={() => {
                                                            deleteTransaction();
                                                            setShowDialog1(false);}}
                                                            />
                                                            </>
                                                )}
                                            </Dialog.Container>
                                    </View>
                                ))}
                        </View>
                        {loading && page > 1 && <ActivityIndicator/>}       
                    </ScrollView>  
                     ) }
        {!loading1 && loading2 && (
             <ScrollView  onScroll={loadMore}> 
                 <RefreshControl onRefresh={() => Refesh()} />                       
                        {loading && <ActivityIndicator/>}
                        <View >
                        {transactions1 !== null && transactions1.slice().sort((a, b) => b.id - a.id).map((transaction) => (

                                    <View key={transaction.id} style={Style.transactionRow}>
                                        <TouchableOpacity style={Style.transactionContainer} onPress={()=>{ChinhSuaThuChi(transaction);}}>
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
                                        <View style={CaNhanDetailStyle.type1}>
                                            <View  style={[CaNhanDetailStyle.buttonType]}>
                                                <Button
                                                    icon="pen"
                                                   
                                                    onPress={() => {
                                                        setSelectedTransaction(transaction);
                                                        setShowDialog(true);
                                                    }}
                                                >
                                                    Cập nhật
                                                </Button>
                                            </View>       
                                            <View  style={[CaNhanDetailStyle.buttonType]}>
                                                <Button
                                                    icon="delete"
                                                    onPress={() => {
                                                        setSelectedTransaction(transaction);
                                                        setShowDialog1(true);
                                                    }}
                                                >
                                                    Xóa
                                                </Button>
                                            </View> 
                                        </View>                   
                                        <Dialog.Container visible={showDialog}>
                                        {selectedTransaction && (
                                                    <>
                                                      <Dialog.Title> Cập nhật thông tin</Dialog.Title>
                                                        <Dialog.Input
                                                            label="Tên giao dịch"
                                                            placeholder={selectedTransaction.name}
                                                            value={selectedTransaction.name}
                                                            onChangeText={(text) => setSelectedTransaction({ ...selectedTransaction, name: text })}
                                                        />
                                                        <Dialog.Input
                                                            label="Số tiền"
                                                            placeholder={(selectedTransaction.amount)}
                                                            value={(`${selectedTransaction.amount}`)}
                                                            onChangeText={(handleChangeAmount)}
                                                        />
                                                        <Dialog.Input
                                                            label="Mô tả"
                                                            placeholder={selectedTransaction.description}
                                                            value={selectedTransaction.description}
                                                            onChangeText={(text) => setSelectedTransaction({ ...selectedTransaction, description: text })}
                                                        />
                                                    </>
                                                )}
                                                <Dialog.Button label="Hủy" onPress={() => setShowDialog(false)} />
                                                <Dialog.Button label="Cập nhật" onPress={() => {
                                                    updateTransaction();
                                                    setShowDialog(false);
                                                }} />
                                            </Dialog.Container>     
                                            <Dialog.Container visible={showDialog1}>
                                                {selectedTransaction && (
                                                    <>
                                                        <Dialog.Title>Xác nhận xóa giao dịch</Dialog.Title>
                                                        <Dialog.Description>
                                                            Bạn có chắc chắn muốn xóa giao dịch này?
                                                        </Dialog.Description>
                                                        <Dialog.Button label="Hủy" onPress={cancelDelete} />
                                                        <Dialog.Button label="Xóa" onPress={() => {
                                                            deleteTransaction();
                                                            setShowDialog1(false);}}
                                                            />
                                                            </>
                                                )}
                                            </Dialog.Container>
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
                                        <TouchableOpacity style={Style.transactionContainer} onPress={()=>{ChinhSuaThuChi(transaction);}}>
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
                                        <View style={CaNhanDetailStyle.type1}>
                                            <View  style={[CaNhanDetailStyle.buttonType]}>
                                                <Button
                                                    icon="pen"
                                                   
                                                    onPress={() => {
                                                        setSelectedTransaction(transaction);
                                                        setShowDialog(true);
                                                    }}
                                                >
                                                    Cập nhật
                                                </Button>
                                            </View>       
                                            <View  style={[CaNhanDetailStyle.buttonType]}>
                                                <Button
                                                    icon="delete"
                                                    onPress={() => {
                                                        setSelectedTransaction(transaction);
                                                        setShowDialog1(true);
                                                    }}
                                                >
                                                    Xóa
                                                </Button>
                                            </View> 
                                        </View>                   
                                        <Dialog.Container visible={showDialog}>
                                        {selectedTransaction && (
                                                    <>
                                                      <Dialog.Title> Cập nhật thông tin</Dialog.Title>
                                                        <Dialog.Input
                                                            label="Tên giao dịch"
                                                            placeholder={selectedTransaction.name}
                                                            value={selectedTransaction.name}
                                                            onChangeText={(text) => setSelectedTransaction({ ...selectedTransaction, name: text })}
                                                        />
                                                        <Dialog.Input
                                                            label="Số tiền"
                                                            placeholder={formatAmount(selectedTransaction.amount)}
                                                            value={formatAmount(`${selectedTransaction.amount}`)}
                                                            onChangeText={(text) => setSelectedTransaction({ ...selectedTransaction, amount: text })}
                                                        />
                                                        <Dialog.Input
                                                            label="Mô tả"
                                                            placeholder={selectedTransaction.description}
                                                            value={selectedTransaction.description}
                                                            onChangeText={(text) => setSelectedTransaction({ ...selectedTransaction, description: text })}
                                                        />
                                                    </>
                                                )}
                                                <Dialog.Button label="Hủy" onPress={() => setShowDialog(false)} />
                                                <Dialog.Button label="Cập nhật" onPress={() => {
                                                    updateTransaction();
                                                    setShowDialog(false);
                                                }} />
                                            </Dialog.Container>     
                                            <Dialog.Container visible={showDialog1}>
                                                {selectedTransaction && (
                                                    <>
                                                        <Dialog.Title>Xác nhận xóa giao dịch</Dialog.Title>
                                                        <Dialog.Description>
                                                            Bạn có chắc chắn muốn xóa giao dịch này?
                                                        </Dialog.Description>
                                                        <Dialog.Button label="Hủy" onPress={cancelDelete} />
                                                        <Dialog.Button label="Xóa" onPress={() => {
                                                            deleteTransaction();
                                                            setShowDialog1(false);}}
                                                            />
                                                            </>
                                                )}
                                            </Dialog.Container>
                                    </View>
                                ))}
                                    </View>
                                              
                                </ScrollView>  
                                ) }             
        </View>
    );
};

export default CaNhanDetail;