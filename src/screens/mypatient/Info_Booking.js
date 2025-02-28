import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

import {greenColor, whiteColor} from '../../common/Color';
import {AppContext} from '../../context _api/Context';
import {
  bookAppointmentNowPatient,
  mypatientgeninfo,
} from '../../api/authService';
import uuid from 'react-native-uuid';
const Info_Booking = ({navigation}) => {
  const {selectedDoctor,refreshPage,userdata, updateFamilyDetails, selectedLocationId, booklaterData} =
    useContext(AppContext);
  const route = useRoute();
  const {selectedItem} = route.params;
  const uniqueId = uuid.v4();
  const token = userdata?.data?.token;
  const { mobile_no, profile_pic, value} = selectedItem;
  const [showdata, setShowData] = useState([]);

  const fullName = `${value.firstName}  ${value.lastName}` || 'N/A';
  const profilePicture = profile_pic || 'https://via.placeholder.com/100';
  const phone = mobile_no || 'N/A';
  useEffect(() => {
    const fetchdata = async () => {
      const credentials = {
        token,
        patientId: selectedItem.value._id,
        profileId: selectedItem.value.profileId,
        doctorId: selectedDoctor.length > 0 ? selectedDoctor : "ALL",
        doctorIds: selectedDoctor.length > 0 ? selectedDoctor : "ALL",
      };
      console.log("credentials",credentials);
      

      const response = await mypatientgeninfo(credentials);
      console.log("response",response);
      
      setShowData(response.doc);
    };
    fetchdata();
  }, []);

  const bookNow = async () => {
    const credentials = {
      token: token,
      patientId: selectedItem.value._id,
      profileId: selectedItem.value.profileId,
      workAddressId: selectedLocationId,
      uid: uniqueId,
    };
    

    try {
      const response = await bookAppointmentNowPatient(credentials);
     

      if (response.msg === 'Slot booked successfully.') {
        refreshPage(true)
        navigation.navigate('Work Queue', { screen: 'WorkQueueMain' });
      } else {
        Alert.alert(response.msg);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  

  return (
    <>
      <LinearGradient
        colors={['white', '#eafaf1']}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <View style={styles.container}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View>
              <Image source={{uri: profilePicture}} style={styles.userPhoto} />
            </View>

            <View style={styles.locationContainer}>
              <View style={[styles.rowItem,{borderBottomWidth:0}]}>
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    bookNow();
                  }}>
                  <View
                    style={{
                      backgroundColor: greenColor,
                      height: 30,
                      width: 100,
                      borderRadius: 20,
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: whiteColor, textAlign: 'center'}}>
                      Book Now
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={[styles.rowItem,{borderBottomWidth:0}]}>
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    booklaterData(
                      selectedItem.value._id,
                      selectedItem.value.profileId,
                    );
                    navigation.navigate('My Patients', { screen: 'add_appointment' });
                    
                  }}>
                  <View
                    style={{
                      backgroundColor: greenColor,
                      height: 30,
                      width: 100,
                      borderRadius: 20,
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: whiteColor, textAlign: 'center'}}>
                      Book Later
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={styles.rowItem}>
              <Icon name="user" size={30} color="#5d6d7e" />
              <View style={styles.textContainer}>
                <Text style={styles.labelText}>Name</Text>
                <Text style={styles.valueText}>{fullName}</Text>
              </View>
            </View>
            <View style={styles.rowItem}>
              <Icon name="phone" size={30} color="#5d6d7e" />
              <View style={styles.textContainer}>
                <Text style={styles.labelText}>Phone</Text>
                <Text style={styles.valueText}>{phone}</Text>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row',  marginTop: 10}}>
            <View style={styles.rowItem}>
              <Icon name="tint" size={30} color="#5d6d7e" />
              <View style={styles.textContainer}>
                <Text style={styles.labelText}>Blood Group</Text>
                {/* <Text style={styles.valueText}>{showdata.bloodGroup}</Text> */}
              </View>
            </View>
            <View style={styles.rowItem}>
              <Icon name="user" size={30} color="#5d6d7e" />
              <View style={styles.textContainer}>
                <Text style={styles.labelText}>HruId</Text>
                {/* <Text style={styles.valueText}>{showdata.hruId}</Text> */}
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row',  marginTop: 10}}>
            <View style={styles.rowItem}>
              <Icon name="calendar" size={30} color="#5d6d7e" />
              <View style={styles.textContainer}>
                <Text style={styles.labelText}>DOB</Text>
                {/* <Text style={styles.valueText}>
                  {new Date(showdata.dob).toLocaleDateString()}
                </Text> */}
              </View>
            </View>
            <View style={styles.rowItem}>
              <Icon name="genderless" size={30} color="#5d6d7e" />
              <View style={styles.textContainer}>
                <Text style={styles.labelText}>Gender</Text>
                {/* <Text style={styles.valueText}>{showdata.gender}</Text> */}
              </View>
            </View>
          </View>

          <View style={{flex: 1}}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                updateFamilyDetails({
                  _id: selectedItem.value._id,
                  patient_id: selectedItem.value.profileId,
                });
                navigation.navigate('My Patients', { screen: 'FamilyMembers' });
                
              }}>
              <Text style={styles.addButtonText}> Family List</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton2}
              onPress={() =>
              
                navigation.navigate('EditProfile', {
                
                    selectedItem 
                })
                
              }>
              <Text style={styles.addButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

export default Info_Booking;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    margin: 10,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  userPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  fullName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  mobile: {
    fontSize: 14,
    color: '#5d6d7e',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width:120,
    // padding: 10,
     borderBottomWidth: 1,
     borderColor: 'lightgray',
     margin:10
     
  },
  rowItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 10,
  },
  textContainer: {
    marginLeft: 10,
  },
  labelText: {
    fontSize: 12,
    color: 'gray',
  },
  valueText: {
    fontSize: 14,
    color: 'black',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    // right: 120,
    backgroundColor: greenColor,
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButton2: {
    position: 'absolute',
    bottom: 20,

    right: 0,
    backgroundColor: greenColor,
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 8,
  },
});
