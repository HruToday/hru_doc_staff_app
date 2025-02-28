import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  grayColor,
  greenColor,
  lightbackground,
  whiteColor,
} from '../../common/Color';
import { AppContext } from '../../context _api/Context';
import {
  bookAppointmentNowPatient,
  mypatientgeninfo,
  patientAppointmentHistory,
} from '../../api/authService';
import LinearGradient from 'react-native-linear-gradient';
import uuid from 'react-native-uuid';
const RowItem = ({ iconName, label, value }) => (
  <View style={styles.rowItem}>
    <Icon name={iconName} size={30} color={'#5d6d7e'} />
    <View style={styles.textContainer}>
      <Text style={styles.labelText}>{label}</Text>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  </View>
);

const SecondColumn = ({ data }) => (
  <View style={styles.secondColumn}>
    {data.map((item, index) => (
      <RowItem
        key={index}
        iconName={item.iconName}
        iconSize={item.iconSize}
        label={item.label}
        value={item.value}
      />
    ))}
  </View>
);

const General_Info = ({ navigation }) => {
  const [patientdata, setPatientdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const { refreshPage, userdata, selectedPatient, selectedLocationId, booklaterData } =
    useContext(AppContext);
  const [bookappointment, setbookappointment] = useState([]);
  const token = userdata?.data?.token;
  const uniqueId = uuid.v4();
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const credentials = {
          token,
          _id: selectedPatient._id,
          patientId: selectedPatient.patient_id,
          doctorIds: userdata?.data?.doctorIds,
           "doctorId": "ALL",
        };


        const credentialsappointment = {
          token,
          patientId: selectedPatient._id,
          profileId: selectedPatient.patient_id,
          doctorIds: userdata?.data?.doctorIds,
          "doctorId": "ALL",
        };
console.log("credentials",credentials);
console.log("credentialsappointment",credentialsappointment);


        const response = await mypatientgeninfo(credentials);
        console.log("response",response);
        


        const response2 = await patientAppointmentHistory(
          credentialsappointment,
        );
        console.log("response2",response2)
        setbookappointment(response2.docs);



        setPatientdata(response.doc);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchdata();
  }, [selectedPatient, token]);

  if (!patientdata || loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <ActivityIndicator size="large" color={greenColor} />
      </View>
    );
  }

  // Row Data to display dynamically from patientdata
  const rowData = [
    {
      iconName: 'user',
      iconSize: 30,
      label: 'Name',
      value: patientdata.firstName + ' ' + patientdata.lastName || 'N/A',
    },
    {
      iconName: 'info-circle',
      iconSize: 30,
      label: 'Global Patient ID',
      value: patientdata.hruId || 'N/A',
    },
    {
      iconName: 'phone',
      iconSize: 20,
      label: 'Phone',
      value: patientdata.mobileNumber || 'N/A',
    },
    {
      iconName: 'calendar',
      iconSize: 20,
      label: 'DOB',
      value: new Date(patientdata.dob).toLocaleDateString() || 'N/A',
    },
    {
      iconName: 'genderless',
      iconSize: 20,
      label: 'Gender',
      value: patientdata.gender || 'N/A',
    },

  ];
  const rowData2 = [
    {
      iconName: 'tint',
      iconSize: 30,
      label: 'Blood Group',
      value: patientdata.bloodGroup || 'N/A',
    },
    {
      iconName: 'heart',
      iconSize: 30,
      label: 'Relationship',
      value: patientdata.relationship || 'N/A',
    },
    {
      iconName: 'medkit',
      iconSize: 20,
      label: 'HealthScheme',
      value: patientdata.healthScheme || 'N/A',
    },
    {
      iconName: 'user',
      iconSize: 20,
      label: 'Primary Profile',
      value: patientdata.primaryProfile || 'N/A',
    },
  ];

  const bookNow = async () => {
    if (loading) return; // Prevent multiple submissions

    setLoading(true); // Start loading

    const credentials = {
      token: token,
      patientId: selectedPatient._id,
      profileId: selectedPatient.patient_id,
      workAddressId: selectedLocationId,
      uid: uniqueId,
    };

    try {
      const response = await bookAppointmentNowPatient(credentials);

      if (response.msg === 'Slot booked successfully.') {
        refreshPage(true);
        navigation.navigate('Work Queue', { screen: 'WorkQueueMain' });
      } else {
        Alert.alert(response.msg);
      }
    } catch (error) {
      console.log(error.message);
      Alert.alert('Something went wrong, please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };
  return (
    <LinearGradient
      colors={['white', '#eafaf1']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <View>
            <Image
              source={{
                uri: patientdata.imgPath,
              }}
              style={styles.userPhoto}
            />
            <View style={styles.locationContainer}>
              <SecondColumn data={rowData2} />
            </View>
          </View>
          <View style={styles.locationContainer}>
            <SecondColumn data={rowData} />
          </View>
        </View>

        {/* <View style={styles.remarkContainer}>
          <Text style={styles.remarkTitle}>Remark</Text>
          <Text style={styles.remarkText}>
            This is a two-line remark section. It has a light blue background to
            highlight the text.
          </Text>
        </View> */}
        <Text style={{ color: greenColor }}>Booked Appointment</Text>
        <View style={{ height: 190 }}>
          <ScrollView showsVerticalScrollIndicator={false} >
            <View>
              {bookappointment && bookappointment.length > 0 ? (
                bookappointment.map((appointment, index) => {
                  const appointmentDate = new Date(appointment.date);
                  const formattedAppointmentDate = appointmentDate.toLocaleDateString();
                  const appointmentStartTime = new Date(appointment.startTime);
                  const appointmentTime = appointmentStartTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });


                  const now = new Date();
                  const twoHoursBefore = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours ahead

                  const isFutureDate = appointmentDate > now ||
                    (appointmentDate.toDateString() === now.toDateString() && appointmentStartTime.getTime() >= twoHoursBefore.getTime());


                  return (
                    <View key={index} style={styles.iconTextContainer}>
                      <Icon name="calendar" size={20} color="#5d6d7e" />
                      <Text style={styles.calendarText}>
                        {formattedAppointmentDate} at {appointmentTime}
                      </Text>
                      <Text style={styles.statusText}>{appointment.statusTxt}</Text>


                      {isFutureDate && (
                        <TouchableOpacity onPress={() => {

                          booklaterData(appointment.patientId, appointment.profileId);
                          navigation.navigate('My Patients', { screen: 'add_appointment' });

                        }}>
                          <Text style={styles.rescheduleText}>Re-schedule</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })
              ) : (
                <Text style={styles.noAppointmentsText}>
                  No appointments available
                </Text>
              )}
            </View>

          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            bookNow();
          }}>
          <View style={styles.addButtonContainer}>

            <Text style={styles.addButtonText}>Book Now</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton2}
          onPress={() => {
            booklaterData(selectedPatient._id, selectedPatient.patient_id);
            navigation.navigate('My Patients', { screen: 'add_appointment' });
          }}>
          <View style={styles.addButtonContainer}>

            <Text style={styles.addButtonText}>Book Later</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default General_Info;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    marginBottom: 20,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    gap: 10,
    justifyContent: 'space-evenly',
  },
  userPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  textContainer: {
    marginLeft: 10,
  },
  labelText: {
    fontSize: 12,
    color: 'gray',
  },
  valueText: {
    fontSize: 13,
  },
  remarkContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
  },
  remarkTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  remarkText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,

  },
  calendarText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'black',
  },
  statusText: {
    padding: 5,
    marginLeft: 8,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 10,
    color: greenColor,
    backgroundColor: lightbackground,
  },
  rescheduleText: {
    padding: 5,
    marginLeft: 8,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 10,
    color: whiteColor,
    backgroundColor: '#145d89',
  },
  addButton: {
    position: 'absolute',

    bottom: 2,
    right: 120,
    backgroundColor: greenColor,
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButton2: {
    position: 'absolute',
    bottom: 2,
    right: 10,
    backgroundColor: greenColor,
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  addButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 8,
  },
});
