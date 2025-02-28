import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomInput from '../../common/CustomInput';
import CustomButton from '../../common/CustomButton';
import { changePassword } from '../../api/authService';
import { AppContext } from '../../context _api/Context';
import Logo from '../../common/Logo';
import { whiteColor } from '../../common/Color';
import BackgroundWrapper from '../../common/BackgroundWrapper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Changepassword = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const [newpassword, setNewpassword] = useState('');
  const [confimpassword, setConfimPassword] = useState('');
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const { forgetnumber } = useContext(AppContext);

  const handleUpdate = async () => {
    if (!otp || !newpassword || !confimpassword) {
      Alert.alert('', 'Please fill in Input Details.');
      return;
    }

    if (newpassword !== confimpassword) {
      Alert.alert('', 'Password and Confirm Password must be the same.');
      return;
    }

    if (otp.length !== 4 || isNaN(otp)) {
      Alert.alert('', 'OTP must be 4 digits.');
      return;
    }

    const credentials = {
      phone_no: forgetnumber,
      otp,
      password: confimpassword,
    };

    try {
      const response = await changePassword(credentials);
      if (response) {
        Alert.alert(response.msg);
        if (response.msg === 'Password has been reset') {
          navigation.navigate('login');
        }
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleOtpChange = (text) => {
    if (text.length > 4) {
      Alert.alert('', 'OTP cannot more than 4 digits.');
      return;
    }
    setOtp(text);
  };

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <BackgroundWrapper backgroundImage={require('../../assets/background.jpg')} />
      <Logo />
      <View style={styles.updateFormContainer}>
        <CustomInput
          placeholder="OTP"
          value={otp}
          onChangeText={handleOtpChange}
          iconName="mobile"
          keyboardType="phone-pad"
          maxLength={4}
        />

        <View style={styles.passwordContainer}>
          <CustomInput
            placeholder="New Password"
            value={newpassword}
            onChangeText={setNewpassword}
            iconName="lock"
            secureTextEntry={!isNewPasswordVisible}
          />
          <TouchableOpacity
            onPress={toggleNewPasswordVisibility}
            style={styles.eyeIconContainer}>
            <Ionicons
              name={isNewPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <CustomInput
            placeholder="Confirm Password"
            value={confimpassword}
            onChangeText={setConfimPassword}
            iconName="lock"
            secureTextEntry={!isConfirmPasswordVisible}
          />
          <TouchableOpacity
            onPress={toggleConfirmPasswordVisibility}
            style={styles.eyeIconContainer}>
            <Ionicons
              name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <CustomButton title="Update" onPress={handleUpdate} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteColor,
    padding: 10,
  },
  updateFormContainer: {
    flex: 2,
    alignItems: 'center',
  },
  passwordContainer: {
    width: '100%',
    marginBottom: 15,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
});

export default Changepassword;
