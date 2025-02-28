

import React, {useState, useEffect, useContext} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from '../../common/CustomButton';
import SecondHeader from '../../components/SecondHeader';
import {greenColor, whiteColor} from '../../common/Color';
import {AppContext} from '../../context _api/Context';
import {
  bookAppointmentNowPatient,
  getpatientfamily,
} from '../../api/authService';
import uuid from 'react-native-uuid';
const Familymembers = ({navigation}) => {
  const {
 
    member_mobilenumber,
    refreshPage,
    userdata,
    selectedLocationId,
    familydetails,
    booklaterData,
    updatePatientFamily_id,
  } = useContext(AppContext);
  const uniqueId = uuid.v4();
  const token = userdata?.data?.auth_token;
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    const token = userdata?.data?.auth_token;
    const fetchData = async () => {
      const credentials = {
        token,
        _id: familydetails._id,
        patient_id: familydetails.patient_id,
      };

      try {
        const response = await getpatientfamily(credentials);

        if (response?.docs) {
          setFamilyMembers(response.docs);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [userdata, familydetails]);

  // Helper function to pair data
  const getRowData = data => {
    const rows = [];
    for (let i = 0; i < data.length; i += 2) {
      rows.push(data.slice(i, i + 2));
    }
    return rows;
  };

  const bookNow = async (memberId, profileId) => {
    const credentials = {
      token: token,
      patientId: memberId,
      profileId: profileId,
      workAddressId: selectedLocationId,
      uid: uniqueId,
    };

    try {
      const response = await bookAppointmentNowPatient(credentials);

      if (response.msg === 'Slot booked successfully.') {
        refreshPage(true)
        navigation.navigate('Work Queue', {screen: 'WorkQueueMain'});
      } else {
        Alert.alert(response.msg);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderRow = ({item}) => (
    <View style={styles.row}>
      {item.map(member => {
        if (member.relationship === 'PRIMARY_PROFILE') {
          updatePatientFamily_id(member._id);
          
          member_mobilenumber(member.mobileNumber)
        }
        return (
         
          <View style={styles.card} key={member._id}>
            <View style={{alignItems: 'center'}}>
              <Image source={{uri: member.imgUrl}} style={styles.userPhoto} />
              <Text style={styles.nameText}>
                {`${member.firstName} ${member.lastName}`}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="user" size={20} color="#555" />
              <Text style={styles.infoText}>{member.relationship
              .toLowerCase() // Convert to lowercase
              .split('_') // Split by underscore
              .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
              .join(' ')
                }</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="info-circle" size={20} color="#555" />
              <Text style={styles.infoText}>{member.age?.years} years</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="genderless" size={20} color="#555" />
              <Text style={styles.infoText}>{member.gender}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="id-card" size={20} color="#555" />
              <Text style={styles.infoText}>{member.hruId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="calendar" size={20} color="#555" />
              <Text style={styles.infoText}>
                {new Date(member.dob).toLocaleDateString()}
              </Text>
            </View>
            <View style={{flexDirection: 'row', gap: 5, marginTop: 10,justifyContent:"center"}}>
              <TouchableOpacity
                onPress={() => {
                  bookNow(member._id, member.profileId);
                }}>
                <View
                  style={{
                    backgroundColor: greenColor,
                    height: 30,
                    padding: 5,
                    borderRadius: 10,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: whiteColor,
                      textAlign: 'center',
                      fontSize: 12,
                    }}>
                    Book Now
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  booklaterData(member._id, member.profileId);
                  navigation.navigate('My Patients', {
                    screen: 'add_appointment',
                  });
                }}>
                <View
                  style={{
                    backgroundColor: greenColor,
                    height: 30,
                    borderRadius: 10,
                    justifyContent: 'center',
                    padding: 5,
                  }}>
                  <Text
                    style={{
                      color: whiteColor,
                      textAlign: 'center',
                      fontSize: 12,
                    }}>
                    Book Later
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );

  const rowData = getRowData(familyMembers);
console.log("familyMembers",familyMembers);

  return (
    <>
      <LinearGradient
        colors={['white', '#eafaf1']}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <View
          style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 5}}>
          {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate('My Patients', {screen: 'addfamily_member'});
            }}>
            <Text
              style={{
                backgroundColor: greenColor,
                borderRadius: 50,
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
                color:whiteColor
              }}>
              Add Member
            </Text>
          </TouchableOpacity> */}
        </View>
        <FlatList
          data={rowData}
          renderItem={renderRow}
          keyExtractor={(item, index) => `row-${index}`}
          contentContainerStyle={styles.container}
        />
      </LinearGradient>
    </>
  );
};

export default Familymembers;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    width: '48%',

    elevation: 3,
  },
  userPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    color: greenColor,
  },
  // infoText: {
  //   fontSize: 12,
  //   color: 'gray',
  // },
  // labelText: {
  //   fontWeight: 'bold',
  //   color: greenColor, // Make the label text bold
  // },
  infoRow: {
    flexDirection: 'row',

    marginLeft: 20,
    padding:5
  },
  infoText: {
    fontSize: 14,
    color: 'gray',
marginLeft: 10,
  },
});
