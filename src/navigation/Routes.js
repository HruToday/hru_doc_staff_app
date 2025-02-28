import React, { useContext, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Text, Image, Alert, TouchableOpacity, Modal } from 'react-native';
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/Ionicons';
import Login from '../screens/user/Login';
import Forgetpassword from '../screens/user/Forgetpassword';
import Changepassword from '../screens/user/Changepassword';
import Dashboard from '../screens/dashboard/Dashboard';
import Patients from '../screens/mypatient/Patients';
import Addpatients from '../screens/mypatient/Addpatients';
import Add_Appointment from '../screens/appointment/Add_Appointment';
import Workqueue from '../screens/workqueue/Workqueue';
import Prescription from '../screens/prescription/Prescription';
import Vitals from '../screens/prescription/Vitals';
import Symptoms from '../screens/prescription/Symptoms';
import Medication from '../screens/prescription/Medication';
import Charge_invoice from '../screens/prescription/Charge_invoice';
import PatientDetails from '../screens/patientDetails/PatientDetails';

import CheckDashboard from '../screens/dashboard/CheckDashboard';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/FontAwesome6';
import { grayColor, greenColor, whiteColor } from '../common/Color';
import Info_Booking from '../screens/mypatient/Info_Booking';
import FamilyMembers from '../screens/mypatient/FamilyMembers';
import ManualPrescription from '../screens/prescription/ManualPrescription';
import NewDashboard from '../screens/dashboard/NewDashboard';
import EditProfile from '../screens/mypatient/EditProfile';
import AddFamily_member from '../screens/mypatient/AddFamily_member';
import General_Info from '../screens/patientDetails/General_Info';
import Diagnosis from '../screens/prescription/Diagnosis';
import Procedures from '../screens/prescription/Procedures';
import Complaints from '../screens/prescription/Complaints';
import LabTest from '../screens/prescription/LabTest';
import Diet from '../screens/prescription/Diet';
import Refer from '../screens/prescription/Refer';
import FollowUp from '../screens/prescription/FollowUp';
import Advice from '../screens/prescription/Advice';
import LMP from '../screens/prescription/Lmp';
import { AppContext } from '../context _api/Context';
import { saveprescriptiondetailspreviewjson } from '../api/authService';
import PdfViewer from '../components/PdfViewer';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={greenColor} />
  </View>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="login" component={Login} />
    <Stack.Screen name="forget" component={Forgetpassword} />
    <Stack.Screen name="reset" component={Changepassword} />
  </Stack.Navigator>
);

const DashboardTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Dashboard') {
          iconName = 'grid';
        } else if (route.name === 'Work Queue') {
          iconName = 'briefcase-outline';
        } else if (route.name === 'My Patients') {
          iconName = 'medkit-outline';
        } else if (route.name === 'Appointments') {
          iconName = 'calendar-outline';
        } else if (route.name === 'Prescription') {
          iconName = 'newspaper-outline';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eaeaea',
        elevation: 5,
      },
      tabBarActiveTintColor: 'lightblue',
      tabBarInactiveTintColor: greenColor,
      headerShown: false,
    })}>
    
    {/* <Tab.Screen name="Dashboard" component={DashboardStack} /> */}
    <Tab.Screen name="Work Queue" component={WorkqueueStack} />
    <Tab.Screen name="My Patients" component={PatientsStack} />
    {/* <Tab.Screen name="Prescription" component={PrescriptionStack} /> */}
    {/* <Tab.Screen name="Prescription" component={ Alert.alert("Development under process.")} /> */}
  </Tab.Navigator>
);


const DashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: greenColor },
      headerTintColor: whiteColor,
      headerTitleStyle: { fontSize: 18 },
    }}>
    <Stack.Screen
      name="CheckDashboard"
      component={CheckDashboard}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const WorkqueueStack = ({ navigation }) => {
  // const {navigation}=useNavigation()
  const { userdata, digital_id, digital_Prescription } = useContext(AppContext);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  function getCurrentDateInFormats() {
    const date = new Date();

    // Format: YYYY-MM-DDTHH:mm:ss.sssZ
    const isoDate = date.toISOString();

    // Format: DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    const customDate = `${day}/${month}/${year}`;

    return { isoDate, customDate };
  }
  const formatDateToISO = (dateString) => {
    // Split the date string (assuming "DD/MM/YYYY" format)
    const [day, month, year] = dateString.split("/");

    // Create a new Date object (UTC timezone)
    const date = new Date(Date.UTC(year, month - 1, day, 18, 30, 0));

    // Convert to ISO string
    return date.toISOString();
  };



  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const token = userdata?.data?.auth_token;
    try {
      const prescriptionId = Object.keys(digital_Prescription)?.[0]; // Get the first dynamic key (ID)
      const prescriptionData = digital_Prescription?.[prescriptionId] || {};


      const { isoDate } = getCurrentDateInFormats();
      const appointmentId = digital_id?.appointmentId || "";

      const baseCredentials = {
        token: token || "",
        appointmentId,
        vitalDate: isoDate || "",
        complaints: [],
        diagnosis: [],
        procedures: [],
        examination: [],
        medicineIntake: [],
        labs: [],
        advice: [],
        dietToAvoid: [],
        dietToConsume: [],
        customFieldOneValue: [],
        customFieldTwoValue: [],
        customFieldThreeValue: [],
        customFieldFourValue: [],
        customFieldFiveValue: [],
        customFieldSixValue: [],
        prescriptionStartDate: isoDate,
        followupDays: digital_id?.followupDays || "",
        followupUnit: "Day",
        medicalHistoryData: {},
      };

      let extraFields = {};

      if (Object.keys(prescriptionData).length > 0) {

        const labTests =
          prescriptionData?.labtest?.map((item) => ({
            testLabName: item.product_name,
          })) || [];

        extraFields = {
          weight: prescriptionData?.weight || "",
          height: prescriptionData?.height || "",
          bpSystolic: prescriptionData?.bpSystolic || "",
          bpDiastolic: prescriptionData?.bpDiastolic || "",
          pulse: prescriptionData?.pulse || "",
          bodyTemp: prescriptionData?.bodyTemp || "",
          bmi: prescriptionData?.bmi || "",
          bmiStatus: prescriptionData?.bmiStatus || "",
          bloodSugarTest: prescriptionData?.bloodSugar || "",
          sugarLevel: prescriptionData?.sugarLevel || "",
          complaints: prescriptionData?.Complaints || [],
          diagnosis: prescriptionData?.Diagnosis || [],
          procedures: prescriptionData?.Procedures || [],
          medicineIntake: prescriptionData?.medications || [],
          labs: labTests || [],
          advice: prescriptionData?.advice || [],
          dietToAvoid: prescriptionData?.diet?.avoid || [],
          dietToConsume: prescriptionData?.diet?.consume || [],
          consultDietitian:prescriptionData?.diet?.chek,
          otherNote: prescriptionData?.otherNote || "",
          respiration: prescriptionData?.spo2 || "",
          specialistName: prescriptionData?.referdata?.specialistName,
          notes: prescriptionData?.referdata?.notes,
          clinicHospital: prescriptionData?.referdata?.clinicHospital,
        };
      }

      const credentials = { ...baseCredentials, ...extraFields };
      const followupText = prescriptionData?.followup?.text?.trim();
      const inputDate = prescriptionData?.followup?.date;
      let isoFormattedDate = null; // Default value

      if (inputDate && inputDate !== false) {
        isoFormattedDate = formatDateToISO(inputDate);
      }
      if (prescriptionData?.followup?.date === false) {
        credentials.followupDays = followupText || digital_id?.followupDays || "";
        credentials.followupUnit = prescriptionData?.followup?.dosage || "days";

      } else {
        credentials.followupDate = isoFormattedDate;
      }
      if (credentials.followupDate) {
        delete credentials.followupDays;
        delete credentials.followupUnit;
      }

      if (prescriptionData?.Complaints?.length > 0) {
        credentials.complaintsMetaData =
          prescriptionData?.Complaints_metadata || [];
      }

      if (prescriptionData?.Diagnosis?.length > 0) {
        credentials.diagnosisMetaData =
          prescriptionData?.Diagnosis_metadata || [];
      }

      if (prescriptionData?.Procedures?.length > 0) {
        credentials.procedureMetaData =
          prescriptionData?.Procedures_metadata || [];
      }


console.log("credentials",credentials);


      const response = await saveprescriptiondetailspreviewjson(credentials);

      if (response.msg === "Ok") {
        const url = `https://beta.hru.today/doctor/${digital_id.appointmentId}/prescription.pdf`;
        setSelectedPdf(url);
      }

    } catch (error) {
      console.log(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: greenColor },
          headerTintColor: whiteColor,
          headerTitleStyle: { fontSize: 18 },
        }}
      >
        <Stack.Screen
          name="WorkQueueMain"
          options={{
            headerShown: false,
            unmountOnBlur: true,
          }}
          component={Workqueue}
        />
        <Stack.Screen
          name="manual_prescription"
          component={ManualPrescription}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Prescriptions"
          component={Prescription}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Vitals" component={Vitals} options={{
          headerRight: () => (
            <>
              <TouchableOpacity
                style={{ marginLeft: 20, marginRight: 20 }}
                onPress={handleSubmit}
              >
                <Icon
                  name="eye-outline"
                  size={26}
                  color={"white"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('Work Queue', { screen: 'Prescriptions' })
                }
              >
                <Icons
                  name="list-check"
                  size={24}
                  color={"white"}
                />
              </TouchableOpacity>
            </>)
        }} />

        <Stack.Screen
          name="Medication"
          component={Medication}
          options={{
            title: "Medicine Intake",
            headerRight: () => (
              <>
              <TouchableOpacity
                style={{ marginLeft: 20, marginRight: 20 }}
                onPress={handleSubmit}
              >
                <Icon
                  name="eye-outline"
                  size={26}
                  color={"white"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('Work Queue', { screen: 'Prescriptions' })
                }
              >
                <Icons
                  name="list-check"
                  size={24}
                  color={"white"}
                />
              </TouchableOpacity>
            </>
            ),
          }}
        />
        <Stack.Screen name="Diagnosis" component={Diagnosis} options={{
          headerRight: () => (
            <>
            <TouchableOpacity
              style={{ marginLeft: 20, marginRight: 20 }}
              onPress={handleSubmit}
            >
              <Icon
                name="eye-outline"
                size={26}
                color={"white"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => navigation.navigate('Work Queue', { screen: 'Prescriptions' })
              }
            >
              <Icons
                name="list-check"
                size={24}
                color={"white"}
              />
            </TouchableOpacity>
          </>)
        }} />
        <Stack.Screen
          name="Procedures"
          component={Procedures}
          options={{
            title: "Procedures/Recomm.",
            headerRight: () => (
              <>
              <TouchableOpacity
                style={{ marginLeft: 20, marginRight: 20 }}
                onPress={handleSubmit}
              >
                <Icon
                  name="eye-outline"
                  size={26}
                  color={"white"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('Work Queue', { screen: 'Prescriptions' })
                }
              >
                <Icons
                  name="list-check"
                  size={24}
                  color={"white"}
                />
              </TouchableOpacity>
            </>)
          }}
        />
        <Stack.Screen name="Complaints" component={Complaints} options={{
          headerRight: () => (
            <>
            <TouchableOpacity
              style={{ marginLeft: 20, marginRight: 20 }}
              onPress={handleSubmit}
            >
              <Icon
                name="eye-outline"
                size={26}
                color={"white"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => navigation.navigate('Work Queue', { screen: 'Prescriptions' })
              }
            >
              <Icons
                name="list-check"
                size={24}
                color={"white"}
              />
            </TouchableOpacity>
          </>)
        }} />
        <Stack.Screen name="lab_test" component={LabTest} options={{
          title: "Lab Test",
          headerRight: () => (
            <>
              <TouchableOpacity
                style={{ marginLeft: 20, marginRight: 20 }}
                onPress={handleSubmit}
              >
                <Icon
                  name="eye-outline"
                  size={26}
                  color={"white"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('Work Queue', { screen: 'Prescriptions' })
                }
              >
                <Icons
                  name="list-check"
                  size={24}
                  color={"white"}
                />
              </TouchableOpacity>
            </>)
        }} />
        <Stack.Screen name="Diet" component={Diet} options={{
          headerRight: () => (
            <>
            <TouchableOpacity
              style={{ marginLeft: 20, marginRight: 20 }}
              onPress={handleSubmit}
            >
              <Icon
                name="eye-outline"
                size={26}
                color={"white"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => navigation.navigate('Work Queue', { screen: 'Prescriptions' })
              }
            >
              <Icons
                name="list-check"
                size={24}
                color={"white"}
              />
            </TouchableOpacity>
          </>)
        }} />
        <Stack.Screen
          name="Refer"
          component={Refer}

          options={{
            title: "Refer Specialist", headerRight: () => (
             
                <>
              <TouchableOpacity
                style={{ marginLeft: 20, marginRight: 20 }}
                onPress={handleSubmit}
              >
                <Icon
                  name="eye-outline"
                  size={26}
                  color={"white"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('Work Queue', { screen: 'Prescriptions' })
                }
              >
                <Icons
                  name="list-check"
                  size={24}
                  color={"white"}
                />
              </TouchableOpacity>
            </>
             
            )
          }}
        />
        <Stack.Screen name="FollowUp" component={FollowUp} options={{
          title: "Follow Up", headerRight: () => (
            <>
              <TouchableOpacity
                style={{ marginLeft: 20, marginRight: 20 }}
                onPress={handleSubmit}
              >
                <Icon
                  name="eye-outline"
                  size={26}
                  color={"white"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('Work Queue', { screen: 'Prescriptions' })
                }
              >
                <Icons
                  name="list-check"
                  size={24}
                  color={"white"}
                />
              </TouchableOpacity>
            </>)
        }} />
        <Stack.Screen name="Advice" component={Advice} options={{
          headerRight: () => (
            <>
            <TouchableOpacity
              style={{ marginLeft: 20, marginRight: 20 }}
              onPress={handleSubmit}
            >
              <Icon
                name="eye-outline"
                size={26}
                color={"white"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => navigation.navigate('Work Queue', { screen: 'Prescriptions' })
              }
            >
              <Icons
                name="list-check"
                size={24}
                color={"white"}
              />
            </TouchableOpacity>
          </>)
        }} />
        <Stack.Screen name="lmp" component={LMP} options={{
          title: "LMP", headerRight: () => (
            <>
            <TouchableOpacity
              style={{ marginLeft: 20, marginRight: 20 }}
              onPress={handleSubmit}
            >
              <Icon
                name="eye-outline"
                size={26}
                color={"white"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => navigation.navigate('Work Queue', { screen: 'Prescriptions' })
              }
            >
              <Icons
                name="list-check"
                size={24}
                color={"white"}
              />
            </TouchableOpacity>
          </>)
        }} />


      </Stack.Navigator>
      <Modal
        visible={!!selectedPdf}
        animationType="slide"
        onRequestClose={() => setSelectedPdf(null)}>
        <PdfViewer pdfUrl={selectedPdf} />
        <TouchableOpacity

          onPress={() => setSelectedPdf(null)}>

        </TouchableOpacity>
      </Modal>
    </>
  );
};





