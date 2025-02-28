import React, {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import SecondHeader from '../../components/SecondHeader';
import General_Info from './General_Info';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  blackColor,
  grayColor,
  greenColor,
  lightbackground,
  whiteColor,
} from '../../common/Color';
import ButtonScroller from './ButtonScroller';
import Symptoms from './Symptoms';
import Leb_report from './Leb_report';
import {AppContext} from '../../context _api/Context';
import {mypatientMedHist, searchpatientbyid} from '../../api/authService';
import DynamicTable from '../../components/DynamicTable';
import Medical_History from './Medical_History';
import PaymentHistory from './PaymentHistory';
import Uploaded_Prescription from './Uploaded_Prescription';
import Upload_Report from './Upload_Report';
import DigitalPrescriptions from './DigitalPrescriptions';

const PatientDetails = ({navigation}) => {
  const [selectedContent, setSelectedContent] = useState('General Info');

  const [selectedSubContent, setSelectedSubContent] = useState('Digital Prescription');
  const {userdata, selectedPatient} = useContext(AppContext);
  const token = userdata?.data?.auth_token;
  const [patient_profile, setPatient_Profile] = useState([]);
  const [patienthistory, setpatienthistory] = useState(null);
  const [prescription, setPrescription] = useState([]);
  const [reports, setReports] = useState([]);
  const [digitalPrescriptions,setDigitalPrescriptions]=useState([])

  const buttons = [
    {id: '1', title: 'General Info'},
    {id: '2', title: 'Prescriptions and Reports'},
    {id: '3', title: 'Medical History'},
    {id: '4', title: 'Payment History'},
  ];

  const Prescriptions_and_Reports = [
    {id: '1', title: 'Digital Prescription'},
    {id: '2', title: 'Uploaded Prescription'},
    {id: '3', title: 'Lab Reports'},

    // {id: '4', title: 'Vaccination Chart'},
    // {id: '5', title: 'Growth Chart'},
  ];

  const headerUploaded_Prescription = [
    'Transaction ID',
    'Date',
    'Time',
    'Action',
  ];
  const headerLab = ['Transaction ID', 'Date', 'Report Name', 'Action'];
 
  const PrescriptionsContent = {
    'Digital Prescription': <DigitalPrescriptions data={digitalPrescriptions}/>,
    'Uploaded Prescription': (
      // <DynamicTable
      //   headerData={headerUploaded_Prescription}
      //   type="prescription"
      //   data={prescription}
      // />
      <Uploaded_Prescription type="prescription" headerData={headerUploaded_Prescription}  data={prescription}/>
    ),
    'Lab Reports': (
      // <DynamicTable headerData={headerLab} data={reports} type="report" />
      <Upload_Report data={reports}/>
    ),
  };
  useEffect(() => {
    if (selectedContent === 'Prescriptions and Reports') {
      setSelectedSubContent('Digital Prescription');
    }
  }, [selectedContent]);
  // useEffect(() => {
  //   const fetchdata = async () => {
  //     if (selectedContent === 'General Info') {
  //       try {
  //         const credentials2 = {
  //           token,
  //           patientId: selectedPatient._id,
  //           profileId: selectedPatient.patient_id,
  //         };
  //         const response2 = await searchpatientbyid(credentials2);
  //         setPatient_Profile(response2.docs);
  //         const credentials = {
  //           token,
  //           _id: selectedPatient._id,
  //           patient_id: selectedPatient.patient_id,
  //         };
  //         const response = await mypatientMedHist(credentials);
         
         
          
  //         setPrescription(response.doc.prescriptions);
  //         setReports(response.doc.reports);
  //         setDigitalPrescriptions(response.doc.digitalPrescriptions)

        
  //       } catch (error) {
  //         console.log('Error fetching medical history:', error.message);
  //       }
  //     }
  //   };
  //   fetchdata();
  // }, [selectedContent, selectedPatient, token]);

  
  

  return (
    <>
     

      <View style={styles.container}>
        <View>
          <ButtonScroller
           scrollview={{
          
            marginTop:10 ,
          }}
            buttons={buttons}
            selectedButton={selectedContent}
            selectedButtonStyle={{backgroundColor: greenColor}}
            selectedButtonTextStyle={{color: 'white'}}
            onButtonPress={title => {
              setSelectedContent(title);
              if (title !== 'Medical History') {
                setSelectedSubContent('');
              }
            }}
          />
        </View>
        {selectedContent === 'Prescriptions and Reports' ? (
          <View>
            <View style={styles.profileContainer}>
              <View style={styles.profileLeft}>
                <Image
                  source={{
                    uri: patient_profile[0]?.imgUrl?.path
      ? `https://beta.hru.today/show-uploaded.image?path=${patient_profile[0].imgUrl.path}`
      : "https://beta.hru.today/patient/:6666aad855ccd35496ffeb37/6666aba455ccd35496ffeb38/display.image", // Show null or a placeholder image when imgUrl does not exist
                  }}
                  style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.userName}>
                    {patient_profile[0].firstName} {patient_profile[0].lastName}
                  </Text>

                  <View style={{flexDirection: 'row', gap: 9}}>
                    <Icon name="mobile" size={20} color="#4F8EF7" />
                    <Text style={styles.userPhone}>
                      {patient_profile[0].mobileNumber}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.messageIcon}>
                <Ionicons
                  name="chatbubble-outline"
                  size={30}
                  color={greenColor}
                />
              </TouchableOpacity>
            </View>
            <View>
              <ButtonScroller
                scrollview={{
                  backgroundColor: whiteColor,
                  padding: 10,
                  marginTop: 2,
                }}
                buttons={Prescriptions_and_Reports}
                selectedButton={selectedSubContent}
                onButtonPress={setSelectedSubContent}
                selectedButtonStyle={{backgroundColor: greenColor}}
                selectedButtonTextStyle={{color: 'white'}}
              />
            </View>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {selectedContent === 'Medical History' && (
              <Medical_History  />
            )}
            {selectedContent === 'Payment History' && (
              <PaymentHistory patient_profile={patient_profile[0]} />
            )}
            {selectedContent === 'General Info' && <General_Info navigation={navigation} />}
          </View>
        )}

        {selectedContent === 'Prescriptions and Reports' && (
          <View style={styles.contentContainer}>
            {selectedSubContent
              ? PrescriptionsContent[selectedSubContent]
              : PrescriptionsContent['Digital Prescription']}
          </View>
        )}
      </View>
    </>
  );
};

export default PatientDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightbackground,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: whiteColor,
    padding: 7,
    borderRadius: 8,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop:5,
  },
  contentText: {
    fontSize: 18,
    color: blackColor,
    textAlign: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -1,
    backgroundColor: whiteColor,
    // borderRadius: 50,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    backgroundColor: greenColor,
    width: 70,
    height: 70,
    borderRadius: 50,
    margin: 20,
  },
  profileInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 16,
    // fontWeight: 'bold',
    color: blackColor,
  },
  userPhone: {
    fontSize: 14,
    color: blackColor,
  },
  messageIcon: {
    margin: 20,
  },
});
