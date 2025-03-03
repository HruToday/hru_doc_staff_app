import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../../common/CustomButton';
import SecondHeader from '../../components/SecondHeader';
import {
  blackColor,
  grayColor,
  greenColor,
  whiteColor,
} from '../../common/Color';
import BackgroundWrapper from '../../common/BackgroundWrapper';
import { AppContext } from '../../context _api/Context';
import { Picker } from '@react-native-picker/picker';
import {
  bookappoforPatient,
  getnextWeekClinicTimeSlot,
  mypatientgeninfo,
  searchpatientbyid,
} from '../../api/authService';
import DropDowns from '../../components/DropDowns';
const formatDate = date => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const Add_Appointment = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('date');
  const [timeslots, setTimeSlots] = useState(null);
  const [slotData, setSlotData] = useState(null);
  const [bookingDate, setBookingDate] = useState([]);
  const [bookingSlot, setBookingSlot] = useState([]);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const {selectedPatient,selectedDoctor, refreshPage, userdata, booklaterpatient, selectedLocationId, loctioncolorupdate } =
    useContext(AppContext);
  const token = userdata?.data?.token;
  const [patientData, setPatientData] = useState(null);
  const [date_display, setDate_display] = useState(
    new Date().toLocaleString('default', { month: 'long' })
  );


  const [selectedItem, setSelecteditem] = useState("");
  useEffect(() => {
    loctioncolorupdate('white');
    const fetchData = async () => {
      const credentials = {
        token,
        _id: selectedPatient._id,
        patientId: selectedPatient.patient_id,
        doctorIds: userdata?.data?.doctorIds,
         "doctorId": "ALL",
      };

console.log("credentials",credentials);


      try {
        const response = await mypatientgeninfo(credentials);
        
console.log("response",response);


        setPatientData(response.doc);
      } catch (error) {
        console.log('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [userdata, booklaterpatient]);

  

  useEffect(() => {
    const fetchingslots = async () => {
      const selectedTimestamp = new Date(selectedDate).getTime();
      const credentialsBookSlots = {
        token: token,
        doctorId: selectedDoctor.length > 0 ? selectedDoctor : "ALL",
        nextStartDays: selectedTimestamp,
      };
console.log("credentialsBookSlots",credentialsBookSlots);

      try {
        const response2 = await getnextWeekClinicTimeSlot(credentialsBookSlots);
       console.log("response2",response2);
       


        if (response2?.msg==="ok") {
          const bookingdates = response2.doc?.workLocationSlots[0]?.days|| [];


          const validBookingDates = bookingdates.filter(
            item => item?.timings?.length > 0,
          );


          if (validBookingDates.length > 0) {
            setBookingDate(validBookingDates);
            setSlotData(response2);

            // const timesolt = validBookingDates[0]?.timings[0]?.slots || [];
            const timesolt = validBookingDates[0]?.timings?.flatMap((timing) => timing.slots) || [];
            

            setBookingSlot(timesolt);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchingslots();
  }, [selectedDate, selectedLocationId]);
  const scrollViewRef = useRef(null);
  // const scrollLeft = () => {
  //   scrollViewRef.current.scrollTo({ x: -100, animated: true });
  // };


  const scrollLeft = () => {
    if (currentWeekOffset >= 7) { // Prevent negative offsets (past dates)
      const newOffset = currentWeekOffset - 7;
      setCurrentWeekOffset(newOffset);
      scrollViewRef.current.scrollTo({ x: -100, animated: true });
      // Calculate new selected date
      const newSelectedDate = new Date();
      newSelectedDate.setDate(newSelectedDate.getDate() + newOffset);
      const formattedNewDate = formatDate(newSelectedDate);
      setSelectedDate(formattedNewDate);
    }
  };


  // const scrollRight = () => {
  //   scrollViewRef.current.scrollTo({ x: 100, animated: true });
  // };
  const scrollRight = () => {
    const newOffset = currentWeekOffset + 7;
    setCurrentWeekOffset(newOffset);
    scrollViewRef.current.scrollTo({ x: 100, animated: true });
    // Calculate new selected date
    const newSelectedDate = new Date();
    newSelectedDate.setDate(newSelectedDate.getDate() + newOffset);
    const formattedNewDate = formatDate(newSelectedDate);
    setSelectedDate(formattedNewDate);
  };


  const openCalendar = () => {
    setCalendarVisible(true);
  };
console.log("patientData",patientData);

  const onDateSelect = (event, date) => {
    if (date) {
      const formattedDate = formatDate(date);
      setSelectedDate(date);
      setCalendarVisible(false);
    }
  };

  const ContactItem = ({ iconName, label, detail }) => (
    <View style={styles.contactItem}>
      <View style={styles.iconContainer}>
        <Icon name={iconName} size={20} color={greenColor} />
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactText}>{detail}</Text>
      </View>

    </View>
  );

  const onDateChange = itemValue => {
    // setBookingSlot(itemValue?.timings[0]?.slots || []);
    setBookingSlot(itemValue?.timings?.flatMap((timing) => timing.slots) || []);
  };
  const handlePress = item => {
   
    
    setSelectedSlot(item.display);
    setTimeSlots(item);
  };

  const handleBookforLater = async () => {
    if (loading) return; // Prevent multiple submissions


   setLoading(true);
    const credentials_bookforlater = {
      token: token,
      patientId: patientData._id,
      profileId: patientData.profileId,
      workAddressId: timeslots.workAddressId,
      startTime: timeslots.id,
      endTime: timeslots.endTime,
      uid: timeslots.uid, 
      doctorId: selectedDoctor.length > 0 ? selectedDoctor : "ALL",
      bookedBy: 'DOCTOR',
      patientName: `${patientData.firstName || ''} ${patientData.lastName || ''}`.trim(),

      patientNumber: patientData.mobileNumber,
    };

    console.log("credentials_bookforlater",credentials_bookforlater);
    
    try {
      const response = await bookappoforPatient(credentials_bookforlater);
      console.log("response",response);
      
      if (response.msg === 'Slot booked successfully.') {
        refreshPage(true);
        navigation.navigate('Work Queue', { screen: 'WorkQueueMain' });
      } else {
        Alert.alert(response.msg);
      }

    } catch (error) {
      console.log(error.massage);

    } finally {
       setLoading(false); // Stop loading
    }


  };
  useEffect(() => {
    if (bookingDate.length > 0) {
      setSelecteditem(bookingDate[0]);
      setDate_display(bookingDate[0].display);
      onDateChange(bookingDate[0]);
    }
  }, [bookingDate]);

  
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <ActivityIndicator size="large" color={greenColor} />
      </View>
    );
  }
  return (
    <>
      <SecondHeader
        title="Add Appointment"
        onBackPress={() => navigation.goBack()}
        showLocation={false}
        showSearch={false}
        titlecss={{ marginRight: "auto" }}
       
        topBarStyle={{ justifyContent: 'space-between' ,gap:25}}
      />
      <DropDowns/>
      <ScrollView style={styles.container}>
        <BackgroundWrapper
          backgroundImage={require('../../assets/background.jpg')}
        />
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: `https://beta.hru.today/show-uploaded.image?path=${patientData?.imgUrl?.path
                }` || 'https://beta.hru.today/doctor/:673d8b440d9b9d0acbc030a1/display.image',
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.nameText}>
              {patientData?.firstName && patientData?.lastName
                ? `${patientData.firstName} ${patientData.lastName}`
                : 'Patient Name'}
            </Text>
            <View style={styles.contactContainer}>
              <ContactItem
                iconName="call"
                // label="Contact"
                detail={patientData?.mobileNumber || 'No Contact Info'}
              />
            </View>
          </View>
        </View>

        <View style={styles.datePickerCard}>
          <View style={styles.dateHeader}>
            <Text style={styles.selectTimeText}>Select Date</Text>
            <Text style={{ marginLeft: 0 }}>{date_display}</Text>
            <TouchableOpacity onPress={openCalendar}>
              <Icon name="calendar" size={24} color={greenColor} />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            ref={scrollViewRef}
            showsHorizontalScrollIndicator={false}
            style={styles.dateScrollView}>
            <View style={styles.dateContainer}>

              {bookingDate.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateItem,
                    selectedItem === item && styles.selectedItemDate, // Apply selected style if the item is selected
                  ]}
                  onPress={() => {

                    setDate_display(item.display)
                    setSelecteditem(item);
                    onDateChange(item);
                  }}>
                  <Text style={[styles.dateText, { backgroundColor: "#f2f4f4", padding: 3, borderRadius: 10 },
                  selectedItem === item && styles.selectedItemDateText
                  ]}>
                    {item.display.split(' ')[0].replace(/\D/g, '')}
                  </Text>

                  <Text style={[styles.dayText, selectedItem === item && { color: "white" }]

                  }>
                    {item.displayH.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.scrollButtons}>
            <TouchableOpacity onPress={scrollLeft}>
              <Icon name="chevron-back" size={20} color={blackColor} />
            </TouchableOpacity>

            <TouchableOpacity onPress={scrollRight}>
              <Icon name="chevron-forward" size={20} color={blackColor} />
            </TouchableOpacity>
          </View>
        </View>

        {calendarVisible && (
          <View style={styles.overlay}>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={new Date()}
                mode={datePickerMode}
                display="default"
                onChange={onDateSelect}
                minimumDate={new Date()}
              />


            </View>
          </View>
        )}


        <View style={styles.timePickerCard}>
          <View style={styles.timeHeader}>
            <Text style={styles.selectTimeText}>Select Time Slot</Text>
            <Text style={{ color: greenColor, fontWeight: "bold", fontSize: 12 }}>{date_display}</Text>

          </View>


          <View style={[styles.timeHeader, { justifyContent: "flex-start", alignItems: "flex-start", gap: 5 }]}>
            <Icon name="time-outline" size={24} color={greenColor} />

            <Text style={styles.selectTimeText}>
              Time Slots
            </Text>
          </View>
{/*           
          <View style={[styles.timeSlot]}>
            <FlatList
              data={bookingSlot}
              renderItem={({ item, index }) => (


                <View style={styles.timeSlotGrid}>
                  <TouchableOpacity onPress={() => handlePress(item)}

                  >
                    <View
                      style={[styles.timeText,
                      item.selectable === false && { borderColor: 'red', borderWidth: 1 },
                      selectedSlot === item.display && item.selectable !== false && styles.selectedTimeText,
                      ]}
                    >
                      <Text
                        style={[selectedSlot === item.display && { color: "white" }, item.selectable === false && { color: "red" }]}
                      >
                        {item.display}
                      </Text>
                      <Text style={[styles.appointmentCount,
                      selectedSlot === item.display && { backgroundColor: "white" }, item.selectable === false && { backgroundColor: "#cacfd2" }

                      ]}>{item.patientPerSlot}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              key={3}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            />
          </View> */}
          {/*           
          <View style={[styles.timeSlot]}>
            <FlatList
              data={bookingSlot}
              renderItem={({ item }) => (
                <View style={styles.timeSlotGrid}>
                  <TouchableOpacity onPress={() => handlePress(item)}>
                    <View
                      style={[
                        styles.timeText,
                        item.selectable === false && { borderColor: 'red', borderWidth: 1 },
                        selectedSlot === item.display && item.selectable !== false && styles.selectedTimeText,
                      ]}
                    >
                      <Text
                        style={[
                          selectedSlot === item.display && { color: "white" },
                          item.selectable === false && { color: "red" }
                        ]}
                      >
                        {item.display}
                      </Text>

                    
                      {item.selectable !== false && (
                        <Text
                          style={[
                            styles.appointmentCount,
                            selectedSlot === item.display && { backgroundColor: "white" }
                          ]}
                        >
                          {item.patientPerSlot}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              key={3}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            />
          </View> */}

          <View style={[styles.timeSlot]}>
            <FlatList
              data={bookingSlot}
              renderItem={({ item }) => (
                <View style={styles.timeSlotGrid}>
                  <TouchableOpacity onPress={() => handlePress(item)}>
                    <View
                      style={[
                        styles.timeText,
                        item.selectable === false && { borderColor: 'red', borderWidth: 1 },
                        selectedSlot === item.display && item.selectable !== false && styles.selectedTimeText,
                      ]}
                    >
                      <Text
                        style={[
                          selectedSlot === item.display && { color: "white" },
                          item.selectable === false && { color: "red" }
                        ]}
                      >
                        {item.display}
                      </Text>

                    
                      <Text
                        style={[
                          styles.appointmentCount,
                          selectedSlot === item.display && { backgroundColor: "white" },
                          item.selectable === false && { color: 'transparent', backgroundColor: 'transparent' } // Hide text but keep space
                        ]}
                      >
                        {item.selectable !== false ? item.patientPerSlot : "00"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              key={3}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            />
          </View>



          <View style={styles.hr} />
          {/* <View style={[styles.timeHeader,{justifyContent:"flex-start",alignItems:"flex-start",gap:5}]}>
          <Icon name="moon" size={20} color={greenColor} />
            
            <Text style={styles.selectTimeText}>
              Evening Time
            </Text>
          </View>

          <View style={[styles.timeSlot]}>
            <FlatList
              data={bookingSlot}
              renderItem={({ item, index }) => (


                <View style={styles.timeSlotGrid}>
                  <TouchableOpacity onPress={() => handlePress(item)}

                  >
                    <View
                      style={[styles.timeText,
                      item.selectable === false && { borderColor: 'red', borderWidth: 1 },
                      selectedSlot === item.display && item.selectable !== false && styles.selectedTimeText,
                      ]}
                    >
                      <Text
                        style={[selectedSlot === item.display && { color: "white" }, item.selectable === false && { color: "red" }]}
                      >
                        {item.display}
                      </Text>
                      <Text style={[styles.appointmentCount,
                      selectedSlot === item.display && { backgroundColor: "white" }, item.selectable === false && { backgroundColor: "#cacfd2" }

                      ]}>{item.patientPerSlot}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              key={3}
            />
          </View> */}

          <CustomButton
            title=" Book"
            onPress={handleBookforLater}
            style={{ backgroundColor: greenColor }}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default Add_Appointment;

const styles = StyleSheet.create({
  picker: {
    height: 50,
    width: '50%',
  },
  pickerItem: {
    color: greenColor,
    fontSize: 14,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  appointmentCount: {

    textAlign: "center",
    alignItems: "center",
    height: 20,
    width: 20,
    borderRadius: 15,
    backgroundColor: "#cacfd2",



  },
  profileCard: {
    backgroundColor: 'rgba(247, 247, 247, 1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: 'blue',
    shadowOpacity: 0.1,
    shadowRadius: 10,

  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    // fontFamily: 'serif',

  },
  selectedTimeText: {
    color: whiteColor,
    borderWidth: 1,
    backgroundColor: greenColor,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: greenColor,
    marginLeft: 5,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
  },
  datePickerCard: {
    backgroundColor: 'rgba(247, 247, 247, 1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: 'blue',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  dateScrollView: {
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
  },
  selectedItemDate: {
    backgroundColor: greenColor,
  },
  selectedItemDateText: {
    backgroundColor: whiteColor,
  },
  dateItem: {
    backgroundColor: '#ecf0f1',
    paddingTop: 13,
    paddingBottom: 13,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 30,
    margin: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDate: {
    backgroundColor: '#D3D3D3',
    elevation: 5,
    shadowColor: 'blue',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  dateText: {
    fontSize: 18,
    color: '#333',
  },
  dayText: {
    fontSize: 12,
    color: '#666',
  },
  scrollButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  timePickerCard: {
    backgroundColor: 'rgba(247, 247, 247, 1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: 'blue',
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  timeHeader: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  selectTimeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  timeSlotGrid: {
    flex: 1,
    alignItems: 'center',
    marginTop: 5,



  },
  timeSlot: {
    backgroundColor: 'rgba(247, 247, 247, 1)',
    padding: 5,
    borderRadius: 10,
    height: 200,

    // alignItems: 'center',
  },
  timeText: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    gap: 5,
    fontSize: 13,
    color: '#333',
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 7,
    borderRadius: 20,
    textAlign: 'center',
    marginBottom: 10,
  },

  selectedTimeSlot: {
    borderColor: '#000080',
    borderWidth: 2,
    backgroundColor: '#F3E8FF',
  },
  hr: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
});
