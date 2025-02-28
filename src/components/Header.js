import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext } from 'react';
import Customicons from '../common/Customicons';
import { grayColor, greenColor, whiteColor } from '../common/Color';
import { AppContext } from '../context _api/Context';

const Header = () => {
  const { userdata, clearUserData } = useContext(AppContext);
 
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout', // Title of the alert
      'Are you sure you want to log out?', // Message
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout canceled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => clearUserData(), // Logout action
        },
      ],
      { cancelable: true }
    );
  };
  const userName = userdata?.data?.name || 'User';

  const cleanedUrl = userdata?.data?.profile_pic.replace('/doctor/:', '/doctor/');
  const profilePic =
  cleanedUrl|| 'https://via.placeholder.com/50';
   

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image source={{ uri: profilePic }} style={styles.userImage} />
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}>
          <Customicons
            name={'sign-out'}
            size={30}
            color={whiteColor}
            style={styles.icons}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: greenColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: greenColor,
  },
  textContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: whiteColor,
  },
  userName: {
    fontSize: 18,
    // fontWeight: '900',
    color: whiteColor,
    // fontFamily: 'cursive',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    // backgroundColor: whiteColor,
    borderRadius: 5,
    padding: 5,
  },
  locationText: {
    fontSize: 16,
    color: grayColor,
    marginRight: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  icons: {
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: whiteColor,
    borderRadius: 10,
    width: 250,
    padding: 10,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: grayColor,
  },
  modalItemText: {
    fontSize: 16,
    color: grayColor,
  },
});
