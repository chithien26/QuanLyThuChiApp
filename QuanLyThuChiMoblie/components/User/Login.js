import { View, Text, Button } from "react-native"
import MyStyles from "../../styles/MyStyles"

const Login =() => {
    return (
        <View style={MyStyles.container}>
            <Text style={MyStyles.subject}>Ứng dụng quản lý chi tiêu Online</Text>
            <View style={MyStyles.buttonContainer}>
                <Button
                    title="Đăng nhập"
                    onPress={() => {
                        // Xử lý khi bấm nút Đăng nhập
                        console.log('Đăng nhập');
                    }}
                />
            </View>
            <View style={MyStyles.buttonContainer}>
                <Button
                    title="Đăng ký"
                    onPress={() => {
                        // Xử lý khi bấm nút Đăng ký
                        console.log('Đăng ký');
                    }}
                />
            </View>
        </View>
    )            
}

export default Login;