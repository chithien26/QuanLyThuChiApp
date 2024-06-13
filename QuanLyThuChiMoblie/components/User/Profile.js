import { useContext } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import MyStyles from "../../styles/MyStyles";
import { useNavigation } from '@react-navigation/native';
import CaNhan from "../QuanLyThuChi/CaNhan";
import Nhom from "../QuanLyThuChi/Nhom"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



const Profile = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const navigation = useNavigation();
    const Logout = () => {
        dispatch({ type: "logout" });
        navigation.navigate('Login');
    };
    return (
        <View style={[MyStyles.container, MyStyles.margin]}>
            {user ? (
                <>
                    <Text style={MyStyles.subject}>CHÀO {user.username}!</Text>
                    <Text style={MyStyles.subject}>CHÀO </Text>
                    <Text style={MyStyles.subject}>CHÀO !</Text>
                    <Button icon="logout" onPress={Logout}>Đăng xuất</Button>
                </>
            ) : (
                <Text style={MyStyles.subject}>Loading...</Text>
            )}
        </View>        
    );
}
export default Profile;
