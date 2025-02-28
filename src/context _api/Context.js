import React, { createContext, useState, useEffect } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
   const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedClinic, setSelectedClinic] = useState('');
  const [userdata, setUserData] = useState(null);
  const [forgetnumber, setForgetNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [familydetails, setFamilyDetails] = useState(null)
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [booklaterpatient, setBookLaterPatient] = useState(null)
  const [patientFamily_id, setPatientFamily_id] = useState(null)
  const [loctioncolor, setLoctionColor] = useState(null)
  const [workqueuebutton, setWorkqueueButton] = useState({});
  const [workqueueCencelbutton, setWorkqueueCencelButton] = useState({});
  const [hideView, setHideView] = useState({});
  const [hideViewforReport, sethideViewforReport] = useState({});
  const [showPrescription_pdf, setshowPrescription_pdf] = useState([]);
 const [membermobile,setMembermobile]=useState("")
  const [showReport_pdf, setshowReport_pdf] = useState([]);
  const [vitalsData, setVitalsData] = useState({});
  const [digital_Prescription, setDigital_Prescription] = useState({});
  const [checkinData, setChekinData] = useState([])
  const [digital_id,DigitalId]=useState("")
  const [gendertoggle,setGendetoggle]=useState("")
  const [digital_PrescriptionButton,setdigital_PrescriptionButton]=useState({})
  const [item,setItem]=useState({})
  const [refreshdata,setRefreshdata]=useState(false)
  const [selectedTags, setSelectedTags] = useState([]);
  // const infoUserData = async data => {
  //   try {
  //     await EncryptedStorage.setItem('userdata', JSON.stringify(data));
  //     setUserData(data);
  //   } catch (error) {
  //     console.error('Error storing user data:', error);
  //   }
  // };
  const infoUserData = async (data) => {
    try {
      const currentTime = Date.now();
      await EncryptedStorage.setItem('userdata', JSON.stringify(data));
      await EncryptedStorage.setItem('login_timestamp', JSON.stringify(currentTime));
      setUserData(data);
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };


  // const loadUserData = async () => {
  //   try {
  //     const storedData = await EncryptedStorage.getItem('userdata');
  //     if (storedData) {
  //       setUserData(JSON.parse(storedData));
  //     }
  //   } catch (error) {
  //     console.error('Error loading user data:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const loadUserData = async () => {
    try {
      const storedData = await EncryptedStorage.getItem('userdata');
      const storedTimestamp = await EncryptedStorage.getItem('login_timestamp');
  
      if (storedData && storedTimestamp) {
        const loginTime = JSON.parse(storedTimestamp);
        const currentTime = Date.now();
        const elapsedTime = (currentTime - loginTime) / (1000 * 60 * 60); // Convert to hours
  
        if (elapsedTime >= 12) {
          await clearUserData(); // Logout user
        } else {
          setUserData(JSON.parse(storedData));
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const clearUserData = async () => {
    try {
      await EncryptedStorage.removeItem('userdata');
      setUserData(null);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const GenderToggle = data => {
    setGendetoggle(data);
  };
  const ItemData = data => {
    setItem(data);
  };
  const Selected_Tag = data => {
    setSelectedTags(data);
  };
  const refreshPage = data => {
    setRefreshdata(data);
  };
  const member_mobilenumber = data => {
    setMembermobile(data);
  };
  
  const selectdocotrs = data => {
    setSelectedDoctor(data);
  };
  const selectclinic= data => {
    setSelectedClinic(data);
  };

  const forgetNumberData = data => {
    setForgetNumber(data);
  };
  const CheckIN_Data = data => {
    setChekinData(data);
  };
  const Digital_ID = data => {
    DigitalId({ ...data });
  };

  const updateSelectedPatient = patient => {
    setSelectedPatient(patient);
  };
  const updateFamilyDetails = data => {
    setFamilyDetails(data);
  };
  const updateSelectedLocationId = (locationId) => {
    setSelectedLocationId(locationId);
  };
  const updatePatientFamily_id = (item) => {
    setPatientFamily_id(item);
  };
  const prescription_pdfId = (item) => {
    setshowPrescription_pdf(item);
  };
  const report_pdfId = (item) => {
    setshowReport_pdf(item);
  };
  const loctioncolorupdate = (item) => {
    setLoctionColor(item);
  };

  const Digitalbutton_update = (item, newText) => {
    setdigital_PrescriptionButton((prevState) => ({
      ...prevState,
      [item._id]: newText,
    }));
  };

  const toggleHideView = (appointmentId) => {
    setHideView({
      [appointmentId]: true,
    });
  };
  const toggleHideViewForReport = (appointmentId) => {
    sethideViewforReport({
      [appointmentId]: true,
    });
  };


  const booklaterData = (_id, patient_id) => {
    setBookLaterPatient({ _id, patient_id });
  };

  const workqueuebuttons = (item, newText) => {
    setWorkqueueButton((prevState) => ({
      ...prevState,
      [item._id]: newText,
    }));
  };
  const updateVitalsData = (appointmentId, field, value) => {
    setVitalsData((prev) => ({
      ...prev,
      [appointmentId]: {
        ...prev[appointmentId],
        [field]: value,
      },
    }));
  };
  const Digtail_PrescriptionData = (appointmentId, field, value) => {
    setDigital_Prescription((prev) => ({
      ...prev,
      [appointmentId]: {
        ...prev[appointmentId],
        [field]: value,
      },
    }));
  };

  const workqueueCencelbuttons = (item, newText) => {
    setWorkqueueCencelButton((prevState) => ({
      ...prevState,
      [item]: newText,
    }));
  };

  useEffect(() => {
    loadUserData();
  }, []);
  
  return (
    <AppContext.Provider
      value={{
        selectedClinic,
        selectedDoctor,
        selectclinic,
        selectdocotrs,
        selectedTags,
        Selected_Tag,
        membermobile,
        member_mobilenumber,
        showReport_pdf,
        report_pdfId,
        refreshdata,
        refreshPage,
        item,
        ItemData,
        digital_PrescriptionButton,
        Digitalbutton_update,
        gendertoggle,
        GenderToggle,
        digital_id,
        Digital_ID,
        digital_Prescription,
        Digtail_PrescriptionData,
        checkinData,
        CheckIN_Data,
        workqueueCencelbutton,
        workqueueCencelbuttons,
        vitalsData, updateVitalsData,
        prescription_pdfId,
        showPrescription_pdf,
        hideViewforReport,
        toggleHideViewForReport,
        hideView, toggleHideView,
        workqueuebutton,
        workqueuebuttons,
        loctioncolor,
        loctioncolorupdate,
        patientFamily_id,
        updatePatientFamily_id,
        booklaterpatient,
        booklaterData,
        selectedLocationId,
        updateSelectedLocationId,
        familydetails,
        updateFamilyDetails,
        selectedPatient,
        updateSelectedPatient,
        userdata,
        infoUserData,
        clearUserData,
        forgetnumber,
        forgetNumberData,
        isLoading,
      }}>
      {children}
    </AppContext.Provider>
  );
};
