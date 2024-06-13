import axios from 'axios';


const Login = async (username, password) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/token/', {
      username,
      password,
    });
    const { access_token } = response.data;
    // Lưu token truy cập vào local storage hoặc secure storage
    localStorage.setItem('accessToken', access_token);
    // Chuyển hướng đến trang chủ hoặc màn hình tiếp theo
    navigation.navigate('Home');
  } catch (error) {
    console.error(error);
    // Xử lý lỗi đăng nhập
  }
};

export default Login
