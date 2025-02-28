import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useState } from 'react';
import Logo from '../../common/Logo';
import CustomInput from '../../common/CustomInput';
import CustomButton from '../../common/CustomButton';
import { login } from '../../api/authService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../../context _api/Context';
import { blueColor, grayColor, greenColor } from '../../common/Color';
import BackgroundWrapper from '../../common/BackgroundWrapper';
import ForgetpasswordModal from './Forgetpassword';

const Login = ({ navigation }) => {
  const [phone_no, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const auth_token = 'sfdsfLJGHDFLG4785643698jfg';
  const { infoUserData } = useContext(AppContext);

  const handleLogin = async () => {
    if (!phone_no || !password) {
      Alert.alert('', 'Please fill in Input Details.');
      return;
    }
    if (phone_no.length !== 10 || isNaN(phone_no)) {
      Alert.alert('', 'Number must be 10 digits.');
      return;
    }

    const credentials = { loginId:phone_no, password, auth_token };

    try {
      const response = await login(credentials);
      console.log(response);
      
      if (response && response.msg !== 'You have successfully logged in.') {
        Alert.alert(response.msg);
      }
      if (response.msg === 'You have successfully logged in.') {
        infoUserData(response);
        // navigation.navigate("AppStack", { screen: "dashboard" });
        
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handlePhoneChange = text => {
    if (text.length > 10) {
      Alert.alert('', 'Phone number more than 10 digits');
      return;
    }
    setPhoneNo(text);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <BackgroundWrapper backgroundImage={require('../../assets/background.jpg')} />

     <View style={{marginTop:"20%"}}>
     <Logo style={styles.logo} />
     </View>

      <View style={styles.loginFormContainer}>
        <Text style={styles.welcomeText}>Welcome! Login Here</Text>

        <CustomInput
          placeholder="Phone"
          value={phone_no}
          onChangeText={handlePhoneChange}
          iconName="mobile"
          keyboardType="phone-pad"
          maxLength={10}
        />

        <View style={styles.passwordContainer}>
          <CustomInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            iconName="lock"
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIconContainer}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <CustomButton title="Login" onPress={handleLogin}  />

        <TouchableOpacity onPress={openModal}>
          <Text style={styles.forgotPasswordText}>Forgot Your Password?</Text>
        </TouchableOpacity>
        <ForgetpasswordModal
          isVisible={isModalVisible}
          onClose={closeModal}
          navigation={navigation}
        />
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    alignItems: 'center',
    padding: 16,
  },

  loginFormContainer: {
    
    width: '90%',
    // maxWidth: 400,
    padding: 20,
    borderRadius: 5,
    //  backgroundColor: 'rgba(255, 255, 255, 0.8)', // Transparent white
    shadowColor: greenColor,
    // shadowOpacity: 0.2,
    // shadowOffset: { width: 0, height: 5 },
    // shadowRadius: 1,
    // elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color:grayColor
  },
  passwordContainer: {
    width: '100%',
    marginBottom: 15,
    position: 'relative',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  forgotPasswordText: {
    color: blueColor,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
