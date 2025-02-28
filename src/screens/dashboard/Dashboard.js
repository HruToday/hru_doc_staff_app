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
} from 'react-native';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  blackColor,
  grayColor,
  greenColor,
  whiteColor,
} from '../../common/Color';

import BarChartExample from '../../components/Barchart';
import {getdashboard, getmypatients} from '../../api/authService';
import {AppContext} from '../../context _api/Context';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
// Base sizes to scale from
const BASE_WIDTH = 390;
const BASE_HEIGHT = 840;

const scale = size => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = size => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const Dashboard = ({navigation}) => {
  const [fetchdata, setFetchdata] = useState(null);
  const [todayDate, setTodayDate] = useState('');
  const [mypatients, setMypatinets] = useState(null);

  const {userdata, updateSelectedPatient} = useContext(AppContext);

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
    setTodayDate(formattedDate);
    const token = userdata?.data?.auth_token;

    const fetchData = async () => {
      const credentials = {token};
      try {
        const response_fordashoard = await getdashboard(credentials);
        const response_formypatinent = await getmypatients(credentials);
        setFetchdata(response_fordashoard.record_nos);
        setMypatinets(response_formypatinent.patient_list);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const DateContainer = ({title, dateText}) => (
    <View style={styles.dateContainer}>
      <Text style={{color: grayColor, fontSize: 14}}>{title}</Text>
      <Text style={styles.dateText}>{dateText}</Text>
    </View>
  );

  const renderPatient = ({item}) => {
    const fullName = `${item.patient_fname} ${
      item.patient_mname ? item.patient_mname + ' ' : ''
    }${item.patient_lname}`;
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('workqueue');
        }}>
        <View style={styles.patientCard}>
          <Image
            source={{uri: item.patient_profile_img}}
            style={styles.patientImage}
          />
          <View style={styles.patientDetailsContainer}>
            <Text style={styles.patientName}>{fullName}</Text>
            <Text style={styles.patientPhone}>{item.patient_phone_no}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              updateSelectedPatient({
                _id: item._id,
                patient_id: item.patient_id,
              });
              navigation.navigate('patient_Details');
            }}>
            <Icon
              name="ellipsis-vertical-outline"
              size={20}
              color={grayColor}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const quickLinksData = [
    {
      id: '1',
      image: require('../../assets/briefcase.webp'),
      name: 'Add Appointments',
    },
    {
      id: '2',
      image: require('../../assets/briefcase.webp'),
      name: 'Work Queue',
    },
    {
      id: '3',
      image: require('../../assets/doctor_suitcase.webp'),
      name: 'My Patients',
    },
    {
      id: '4',
      image: require('../../assets/vitails.webp'),
      name: 'Vitals & Prescription',
    },
  ];
  const handleBoxPress = item => {
    if (item.name === 'My Patients') {
      navigation.navigate('mypatient');
    }
    if (item.name === 'Add Appointments') {
      navigation.navigate('add_newpatient');
    }
    if (item.name === 'Work Queue') {
      navigation.navigate('workqueue');
    }
    if (item.name === 'Vitals & Prescription') {
      navigation.navigate('prescription');
    }
  };

  return (
    <>
      <LinearGradient
        colors={['white', '#d0ece7']}
        style={styles.gradient}
        // start={{ x: 0, y: 0}}
        end={{x: 3, y: 1}}>
        <Header />
        
        <View style={styles.container}>
          {/* <DateContainer title="Current Records" dateText={todayDate} /> */}
          <LinearGradient
            colors={['#fffacd', '#aed6f1']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <View>
              {fetchdata && (
                <FlatList
                  data={fetchdata}
                  renderItem={({item, index}) => (
                    <View style={styles.recordContainer}>
                      {/* <ImageBackground
                    source={{uri: item.background_img}}
                    style={styles.recordBox}> */}
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
                  numColumns={3} // Adjust to fit your design (e.g., 2 or 3)
                  columnWrapperStyle={styles.row}
                />
              )}
            </View>
          </LinearGradient>

          <DateContainer title="Upcoming Appointments" dateText={''} />

          <View style={[styles.upcomingAppointments, {height: 250}]}>
            <FlatList
              data={mypatients}
              renderItem={renderPatient}
              keyExtractor={item => item.patient_id}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View style={styles.rowSeparator} />
              )}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5} // Adjust as needed for better performance
            />
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
          <View style={{margin: 10}}>
            <BarChartExample />
          </View>
        </View>
       
      </LinearGradient>
    </>
  );
};


const styles = StyleSheet.create({
  gradient: {
    flex: 1, // Ensures the gradient covers the entire screen
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
    margin: scale(5),
  },
  recordBox: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(10),
    height: verticalScale(80),
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
    marginBottom: verticalScale(10),
  },
  box: {
    width: '22%',

    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
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

export default Dashboard;
