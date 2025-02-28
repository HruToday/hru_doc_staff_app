import React, {useCallback, useContext, useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import Header from '../../components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  blackColor,
  grayColor,
  greenColor,
  whiteColor,
} from '../../common/Color';

import BarChartExample from '../../components/Barchart';
import {
  getdashboard,
  getmypatients,
  upcomingAppointments,
} from '../../api/authService';
import {AppContext} from '../../context _api/Context';
import DynamicImageSlider from '../../components/DynamicImageSlider';
import LocationDropdown from '../../components/LocationDropdown';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
// Base sizes to scale from
const BASE_WIDTH = 390;
const BASE_HEIGHT = 840;

const scale = size => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = size => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const CheckDashboard = ({navigation}) => {
  const [fetchdata, setFetchdata] = useState(null);
  const [todayDate, setTodayDate] = useState('');
  const [mypatients, setMypatinets] = useState(null);
  const [show, setShow] = useState(false);
  const {userdata, updateSelectedPatient, loctioncolorupdate} =
    useContext(AppContext);
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [filterdata, setfilterdata] = useState();
  const [mapdata,setMapdata]=useState([])
  const token = userdata?.data?.auth_token;
  useEffect(() => {
    loctioncolorupdate(grayColor);
    const fetchData = async () => {
      const credentials = {token};
      try {
        const response_fordashoard = await getdashboard(credentials);
        // const response_formypatinent = await upcomingAppointments(credentials);
        
         setMapdata(response_fordashoard.yearly_schedule)
        setFetchdata(response_fordashoard.record_nos);
        // setMypatinets(response_formypatinent.patient_list);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchAppointments = async () => {
      credentials = {token: token};
      const response = await upcomingAppointments(credentials);
      setAppointments(response.docs[0].appointments);
    };
    fetchAppointments();
  }, []);

  const DateContainer = ({title, dateText}) => (
    <View style={styles.dateContainer}>
      <Text style={{color: grayColor, fontSize: 14}}>{title}</Text>
      <Text style={styles.dateText}>{dateText}</Text>
    </View>
  );

  const renderPatient = ({item}) => {
    const fullName = item.patientName; // Use the name directly from the data

    const imageUrl = `https://beta.hru.today${item.image}`;

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Work Queue', { screen: 'WorkQueueMain' });
        }}>
        <View style={styles.patientCard}>
          <Image
            source={{uri: imageUrl}} // Use the concatenated image URL
            style={styles.patientImage}
          />
          <View style={styles.patientDetailsContainer}>
            <Text style={styles.patientName}>{fullName}</Text>
            <Text style={styles.patientPhone}>{item.mobileNo}</Text>
            <Text style={styles.appointmentDate}>Appointment: {item.date}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              updateSelectedPatient({
                _id: item.patientId,
                patient_id: item.profileId,
              });
              navigation.navigate('My Patients', { screen: 'Details' });
            }}>
            <Icon name="ellipsis-vertical-outline" size={20} color="#555" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const quickLinksData = [
    {
      id: '1',
      image: require('../../assets/called.png'),
      name: 'Add Appointments',
    },
    {
      id: '2',
      image: require('../../assets/round.png'),
      name: 'Work Queue',
    },
    {
      id: '3',
      image: require('../../assets/group.png'),
      name: 'My Patients',
    },
    // {
    //   id: '4',
    //   image: require('../../assets/vitails.webp'),
    //   name: 'Vitals & Prescription',
    // },
  ];
  const handleBoxPress = item => {
    if (item.name === 'My Patients') {
      
      navigation.navigate('My Patients', { screen: 'MyPatients' });
    }
    if (item.name === 'Add Appointments') {
      navigation.navigate('My Patients', { screen: 'AddPatient' });
     
    }
    if (item.name === 'Work Queue') {
      navigation.navigate('Work Queue', { screen: 'WorkQueueMain' });
      // navigation.navigate('workqueue');
    }
    if (item.name === 'Vitals & Prescription') {
      Alert.alert("Development under process.")
      // navigation.navigate('Prescription', { screen: 'Prescriptions' });
      // navigation.navigate('prescription');
    }
  };
  const images = [
    'https://cdn.dribbble.com/userupload/10482911/file/original-63bd58c7d4b5da580468b8acf583bbdf.jpg?resize=1504x1128&vertical=center',
    'https://www.creativefabrica.com/wp-content/uploads/2021/09/14/Healthcare-and-medical-web-banner-Graphics-17249883-1-1-580x387.jpg',
    'https://www.creativefabrica.com/wp-content/uploads/2021/05/17/Healthcare-medical-web-banner-Graphics-12115584-1-1-580x387.jpg',
  ];
  const handleImagePress = image => {
   
  };
  const getOrdinalSuffix = day => {
    const j = day % 10,
      k = day % 100;
    if (j === 1 && k !== 11) {
      return `${day}st`;
    }
    if (j === 2 && k !== 12) {
      return `${day}nd`;
    }
    if (j === 3 && k !== 13) {
      return `${day}rd`;
    }
    return `${day}th`;
  };

  useEffect(() => {
    const date = new Date();
    const day = date.getDate();
    const formattedDate = `${getOrdinalSuffix(day)} ${date.toLocaleString(
      'en-US',
      {month: 'short'},
    )}, ${date.getFullYear()}`;
    setTodayDate(formattedDate);
  }, [date]);

  const onChange = (event, selectedDate) => {
    setShow(false);

    const day = selectedDate.getDate();
    const formattedSelectedDate = `${getOrdinalSuffix(
      day,
    )} ${selectedDate.toLocaleString('en-US', {
      month: 'short',
    })}, ${selectedDate.getFullYear()}`;
    setTodayDate(formattedSelectedDate);
    setfilterdata(formattedSelectedDate);
  };

  const filteredAppointments = filterdata
    ? appointments.filter(item => item.date === filterdata)
    : appointments;

  return (
    <>
      <LinearGradient
        colors={['white', '#d0ece7']}
        style={styles.gradient}
        // start={{ x: 0, y: 0}}
        end={{x: 3, y: 1}}>
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('new_dashboard');
              }}>
              {/* <Text style={{fontSize:20,color:"black"}}>ForNewDashBoard</Text> */}
            </TouchableOpacity>
            <View style={styles.dateContainer}>
              <LocationDropdown />
              <TouchableOpacity onPress={() => setShow(true)}>
                <Text>{todayDate}</Text>
              </TouchableOpacity>
            </View>
            {show && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
                minimumDate={new Date()}
              />
            )}

            <LinearGradient
              colors={['#fffacd', '#aed6f1']}
              style={styles.gradientsecond}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <View>
                {fetchdata && (
                  <FlatList
                    data={fetchdata}
                    renderItem={({item, index}) => (
                      <View style={styles.recordContainer}>
                        <View style={styles.contentContainer}>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignSelf: 'stretch',
                            }}>
                            <Image
                              source={{uri: item.icon}}
                              style={styles.icon}
                            />
                            <Text style={styles.recordText}>{item.record}</Text>
                          </View>

                          <Text style={styles.remarksText}>{item.remarks}</Text>
                        </View>
                        {/* </ImageBackground> */}
                      </View>
                    )}
                    keyExtractor={item => item._id}
                    numColumns={3}
                    columnWrapperStyle={styles.row}
                  />
                )}
              </View>
            </LinearGradient>

            <DateContainer title="Upcoming Appointments" dateText={''} />

            <View style={[styles.upcomingAppointments, {height: 250}]}>
              {filteredAppointments.length === 0 ? (
                <Text style={{textAlign: 'center', marginTop: 20}}>
                  No Appointments
                </Text>
              ) : (
                <FlatList
                  data={filteredAppointments}
                  renderItem={renderPatient}
                  keyExtractor={item => item.patient_id}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={() => (
                    <View style={styles.rowSeparator} />
                  )}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={5}
                  nestedScrollEnabled={true}
                />
              )}
            </View>

            <DateContainer title="Quick Links" dateText={''} />

            <View style={styles.quicklinks}>
              <FlatList
                data={quickLinksData}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.box}
                    onPress={() => handleBoxPress(item)}>
                    <Image source={item.image} style={styles.boxImage} />
                    <Text style={styles.boxText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                numColumns={4}
                columnWrapperStyle={styles.row}
              />
            </View>
            <DynamicImageSlider
              images={images}
              sliderHeight={150} // Dynamic height
              containerStyle={{marginBottom: 20}}
              onImagePress={handleImagePress} // Callback on image press
              autoScrollInterval={2000} // Automatic scrolling interval (2 seconds)
            />
              <DateContainer title="Yearly Transaction 2025" dateText={''} />

            <View style={{marginRight:10}}>

              <BarChartExample mapdata={mapdata} />
            </View>

            <View>
              <DynamicImageSlider
                images={images}
                sliderHeight={250} // Dynamic height
                containerStyle={{marginBottom: 20}}
                onImagePress={handleImagePress} // Callback on image press
                autoScrollInterval={3000} // Automatic scrolling interval (2 seconds)
              />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1, // Ensures the gradient covers the entire screen
  },
  scrollContainer: {
    paddingBottom: 20, // Add padding for the bottom to ensure space after the last element
  },

  container: {
    flex: 1,
    // backgroundColor: whiteColor,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: moderateScale(12),
    padding: moderateScale(5),
    marginHorizontal: scale(10),
    marginBottom: verticalScale(10),
    marginTop: verticalScale(10),
    // elevation: 2,
    // shadowColor: 'white',
    // shadowOffset: {width: 0, height: verticalScale(2)},
    // shadowOpacity: 0.1,
    // shadowRadius: moderateScale(5),
  },
  titleText: {
    color: 'lightgray',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  dateText: {
    fontSize: moderateScale(14),
    color: grayColor,
    fontWeight: '400',
  },
  recordContainer: {
    flex: 1,
    padding: 2,

    // margin: scale(5),
  },
  recordBox: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(10),
    height: verticalScale(80),
  },
  gradientsecond: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    height: 100,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    backgroundColor: 'white',
    opacity: 0.7,
    padding: 10,
  },
  icon: {
    width: scale(35),
    height: verticalScale(35),
    borderRadius: 10,
    backgroundColor: 'white',
  },
  recordText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(4),
    // color: whiteColor,
  },
  remarksText: {
    fontSize: moderateScale(14),
    color: blackColor,
  },
  upcomingAppointments: {
    paddingHorizontal: scale(10),
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'transparent',
    borderRadius: moderateScale(10),

    // shadowColor: 'blue',
    // shadowOffset: {width: 0, height: verticalScale(2)},
    // shadowOpacity: 0.2,
    // shadowRadius: moderateScale(4),
    padding: moderateScale(10),
  },
  patientImage: {
    width: scale(50),
    height: verticalScale(50),
    borderRadius: scale(25),
  },
  patientDetailsContainer: {
    flex: 1,
    marginLeft: scale(10),
  },
  patientName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: grayColor,
  },
  patientPhone: {
    fontSize: moderateScale(14),
    color: 'gray',
  },
  rowSeparator: {
    height: verticalScale(10),
  },
  quicklinks: {
    paddingHorizontal: scale(10),
  },
  row: {
    justifyContent: 'center',
    gap: 10,
    margin: 10,
    marginBottom: verticalScale(10),
  },
  box: {
    width: '33%',

    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    alignItems: 'center',
    // justifyContent: 'center',
    padding: moderateScale(10),
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: verticalScale(2)},
    // shadowOpacity: 0.2,
    shadowRadius: moderateScale(4),
  },
  boxText: {
    fontSize: moderateScale(12),
    textAlign: 'center',
  },
  boxImage: {
    width: 30, // Set appropriate width
    height: 30, // Set appropriate height
    // Ensure the image fits within the bounds
  },
});

export default CheckDashboard;