const PatientsStack = ({ navigation }) => {

  useFocusEffect(
    React.useCallback(() => {

      navigation.reset({
        index: 0,
        routes: [{ name: 'MyPatients' }],
      });
    }, [navigation])
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: greenColor },
        headerTintColor: whiteColor,
        headerTitleStyle: { fontSize: 18 }, // Add margin to the title

      }}>
      <Stack.Screen name="MyPatients" component={Patients} options={{
        headerShown: false, unmountOnBlur: true, headerTitleStyle: { fontSize: 18, marginLeft: 20 }, // Add margin to title
        headerLeftContainerStyle: { marginLeft: 15 },
      }} />
      <Stack.Screen
        name="Details"
        component={PatientDetails}
        options={{ headerTitle: 'Patient Details' }}
      />
      <Stack.Screen
        name="AddPatient"
        component={Addpatients}
        options={{ headerTitle: 'Add Patient' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerTitle: 'Edit Patient Details' }}
      />
      <Stack.Screen
        name="FamilyMembers"
        component={FamilyMembers}
        options={{
          headerTitle: 'Family Members',
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => {
                navigation.navigate('My Patients', { screen: 'addfamily_member' });
              }}
            >
              <Text style={{ color: "white", fontSize: 13 }}> Add Member</Text>
            </TouchableOpacity>)
        }} />


      <Stack.Screen
        name="info_booking"
        component={Info_Booking}
        options={{
          headerTitle: 'Patient',
        }}
      />
      <Stack.Screen
        name="add_appointment"
        component={Add_Appointment}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="addfamily_member"
        component={AddFamily_member}
        options={{
          headerTitle: "Add Patient's Family Member",
        }}
      />

    </Stack.Navigator>
  );
};


export default function Routes() {
  const { userdata, isLoading } = useContext(AppContext);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {userdata ? <DashboardTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}
