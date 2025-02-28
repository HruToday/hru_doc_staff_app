import apiClient from './apiClient';
// Done
export const login = async (credentials) => {
  try {
    const data = await apiClient('login', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('Login Error:', error.message);
    throw error; 
  }
};
export const forgotPassword = async (credentials) => {
  try {
    const data = await apiClient('forgotPassword', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('Forget Error:', error.message);
    throw error; 
  }
};
export const changePassword = async (credentials) => {
  try {
    const data = await apiClient('resetPassword', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('change password Error:', error.message);
    throw error; 
  }
};
export const getdashboard = async (credentials) => {
  try {
    const data = await apiClient('getdashboard', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('dashboard  Error:', error.message);
    throw error; 
  }
};
// Done
export const getmypatients = async (credentials) => {
  try {
    const data = await apiClient('patient-search.json', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('patient-search.json  Error:', error.message);
    throw error; 
  }
};
// Done
export const getworkqueue = async (credentials) => {
  try {
    const data = await apiClient('workqueue-search-by-staff.json', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('workqueue  Error:', error.message);
    throw error; 
  }
};
//done
export const savenewPatients = async (credentials) => {
  try {
    const data = await apiClient('savenewpatient', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('savenewpatient  Error:', error.message);
    throw error; 
  }
};

//Done name or mobile number search
export const fetchPatientList = async (credentials) => {
  try {
    const data = await apiClient('search-patient-by-name-or-number.json', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('search-patient-by-name-or-number.json  Error:', error.message);
    throw error; 
  }
};
export const fetchPatientMobileList = async (credentials) => {
  try {
    const data = await apiClient('search-patient-existence.json', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('search-patient-existence.json  Error:', error.message);
    throw error; 
  }
};
//Done
export const mypatientgeninfo = async (credentials) => {
  try {
    const data = await apiClient('get-patient-details.json', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('get-patient-details.json  Error:', error.message);
    throw error; 
  }
};

export const getpatientfamily = async (credentials) => {
  try {
    const data = await apiClient('get-family-list.json', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('get-family-list.json  Error:', error.message);
    throw error; 
  }
};

export const mypatientMedHist = async (credentials) => {
  try {
    const data = await apiClient('mypatientMedHist', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('mypatientMedHist  Error:', error.message);
    throw error; 
  }
};

export const bookAppointmentNowPatient = async (credentials) => {
  try {
    const data = await apiClient('bookAppointmentNowPatient', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('bookAppointmentNowPatient  Error:', error.message);
    throw error; 
  }
};
export const searchpatientbyid = async (credentials) => {
  try {
    const data = await apiClient('searchpatientbyid', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('searchpatientbyid  Error:', error.message);
    throw error; 
  }
};
export const getnextWeekClinicTimeSlot = async (credentials) => {
  try {
    const data = await apiClient('slots-for-next-set-for-staff.json', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('slots-for-next-set-for-staff.json  Error:', error.message);
    throw error; 
  }
};
//Done
export const addNewPatientFamilyMember = async (credentials) => {
  try {
    const data = await apiClient('add-patient-family-member.json', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('add-patient-family-member.json  Error:', error.message);
    throw error; 
  }
};



//BOOK FOR LATER

export const bookappoforPatient = async (credentials) => {
  try {
    const data = await apiClient('bookappoforPatient', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('bookappoforPatient  Error:', error.message);
    throw error; 
  }
};

export const vitalsubmit = async (credentials) => {
  try {
    const data = await apiClient('save-vital-prescription-details.json', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('save-vital-prescription-details.json  Error:', error.message);
    throw error; 
  }
};
export const upcomingAppointments = async (credentials) => {
  try {
    const data = await apiClient('upcomingAppointments', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('upcomingAppointments  Error:', error.message);
    throw error; 
  }
};
//Done
export const ReportUpload = async (credentials) => {
  try {
    const data = await apiClient('reportUpload', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('reportUpload  Error:', error.message);
    throw error; 
  }
};
//Done
export const prescriptionUpload = async (credentials) => {
  try {
    const data = await apiClient('prescriptionUpload', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('prescriptionUpload  Error:', error.message);
    throw error; 
  }
};
//Done
export const patientMedicalHistory = async (credentials) => {
  try {
    const data = await apiClient('get-patient-medical-history.json', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('get-patient-medical-history.json  Error:', error.message);
    throw error; 
  }
};
export const patientPaymentHistory = async (credentials) => {
  try {
    const data = await apiClient('patientPaymentHistory', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('patientPaymentHistory  Error:', error.message);
    throw error; 
  }
};
//Done
export const patientAppointmentHistory = async (credentials) => {
  try {
    const data = await apiClient('get-patient-appointment-history.json', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('get-patient-appointment-history.json  Error:', error.message);
    throw error; 
  }
};
//Done
export const updatePatientDetails = async (credentials) => {
  try {
    const data = await apiClient('update-patient.json', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('update-patient.json  Error:', error.message);
    throw error; 
  }
};
export const cancelCheckIn = async (credentials) => {
  try {
    const data = await apiClient('save-cancelCheckIn-details.json', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('save-cancelCheckIn-details.json  Error:', error.message);
    throw error; 
  }
};
export const checkin = async (credentials) => {
  try {
    const data = await apiClient('checkin', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('checkin  Error:', error.message);
    throw error; 
  }
};
//Done
export const noshow = async (credentials) => {
  try {
    const data = await apiClient('save-noShow-details.json', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('noshow  Error:', error.message);
    throw error; 
  }
};
export const saveChargeInvoiceDetails = async (credentials) => {
  try {
    const data = await apiClient('saveChargeInvoiceDetails', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('saveChargeInvoiceDetails  Error:', error.message);
    throw error; 
  }
};
export const fetchDiagnosisTags = async (credentials) => {
  try {
    const data = await apiClient('fetchDiagnosisTags', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('fetchDiagnosisTags  Error:', error.message);
    throw error; 
  }
};
export const fetchComplaintstags = async (credentials) => {
  try {
    const data = await apiClient('fetchComplaintstags', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('fetchComplaintstags  Error:', error.message);
    throw error; 
  }
};
export const fetchDietTags = async (credentials) => {
  try {
    const data = await apiClient('fetchDietTags', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('fetchDietTags  Error:', error.message);
    throw error; 
  }
};




export const fetchProceduresTags = async (credentials) => {
  try {
    const data = await apiClient('fetchProceduresTags', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('fetchProceduresTags  Error:', error.message);
    throw error; 
  }
};
export const getlabtests = async (credentials) => {
  try {
    const data = await apiClient('getlabtests', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('getlabtests  Error:', error.message);
    throw error; 
  }
};
export const getmedicinelist = async (credentials) => {
  try {
    const data = await apiClient('getmedicinelist', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('getmedicinelist  Error:', error.message);
    throw error; 
  }
};
export const getalllabtests = async (credentials) => {
  try {
    const data = await apiClient('getalllabtests', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('getalllabtests  Error:', error.message);
    throw error; 
  }
};

export const getallmedicinelist = async (credentials) => {
  try {
    const data = await apiClient('getallmedicinelist', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('getallmedicinelist  Error:', error.message);
    throw error; 
  }
};
export const medicineMappingList = async (credentials) => {
  try {
    const data = await apiClient('medicineMappingList', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('medicineMappingList  Error:', error.message);
    throw error; 
  }
};
export const getRecentLabAttributes = async (credentials) => {
  try {
    const data = await apiClient('getRecentLabAttributes', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('getRecentLabAttributes  Error:', error.message);
    throw error; 
  }
};
export const notifyPatient = async (credentials) => {
  try {
    const data = await apiClient('notifyPatient', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('notifyPatient  Error:', error.message);
    throw error; 
  }
};
export const refreshWorkQueueData = async (credentials) => {
  try {
    const data = await apiClient('refreshWorkQueueData', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('refreshWorkQueueData  Error:', error.message);
    throw error; 
  }
};
export const saveprescriptiondetailspreviewjson = async (credentials) => {
  try {
    const data = await apiClient('save-prescription-details-preview.json', 'POST', credentials);
    return data; 
  } catch (error) {
    console.error('save-prescription-details-preview.json  Error:', error.message);
    throw error; 
  }
};



