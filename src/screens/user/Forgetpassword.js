import {Alert, Modal, StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useContext, useState} from 'react';
import CustomButton from '../../common/CustomButton';
import CustomInput from '../../common/CustomInput';
import {forgotPassword} from '../../api/authService';
import {AppContext} from '../../context _api/Context';
import {grayColor, whiteColor} from '../../common/Color';
import Icon from 'react-native-vector-icons/Ionicons'; 

const ForgetpasswordModal = ({isVisible, onClose, navigation}) => {
  const [phone_no, setPhoneNo] = useState('');
  const {forgetNumberData} = useContext(AppContext);

  const handleForget = async () => {
    if (!phone_no) {
      Alert.alert('', 'Please fill in Number.');
      return;
    }
    if (phone_no.length !== 10 || isNaN(phone_no)) {
      Alert.alert('', 'number must be 10 digits.');
      return;
    }

    const credentials = {loginId:phone_no};

    try {
      const response = await forgotPassword(credentials);
      if (response) {
        Alert.alert(response.msg);
      }
      if (response.msg == 'Please check your SMS to reset password') {
        forgetNumberData(credentials.phone_no);
        navigation.navigate('reset');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  const handlePhoneChange = text => {
    if (text.length > 10) {
      Alert.alert('', 'Phone number more than 10 digits');
      return;
    }
    setPhoneNo(text);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Icon name="close-circle" size={30} color={grayColor} /> 
          </TouchableOpacity>

          <View style={styles.forget}>
            <CustomInput
              placeholder="Enter Phone Number"
              value={phone_no}
              onChangeText={handlePhoneChange}
              iconName="mobile"
              keyboardType="phone-pad"
              maxLength={10}
              style={styles.inputField}
            />
            <CustomButton 
              title="Send OTP" 
              onPress={handleForget} 
             
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ForgetpasswordModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    width: '85%',
    backgroundColor: whiteColor,
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10, 
    position: 'relative', 
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, 
  },
  forget: {
    width: '100%',
    alignItems: 'center',
  },
  inputField: {
    width: '100%',
    marginBottom: 15,
  },
 
});
