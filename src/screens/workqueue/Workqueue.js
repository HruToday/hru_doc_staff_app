import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import SecondHeader from '../../components/SecondHeader';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/FontAwesome6';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  blackColor,
  grayColor,
  greenColor,
  whiteColor,
} from '../../common/Color';
import BackgroundWrapper from '../../common/BackgroundWrapper';
import { AppContext } from '../../context _api/Context';
import { cancelCheckIn, getworkqueue, noshow } from '../../api/authService';
import PaymentModal from '../../components/Check_in';
import Charge_invoice from '../../components/Charge_invoice';
import BookingConfirmationModal from '../../components/OnlineBookingModel';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PdfViewer from '../../components/PdfViewer';
import DropDowns from '../../components/DropDowns';
import Header from '../../components/Header';
const Workqueue = ({ navigation }) => {
  const {

    selectedClinic,
    selectedDoctor,
    digital_PrescriptionButton,
    userdata,
    loctioncolorupdate,
    workqueuebutton,
    workqueuebuttons,
    workqueueCencelbutton,
    workqueueCencelbuttons,
    updateSelectedPatient,
    Digital_ID,
    CheckIN_Data,
    selectedLocationId,
    ItemData,
    refreshdata,
    refreshPage,
  } = useContext(AppContext);
  const followupDays = userdata.data.followupDays;
  console.log(followupDays);

  const today = new Date();
  const startingDate = new Date();
  startingDate.setDate(today.getDate());
  const [refreshWorkQueue, setRefreshWorkQueue] = useState(false);
  const [fromDate, setFromDate] = useState(startingDate);
  const [toDate, setToDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(null);
  const [workqueuedata, setWorkqueuedata] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [Charge_invoicemodel, setCharge_invoicemodel] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [onlinebooking, setOnlineBooking] = useState(false)
  const [selectedPdf, setSelectedPdf] = useState(null);

  const handleButtonPress = item => {
    setSelectedItemId(item._id);

    // Navigate to the PrescriptionStack and then to the manual_prescription screen
    navigation.navigate('Work Queue', {
      screen: 'manual_prescription',
      params: { appointmentId: item._id, item: item },
    });

  };

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(null);
    if (event.type === 'dismissed') return;
    if (showPicker === 'from') setFromDate(selectedDate);
    if (showPicker === 'to') setToDate(selectedDate);
  };

  const formatDate = date => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };


  const formatDay = date => {
    const options = { weekday: 'long', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };
  // datecolom

  const DateColumn = ({ label, date, style, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.dateColumn, style]}>
      <Text style={styles.dateLabel}>{label}</Text>
      <View style={styles.dateDetailsContainer}>
        <Text style={styles.dateNumber}>{date.getDate()}</Text>
        <View>
          <Text style={styles.dayText}>{formatDay(date)}</Text>
          <Text style={styles.monthYearText}>
            {formatDate(date).split(' ').slice(2).join(' ')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Helper function to get the day suffix (st, nd, rd, th)
  function getDaySuffix(day) {
    if (day > 3 && day < 21) return 'th'; // Handle 11th, 12th, 13th etc.
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  const currentDate = new Date().toISOString();

  const handleNoShow = async (item) => {
    const currentDate = new Date().toISOString(); // Get current time in ISO format
    const credentials = {
      token: item.token,
      noShow: true,
      noShowDate: currentDate,
      status: 99,
      appointmentId: item._id
    };

    try {
      const response = await noshow(credentials);
    
      if (response.msg === "Ok") {
        setRefreshWorkQueue(prev => !prev);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const renderRow = ({ item }) => {
    let imageSource;
    if (item.appointment === 'DOCTOR') {
      imageSource = <Icons name="person-walking-arrow-right" size={22} color="gray" style={styles.doctorImage} />
    } else if (item.appointment === 'PATIENT') {
      imageSource = <Icons name="mobile-screen" size={22} color="gray" style={styles.doctorImage} />
    }

    return (
      <View style={styles.cardContainer}>
        <View style={styles.rowContainer}>
          <Image source={item.photo} style={styles.photo} />

          <View style={styles.patientInfoContainer}>
            <TouchableOpacity onPress={(() => {


              updateSelectedPatient({
                _id: item.patientId,
                patient_id: item.profileId,
              });
              navigation.navigate('My Patients', { screen: 'Details' });
            })}>
              <Text
                style={
                  styles.patientName
                }>{`${item.firstName} ${item.lastName}`}</Text>
            </TouchableOpacity>

            {/* <View style={styles.locationRow}>
              <Icon name="mobile" size={18} color={greenColor} />
              <Text style={styles.locationText}>{item.mobileNumber}</Text>
            </View> */}
            <View style={styles.dateTimeRow}>
              <Icon name="calendar" size={10} color={greenColor} />

              <Text style={styles.dateText}>
                {new Date(item.date).toLocaleDateString()} at{' '}
                {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
              </Text>
              
            </View>

            {/* <Text style={styles.infoText}>{item.info}</Text> */}
            <View style={styles.dateTimeRow}>
            <Icon name="user-md" size={12} color={greenColor} />
                <Text style={styles.dateText}>{item.doctorDetails.doctorType }{item.doctorDetails.firstName} {item.doctorDetails.lastName}</Text>
              </View>
              <View style={styles.dateTimeRow}>
            <Icon name="map-marker" size={12} color={greenColor} />
                <Text style={styles.dateText}>{item.doctorDetails.clinicName }</Text>
              </View>
          </View>
          

          <View>
            {imageSource}
          </View>
        </View>

        <View style={styles.buttonsRow}>
          {item.isCheckedIn ? (
            <>
              {item.isCharge && item.status === 2 ? (
                <>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    {/* First Row */}
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View
                          style={{
                            backgroundColor: '#1f8346',
                            borderRadius: 20,
                            padding: 2,
                          }}
                        >
                          <Ionicons name={'checkmark'} size={20} color="white" />
                        </View>
                        <Text style={[styles.actionButtonText, { color: 'black', fontSize: 10 }]}>
                          {new Date(item.date).toLocaleDateString()} at{' '}
                          {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}


                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          const url = `https://beta.hru.today/doctor/${item._id}/prescription.pdf`
                          setSelectedPdf(url);


                        }}
                        style={{ alignItems: "center", borderRadius: 10, borderColor: greenColor, borderWidth: 1, margin: 5 }}
                      >
                        <Text>View Prescription</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Second Row */}
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View
                          style={{
                            backgroundColor: '#1f8346',
                            borderRadius: 20,
                            padding: 2,
                          }}
                        >
                          <Ionicons name={'checkmark'} size={20} color="white" />
                        </View>
                        <Text style={[styles.actionButtonText, { color: 'black', fontSize: 10 }]}>
                          {new Date(item.date).toLocaleDateString()} at{' '}
                          {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </Text>
                      </View>
                      <TouchableOpacity style={{ alignItems: "center", borderRadius: 10, borderColor: greenColor, borderWidth: 1, margin: 5 }}
                        onPress={() => {
                          const url = `https://beta.hru.today/doctor/${item._id}/receipt.pdf`
                          setSelectedPdf(url);


                        }}
                      >

                        <Text >View Invoice
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  {/* Buttons Section */}
                  {workqueuebutton[item._id] !== 'Edit Prescription' && !item.prescriptionUpload && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setSelectedItemId(item._id);
                        ItemData(item),
                          navigation.navigate('Prescriptions', {
                            appointmentId: item._id, followupDays: item.followupDays, gender: item.gender, healthScheme: item.healthScheme,
                          }


                          )
                      }
                      }
                    >
                      <Text style={styles.actionButtonText}>
                        {selectedItemId === item._id
                          ? 'Digital Prescription'
                          : digital_PrescriptionButton[item._id] || 'Digital Prescription'}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleButtonPress(item)}
                  >
                    <Text style={styles.actionButtonText}>
                      {selectedItemId === item._id
                        ? 'Manual Prescription'
                        : workqueuebutton[item._id] || 'Manual Prescription'}
                    </Text>
                  </TouchableOpacity> */}
                  {!item.isPrescription && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleButtonPress(item)}
                    >
                      <Text style={styles.actionButtonText}>
                        {selectedItemId === item._id
                          ? 'Manual Prescription'
                          : workqueuebutton[item._id] || 'Manual Prescription'}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {workqueuebutton[item._id] === 'Edit Prescription' || item.prescriptionUpload || item.isPrescription ? (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        CheckIN_Data(item);
                        setCharge_invoicemodel(true);
                      }}
                    >
                      <Text style={styles.actionButtonText}>Charge & Invoice</Text>
                    </TouchableOpacity>
                  ) : null}
                  {/* <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      CheckIN_Data(item);
                      setCharge_invoicemodel(true);
                    }}
                  >
                    <Text style={styles.actionButtonText}>Charge & Invoice</Text>
                  </TouchableOpacity> */}
                </>
              )}
            </>
          ) : (

            <>
              {item.noShow === true && item.status === 99 ? (
                <>

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View>
                        <Ionicons name={'eye-off'} size={20} color="gray" />
                      </View>
                      <Text style={[styles.actionButtonText, { color: 'black', fontSize: 8 }]}>
                        {new Date(item.date).toLocaleDateString()} at{' '}
                        {new Date(item.date).toLocaleTimeString()}
                      </Text>
                    </View> */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View>
                        <Ionicons name={'eye-off'} size={20} color="gray" />
                      </View>
                      <Text style={[styles.actionButtonText, { color: 'black', fontSize: 8 }]}>
                        {new Date(item.date).toLocaleDateString()} at{' '}
                        {new Date(item.date).toLocaleTimeString()} {`${item.firstName} ${item.lastName}`} did not show up
                      </Text>
                    </View>
                  </View>
                </>
              ) : item.cancelCheckIn ? (
                <>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View
                        style={{
                          backgroundColor: 'rgb(132, 35, 35)',
                          borderRadius: 20,
                          padding: 2,
                        }}
                      >
                        <Ionicons name={'close'} size={20} color="white" />
                      </View>
                      <Text style={[styles.actionButtonText, { color: 'black', fontSize: 10 }]}>
                        {new Date(item.date).toLocaleDateString()} at{' '}
                        {new Date(item.date).toLocaleTimeString()}
                      </Text>
                    </View> */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View
                        style={{
                          backgroundColor: 'rgb(132, 35, 35)',
                          borderRadius: 20,
                          padding: 2,
                        }}
                      >
                        <Ionicons name={'close'} size={20} color="white" />
                      </View>
                      {item.status === -2 ? (
                        <Text style={[styles.actionButtonText, { color: 'black', fontSize: 10 }]}>
                          {new Date(item.date).toLocaleDateString()} at{' '}
                          {new Date(item.date).toLocaleTimeString()} Cancelled By You
                        </Text>
                      ) : (
                        <Text style={[styles.actionButtonText, { color: 'black', fontSize: 10 }]}>
                          {new Date(item.date).toLocaleDateString()} at{' '}
                          {new Date(item.date).toLocaleTimeString()} Cancelled By{' '}
                          {`${item.firstName} ${item.lastName}`}
                        </Text>
                      )}
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      if (item.onlineAppointment) {
                        setOnlineBooking(true);
                        CheckIN_Data(item);
                      } else {
                        CheckIN_Data(item);
                        setModalVisible(true);
                      }
                    }}
                  >
                    <Text style={styles.actionButtonText}>
                      {workqueueCencelbutton[item._id] || 'Check In'}
                    </Text>
                  </TouchableOpacity>
                  {item.pastDate && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleNoShow(item)}
                    >
                      <Text style={styles.actionButtonText}>
                        {workqueueCencelbutton[item._id] || 'No Show'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handlecancel(item._id)}
                  >
                    <Text style={styles.actionButtonText}>
                      {workqueueCencelbutton[item._id] || 'Cancel'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </>

          )}
        </View>


      </View>
    );
  };




  const sendformdate = new Date(fromDate);
  const sendtodate = new Date(toDate);
  const prevStartDate = useRef(null);
  const prevEndDate = useRef(null);


  const onSearch = searchText => {
    if (searchText) {
      const filtered = workqueuedata.filter(item =>
        `${item.firstName} ${item.lastName}`
          .toLowerCase()
          .includes(searchText.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(workqueuedata); // Reset to full data if no search input
    }
  };



  const handlecancel = async item => {
    const token = userdata?.data?.token;
    const credentials = {
      token: token,
      cancelCheckIn: true,
      cancelCheckInDate: new Date().toISOString(),
      status: -2,
      appointmentId: item,
    };
console.log("credentials",credentials);

    try {
      const response = await cancelCheckIn(credentials);
      console.log("response",response);
      
      if (response.msg === 'Ok') {
        setRefreshWorkQueue(prev => !prev);
        // workqueueCencelbuttons(item, '✖');
      }

    } catch (error) {
      console.log(error.massage);
    }
  };
  useEffect(() => {

    const start_date = sendformdate.toISOString().split('T')[0];
    const starttimestamp = new Date(start_date).getTime();


    const end_date = sendtodate.toISOString().split('T')[0];
    const endtimestamp = new Date(end_date).getTime();
   
    loctioncolorupdate('white');

    if (start_date !== prevStartDate.current || end_date !== prevEndDate.current || refreshWorkQueue) {
      const token = userdata?.data?.token;

      const fetchData = async () => {
        const credentials = {
          token, start: starttimestamp, end: endtimestamp,
          clinicId: selectedClinic.length > 0 ? selectedClinic : "ALL",
          doctorId: selectedDoctor.length > 0 ? selectedDoctor : "ALL",
          ...((selectedClinic.length === 0 || selectedDoctor.length === 0) && {
            doctorIds: userdata?.data?.doctorIds
          })
         
        };

        console.log("credentials", credentials);



        setIsLoading(true);
        try {
          const response_forgetworkqueue = await getworkqueue(credentials);
          console.log(response_forgetworkqueue);







          if (response_forgetworkqueue?.docs) {
            const extractedPatientDetails = [];
            const baseUrl = 'https://beta.hru.today/show-uploaded.image?path=';
            const defaultphoto =
              'https://beta.hru.today/patient/673dc3a68223d1d1cded960a/673dc3a68223d1d1cded960c/display.image';

            response_forgetworkqueue.docs.forEach(doc => {
              const imgPath = doc.patientDetails?.imgUrl?.path;
              const isCheckedIn = doc.isCheckedIn;
              const uniqe_id = doc._id;
              const status = doc.status;
              const patientId = doc.patientId;
              const profileId = doc.profileId;
              const checkInDate = doc.checkInDate;
              const validTillDate = doc.validTillDate;
              const invoice = doc.invoice;
              const doctorDetails = doc.doctorDetails;
              const gender = doc.patientDetails.gender




              if (doc.onlineAppointment || doc.cancelCheckIn || doc.noShow || doc.isCharge || doc.prescriptionUpload || doc.isPrescription || doc.doctorDetails.followupDays
                || doc.advice || doc.complaints || doc.complaintsMetaData || doc.diagnosis || doc.diagnosisMetaData || doc.dietToAvoid || doc.dietToConsume || doc.followupUnit || doc.procedureMetaData || doc.procedures
                || doc.vital || doc.labs || doc.medicineIntake || doc.notes || doc.clinicHospital || doc.specialistName
              ) {
                extractedPatientDetails.push({
                  ...doc.patientDetails,
                  photo: { uri: defaultphoto ? `${baseUrl}${imgPath}` : null },
                  name: `${doc.patientDetails.firstName} ${doc.patientDetails.lastName}`,
                  mobileNumber: doc.patientDetails.mobileNumber,
                  date: doc.startTime,
                  gender: gender,
                  appointment: doc.bookedBy,
                  info: doc.bookingId,
                  isCheckedIn: isCheckedIn,
                  _id: uniqe_id,
                  status: status,
                  patientId: patientId,
                  profileId: profileId,
                  checkInDate: checkInDate,
                  validTillDate: validTillDate,
                  invoice: invoice,
                  doctorDetails: doctorDetails,
                  token: token,
                  onlineAppointment: doc.onlineAppointment,
                  otp: doc.otp,
                  pastDate: doc.pastDate,
                  cancelCheckIn: doc.cancelCheckIn,
                  noShow: doc.noShow,
                  isCharge: doc.isCharge,
                  prescriptionUpload: doc.prescriptionUpload,
                  isPrescription: doc.isPrescription,
                  followupDays: doc.doctorDetails.followupDays,
                  advice: doc.advice,
                  complaints: doc.complaints,
                  complaintsMetaData: doc.complaintsMetaData,
                  diagnosis: doc.diagnosis,
                  diagnosisMetaData: doc.diagnosisMetaData,
                  dietToAvoid: doc.dietToAvoid,
                  dietToConsume: doc.dietToConsume,
                  followupUnit: doc.followupUnit,
                  procedureMetaData: doc.procedureMetaData,
                  procedures: doc.procedures,
                  vital: doc.vital,
                  labs: doc.labs,
                  medicineIntake: doc.medicineIntake,
                  notes: doc.notes,
                  clinicHospital: doc.clinicHospital,
                  specialistName: doc.specialistName


                });
              } else {
                extractedPatientDetails.push({
                  ...doc.patientDetails,
                  photo: { uri: defaultphoto ? `${baseUrl}${imgPath}` : null },
                  name: `${doc.patientDetails.firstName} ${doc.patientDetails.lastName}`,
                  mobileNumber: doc.patientDetails.mobileNumber,
                  date: doc.endTime,
                  appointment: doc.bookedBy,
                  gender: gender,
                  info: doc.bookingId,
                  isCheckedIn: isCheckedIn,
                  _id: uniqe_id,
                  status: status,
                  patientId: patientId,
                  profileId: profileId,
                  checkInDate: checkInDate,
                  validTillDate: validTillDate,
                  invoice: invoice,
                  doctorDetails: doctorDetails,
                  token: token,
                  pastDate: doc.pastDate,
                  cancelCheckIn: doc.cancelCheckIn,
                  noShow: doc.noShow,
                  isCharge: doc.isCharge,
                  prescriptionUpload: doc.prescriptionUpload,
                  isPrescription: doc.isPrescription,
                  followupDays: doc.doctorDetails.followupDays,
                  advice: doc.advice,
                  complaints: doc.complaints,
                  complaintsMetaData: doc.complaintsMetaData,
                  diagnosis: doc.diagnosis,
                  diagnosisMetaData: doc.diagnosisMetaData,
                  dietToAvoid: doc.dietToAvoid,
                  dietToConsume: doc.dietToConsume,
                  followupUnit: doc.followupUnit,
                  procedureMetaData: doc.procedureMetaData,
                  procedures: doc.procedures,
                  vital: doc.vital,
                  labs: doc.labs,
                  medicineIntake: doc.medicineIntake,
                  notes: doc.notes,
                  clinicHospital: doc.clinicHospital,
                  specialistName: doc.specialistName

                });
              }
            });

            setWorkqueuedata(extractedPatientDetails);
            setFilteredData(extractedPatientDetails);
          } else {
            if (response_forgetworkqueue?.msg === "No data found in workqueue")
              setWorkqueuedata([]);
            setFilteredData([]);
            console.log('Docs array is missing in the response.');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
          if (refreshWorkQueue) {
            setRefreshWorkQueue(false);
          }
        }
      };

      fetchData();
      prevStartDate.current = start_date;
      prevEndDate.current = end_date;
    }
  }, [sendformdate, sendtodate, userdata, selectedLocationId,], refreshWorkQueue,);

  const onVerified = () => {
    setModalVisible(true)
  }
  useEffect(() => {

    setRefreshWorkQueue(prev => !prev);
  }, [selectedLocationId])
  useEffect(() => {

    setRefreshWorkQueue(prev => !prev);
    refreshPage(false)
  }, [refreshdata])




  return (
    <>
 <Header />
      <SecondHeader
        title="Work Queue"
        topBarStyle={{ justifyContent: 'space-between', gap: 25 }}
        titlecss={{ marginRight: "auto" }}
        showSearch={true}
        onSearch={onSearch}
      />
      <DropDowns />
      <View style={{ flex: 1 }}>
        <BackgroundWrapper
          backgroundImage={require('../../assets/background.jpg')}
        />
        <View style={styles.dateRangeContainer}>
          <DateColumn
            label="From Date"
            date={fromDate}
            onPress={() => setShowPicker('from')}
          />
          <TouchableOpacity
            style={styles.calendarButton}
            onPress={() => setShowPicker('from')}>
            <Icon name="calendar" size={30} color={greenColor} />
          </TouchableOpacity>
          <DateColumn
            label="To Date"
            date={toDate}
            onPress={() => setShowPicker('to')}
          />
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>Patients Info</Text>
          <Text style={styles.resultsCount}>
            {workqueuedata ? `${workqueuedata.length} Results` : 'No Results'}
          </Text>
        </View>

        {/* <View style={{ flex: 1 }}>
          {isLoading ? (

            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={greenColor} />
            </View>
          ) : (
            <FlatList

              data={filteredData}
              keyExtractor={item => item._id}
              renderItem={renderRow}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}

        </View> */}


        <View style={{ flex: 1 }}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={greenColor} />
            </View>
          ) : workqueuedata.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Image
                source={{ uri: 'https://beta.hru.today/images/noPatient.png' }}
                style={styles.emptyImage}
                resizeMode="contain"
              />
              <Text style={styles.emptyText}>There are no patient in your queue right now</Text>
            </View>
          ) : (
            <FlatList
              data={filteredData}
              keyExtractor={item => item._id}
              renderItem={renderRow}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>


        {showPicker && (
          <DateTimePicker
            value={showPicker === 'from' ? fromDate : toDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('My Patients', { screen: 'AddPatient' })}>
        <Icon name="plus" size={18} color={whiteColor} />
        <Text style={styles.floatingButtonText}>Add Patient</Text>
      </TouchableOpacity>
      <PaymentModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setRefreshWorkQueue(prev => !prev);
        }}
      />
      <Charge_invoice
        visible={Charge_invoicemodel}
        onClose={() => {
          setCharge_invoicemodel(false)
          setRefreshWorkQueue(prev => !prev);

        }}
      />
      <BookingConfirmationModal
        isVisible={onlinebooking}
        onClose={() => {
          setOnlineBooking(false);

        }}
        onVerified={onVerified}
      />
      <Modal
        visible={!!selectedPdf}
        animationType="slide"
        onRequestClose={() => setSelectedPdf(null)}>
        <PdfViewer pdfUrl={selectedPdf} />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setSelectedPdf(null)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </Modal>

    </>
  );
};

export default Workqueue;

const styles = StyleSheet.create({
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: grayColor,
  },
  dateDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: blackColor,
    marginRight: 8,
  },
  dayText: {
    fontSize: 14,
    color: grayColor,
  },
  monthYearText: {
    fontSize: 14,
    color: grayColor,
  },
  calendarButton: {
    padding: 10,
    backgroundColor: whiteColor,
    borderRadius: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: blackColor,
  },
  resultsCount: {
    fontSize: 14,
    color: greenColor,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    backgroundColor: whiteColor,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: 'blue',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  doctorImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    top: -30,
    right: 10,

  },
  patientInfoContainer: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: blackColor,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    marginLeft: 5,
    fontSize: 14,
    color: grayColor,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  dateText: {
    marginLeft: 5,
    fontSize: 14,
    color: grayColor,
  },
  timeText: {
    marginLeft: 10,
    fontSize: 14,
    color: grayColor,
  },
  infoText: {
    marginVertical: 10,
    fontSize: 14,
    color: grayColor,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  actionButton: {
    borderColor: greenColor,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginTop: 5
  },
  actionButtonText: {
    fontSize: 14,
    color: greenColor,
    textAlign: 'center',
  },

  floatingButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: greenColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  floatingButtonText: {
    color: whiteColor,
    fontSize: 14,

    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: greenColor,
  },
});
