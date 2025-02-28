import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { grayColor, greenColor, lightbackground, whiteColor } from '../common/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../context _api/Context';
import { checkin, notifyPatient, refreshWorkQueueData } from '../api/authService';
import PdfViewer from './PdfViewer';



const PaymentModal = ({ visible, onClose }) => {
  const { userdata, checkinData } = useContext(AppContext);


  const validDate = userdata?.data?.followupDays



  const [remainingBalance, setRemainingBalance] = useState({ charges: 0, discount: 0, paidAmount: 0, totalDue: 0 });
  const [isChecked, setIsChecked] = useState(false);
  const [hruAmount, sethruAmount] = useState(0)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false)

  const toggleCheckbox = () => {
    setIsChecked((prev) => {
      const newCheckedState = !prev;
      let totalPaidAmount = 0;
      let totalDiscount = 0;
      let totalCharge = 0;
      if (newCheckedState) {
        const totalCharges = rows.reduce((sum, row) => sum + parseFloat(row.charges || 0), 0);


        sethruAmount(totalCharges);



        const updatedRows = rows.map((row) => {
          const charges = parseFloat(row.charges || 0);
          const discount = parseFloat(row.discount || 0);
          const paidAmount = discount > 0 ? charges - discount : charges;

          totalPaidAmount += paidAmount;
          totalDiscount += discount;
          totalCharge += charges;

          return {
            ...row,
            onlinePayment: paidAmount.toString(),
            totalDue: "0",
          };
        });

        // Update state with aggregated values
        setRemainingBalance({
          charges: totalCharge,
          discount: totalDiscount,
          paidAmount: totalPaidAmount,
          totalDue: 0,
        });

        // Update rows in state
        setRows(updatedRows);
      } else {
        const totalCharges = rows.reduce((sum, row) => sum + parseFloat(row.charges || 0), 0);
        setRows((prevRows) =>
          prevRows.map((row) => {
            const charges = parseFloat(row.charges || 0);
            return {
              ...row,
              onlinePayment: "0",
              totalDue: charges.toString(),
            };
          })
        );


        setRemainingBalance({
          charges: totalCharges,
          discount: 0,
          paidAmount: 0,
          totalDue: totalCharges,
        });
      }

      return newCheckedState;
    });
  };



  const [modalPaymentMode, setModalPaymentMode] = useState('');

  useEffect(() => {
    if (checkinData?.doctorDetails?.additionalServices) {
      const initialRows = checkinData.invoice?.services?.map((service, index) => {
        const matchingService = checkinData.doctorDetails.additionalServices.find(
          (s) => s.serviceName === service.serviceName

        ); const isServiceMatched = !!matchingService;

        return {
          id: index + 1,
          serverName: service.serviceName,
          charges: matchingService?.serviceCharges?.toString() || "",
          discount: service.serviceDiscount?.toString() || "0",
          onlinePayment: service.paidAmount?.toString() || "0",
          totalDue: service.servicePayable?.toString() || "0",
          modeOfPayment: service.modeOfPayment || "",
          paymentCompleted: service.paymentCompleted || false,
          isServiceMatched
        };
      }) || [];
      setRows(initialRows);
      calculateRemainingBalance(initialRows);
      setServerOptions(checkinData.doctorDetails.additionalServices);
    }
  }, [checkinData]);

  useEffect(() => {
    if (checkinData?.doctorDetails?.additionalServices) {
      setServerOptions(checkinData.doctorDetails.additionalServices);
    }
  }, [checkinData]);

  const Service = checkinData?.doctorDetails?.additionalServices || [];
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [rows, setRows] = useState([
    { id: 1, serverName: '', charges: '', discount: '0', onlinePayment: '0', totalDue: '', modeOfPayment: '' },
  ]);
  const [serverOptions, setServerOptions] = useState(Service);
  const [paymentModes] = useState(['PhonePe', 'Gpay', 'UPI', 'Cash', 'Free', 'HRU']);
  const [isHRUSelected, setIsHRUSelected] = useState(false);
  const [showstatus, setShowstatus] = useState(" Please check the notification for the receipt of payment by HRU else please collect cash.")
  const [textColor, setTextColor] = useState('red')
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const addRow = (id) => {
    if (Service.length === rows.length) {
      return;
    }
    const newId = rows.length ? rows[rows.length - 1].id + 1 : 1;
    const newRow = { id: newId, serverName: '', charges: '', discount: '0', onlinePayment: '0', totalDue: '', modeOfPayment: '' };
    setRows([...rows, newRow]);
  };

  const deleteRow = (id) => {
    if (id === 1) {

      return;
    }
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);


    calculateRemainingBalance(updatedRows);
  };
  const updateRow = (id, field, value) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) => {
        if (row.id === id) {
          let updatedRow = { ...row, [field]: value };

          if (field === 'onlinePayment' || field === 'discount') {
            const charges = parseFloat(updatedRow.charges || 0);
            let discount = parseFloat(updatedRow.discount || 0);
            let onlinePayment = parseFloat(updatedRow.onlinePayment || 0);

            if (discount > charges || onlinePayment > charges) {
              Alert.alert('Please enter valid values.');

              // Reset the value to 0 if it exceeds charges
              if (field === 'discount') {
                discount = 0


              } else if (field === 'onlinePayment') {
                onlinePayment = 0


              }

              updatedRow.discount = discount.toString();
              updatedRow.onlinePayment = onlinePayment.toString();


            }

            if (!isNaN(charges) && !isNaN(discount) && !isNaN(onlinePayment)) {
              updatedRow.totalDue = (charges - discount - onlinePayment).toString();
            }


          }

          return updatedRow;
        }
        return row;
      });

      calculateRemainingBalance(updatedRows); // Recalculate balance
      return updatedRows;
    });
  };

  const calculateRemainingBalance = (updatedRows) => {
    let totalCharges = 0;
    let totalDiscount = 0;
    let totalPaidAmount = 0;
    let totalDue = 0;

    updatedRows.forEach((row) => {
      const charges = parseFloat(row.charges || 0);
      const discount = parseFloat(row.discount || 0);
      const onlinePayment = parseFloat(row.onlinePayment || 0);
      const total = charges - discount - onlinePayment;

      if (!isNaN(charges) && !isNaN(discount) && !isNaN(onlinePayment)) {
        totalCharges += charges;
        totalDiscount += discount;
        totalPaidAmount += onlinePayment;
        totalDue += total;
      }

    });

    setRemainingBalance({
      charges: totalCharges,
      discount: totalDiscount,
      paidAmount: totalPaidAmount,
      totalDue: totalDue,
    });
  };


  const renderRow = ({ item }) => {
    const selectedServices = rows
      .filter((row) => row.id !== item.id)
      .map((row) => row.serverName)
      .filter((name) => name !== "");
    const availableServices = serverOptions.filter(
      (service) =>
        !selectedServices.includes(service.serviceName) ||
        service.serviceName === item.serverName
    );

    const handleServiceChange = (id, selectedService) => {
      const selectedServiceDetails = serverOptions.find(
        (service) => service.serviceName === selectedService
      );

      if (selectedServiceDetails) {
        updateRow(id, "serverName", selectedService);
        updateRow(id, "charges", selectedServiceDetails.serviceCharges.toString());
        updateRow(id, "totalDue", selectedServiceDetails.servicePayable.toString());
      }
    };

    // Always select "Consultation Fee" for the first row
    if (item.id === 1 && !item.serverName) {
      const consultationService = serverOptions.find(
        (service) => service.serviceName === "Consultation Fee"
      );
      if (consultationService) {
        updateRow(item.id, "serverName", consultationService.serviceName);
        updateRow(item.id, "charges", consultationService.serviceCharges.toString());
        updateRow(item.id, "totalDue", consultationService.servicePayable.toString());
      }
    }



    return (
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>Service Name</Text>
          <View  style={styles.picker_container}>
          <Picker
            style={styles.dropdown}
            selectedValue={item.serverName}
            onValueChange={(value) => handleServiceChange(item.id, value)}
          >
            <Picker.Item label={availableServices.length > 0 ? "---Select---" : "Select a Service"} value="" />
            {availableServices.map((server, index) => (
              <Picker.Item key={index} label={server.serviceName} value={server.serviceName} style={{fontSize:13}} />
            ))}
          </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Charges</Text>
          <TextInput
            style={[styles.input, styles.nonEditable]}
            keyboardType="numeric"
            placeholder="Charges"
            value={item.charges}
            editable={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Discount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Discount"
            value={item.discount}
            onChangeText={(value) => updateRow(item.id, "discount", value)}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Paid Amount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Paid Amount"
            value={item.onlinePayment}
            onChangeText={(value) => updateRow(item.id, "onlinePayment", value)}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Total Due</Text>
          <TextInput
            style={[styles.input, styles.nonEditable]}
            keyboardType="numeric"
            placeholder="Total Due"
            value={item.totalDue}
            editable={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Mode of Payment</Text>
          <View  style={styles.picker_container}>
          <Picker
            style={styles.dropdown}
            selectedValue={item.modeOfPayment}
            onValueChange={(value) => {
              setIsHRUSelected(value === "HRU");
              if (value === "HRU") {
                setIsSubmitDisabled(true);
              } else {
                setIsSubmitDisabled(false);
              }
              updateRow(item.id, "modeOfPayment", value)
            }
            }
          >
            <Picker.Item label="Select Payment Mode" value="" />
            {paymentModes.map((mode, index) => (
              <Picker.Item key={index} label={mode} value={mode} style={{fontSize:12}} />
            ))}
          </Picker>
          </View>
        </View>

        <View style={styles.buttons}>
          {/* <TouchableOpacity style={styles.addButton} onPress={() => addRow(item.id)}>
            <Text style={styles.buttonText2}>+</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.addButton} onPress={() => addRow(item.id)}>
            <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>


          {item.id !== 1 && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRow(item.id)}>
              <Ionicons name="trash-outline" size={24} color="#F44336" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const handlePaymentModeChange = (value) => {
    setIsHRUSelected(value === "HRU");


    setModalPaymentMode(value);

    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        modeOfPayment: value,
      }))
    );
    if (value === "HRU") {
      setIsSubmitDisabled(true);
    } else {
      setIsSubmitDisabled(false);
    }
  };
  const hanndleClick = async () => {

    const servicies = []
    for (let row of rows) {
      if (parseFloat(row.onlinePayment || 0) > 0 && !row.modeOfPayment) {

        Alert.alert('Select Mode of Payment.');
        return;
      }
      const numberPattern = /^\d+(\.\d{1,2})?$/;
      if (!numberPattern.test(row.discount)) {
        Alert.alert('Discount must be numeric.');
        return;
      }
      if (!numberPattern.test(row.onlinePayment)) {
        Alert.alert('Paid Amount must be numeric.');
        return;
      }
      let paymentCompleted = ""
      if (parseFloat(row.totalDue) === 0) {
        paymentCompleted = true
      }
      if (paymentCompleted) {
        servicies.push({
          serviceName: row.serverName,
          serviceCharges: parseFloat(row.charges),
          serviceDiscount: parseFloat(row.discount),
          paidAmount: parseFloat(row.onlinePayment),
          servicePayable: parseFloat(row.totalDue),
          modeOfPayment: row.modeOfPayment || "",
          isInvoice: true,
          fullPayment: false,
          paymentCompleted: paymentCompleted // Added paymentCompleted to the object
        });
      } else {
        // Keep the previous behavior in the else block
        servicies.push({
          serviceName: row.serverName,
          serviceCharges: parseFloat(row.charges),
          serviceDiscount: parseFloat(row.discount),
          paidAmount: parseFloat(row.onlinePayment),
          servicePayable: parseFloat(row.totalDue),
          modeOfPayment: row.modeOfPayment || "",
          isInvoice: true,
          fullPayment: false,
        });
      }

    }
    const credentials = {
      token: checkinData.token,
      "isCheckedIn": true,
      "checkInDate": new Date().toISOString(),
      "status": 1,
      "validTillDate": new Date(new Date().setDate(new Date().getDate() + validDate)).toISOString(),
      "appointmentId": checkinData._id,
      "invoice": {
        "services": servicies,
        "totalAmt": remainingBalance.totalDue,
        "totalAmount": remainingBalance.charges,
        "totalCharges": remainingBalance.charges,
        "totalDiscount": remainingBalance.discount,
        "totalPaidAmount": remainingBalance.paidAmount
      },
      "otpVerified": false

    }

   


    try {
      const response = await checkin(credentials)
      
      if (response.msg === "Ok") {
        setRows([
          { id: 1, serverName: '', charges: '', discount: '0', onlinePayment: '0', totalDue: '', modeOfPayment: '' }
        ]);
        onClose();
      }
    } catch (error) {
      console.log(error.massage);

    }


  }



  useEffect(() => {
    if (!isChecked) {
      if (remainingBalance.paidAmount > 0) {
        sethruAmount(remainingBalance.paidAmount);
      } else {
        sethruAmount(remainingBalance.totalDue);
      }
    } else {
      sethruAmount(remainingBalance.charges);
    }
  }, [isChecked, remainingBalance.paidAmount, remainingBalance.totalDue]);

  const handleNotify = (async () => {

    const credentials = {
      token: checkinData.token,

      appointmentId: checkinData._id,
      doctorId: checkinData.doctorDetails._id,
      patientName: checkinData.name,
      clinicName: checkinData.doctorDetails.clinicName,
      mobileNo: checkinData.mobileNumber,
      payableAmt: hruAmount,
      type: "CheckIn"
    }
    
    try {
      const response = await notifyPatient(credentials)
      if (response.msg = "OK") {
        Alert.alert(`Payment link sent to ${checkinData.name} via whats app.`)
        setIsButtonDisabled(true);
      }

    } catch (error) {
      console.log(error.massage);

    }


  })
  const handleRefresh = (async () => {
    setIsButtonDisabled(true)
    const credentials = {
      token: checkinData.token,

      appointmentId: checkinData._id,

    }
   
    try {
      const response = await refreshWorkQueueData(credentials)
      

      if (response.doc?.paymentInfo?.rzrpStatus === "received") {
        setShowstatus(`Payment Successful. Your Payment ID is: ${response.doc.paymentInfo.id}`)
        setTextColor('green');
        setIsSubmitDisabled(false);
      }

    } catch (error) {
      console.log(error.massage);

    } finally {
      setIsButtonDisabled(false); // Re-enable button after API call completes
    }


  })


  return (
    <>
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Check In: {checkinData.firstName + " " + checkinData.lastName}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal style={styles.scrollView}>
            <FlatList
              data={rows}
              renderItem={renderRow}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.flatListContainer}
              showsVerticalScrollIndicator={false}
            />
          </ScrollView>

          <View style={styles.my_component_container}>
            <View style={styles.my_component_row}>
              <Text style={styles.my_component_text}>Total: ₹{remainingBalance.charges}</Text>
              <Text style={styles.my_component_text}>Discount: ₹{remainingBalance.discount}</Text>
              <Text style={styles.my_component_text}>Paid Amount: ₹{remainingBalance.paidAmount}</Text>
              {!isChecked && <Text style={styles.my_component_text}>Total Due: ₹{remainingBalance.totalDue}</Text>}
            </View>


            <TouchableOpacity onPress={() => {
              const url = `https://beta.hru.today/doctor/${checkinData._id}/receipt.pdf`

              setSelectedPdf(url);
            }}><Text style={[styles.my_component_text, { color: 'blue' }]}>Generate & Print Invoice</Text></TouchableOpacity>


            <View style={styles.checkbox_row}>
              <TouchableOpacity
                style={[styles.checkbox, isChecked && styles.checkbox_checked]}
                onPress={toggleCheckbox}
              >
                {isChecked && <Text style={styles.checkbox_tick}>✓</Text>}
              </TouchableOpacity>

              <Text style={styles.checkbox_text}>
                {
                  (() => {
                    if (isChecked) {
                      // if (remainingBalance.paidAmount > 0) {
                      //   return `I confirm the receipt of complete amount of ₹${remainingBalance.paidAmount.toFixed(2)}`;
                      // } else {
                      //   return `I confirm the receipt of complete amount of ₹${remainingBalance.totalDue.toFixed(2)}`;
                      // }
                      return `I confirm the receipt of complete amount of ${remainingBalance.paidAmount}`

                    } else {
                      if (remainingBalance.paidAmount > 0) {

                        return `I confirm the receipt of ₹${remainingBalance.paidAmount.toFixed(2)}`;
                      }
                      else {

                        return `I confirm the receipt of ₹${remainingBalance.totalDue.toFixed(2)}`;
                      }
                    }
                  })()
                }
              </Text>



            </View>


            {rows.length > 1 && (
                <View  style={styles.picker_container}>
              <Picker
                style={styles.dropdown}
               
                selectedValue={modalPaymentMode}
                onValueChange={handlePaymentModeChange}
              >
                <Picker.Item label="Mode of Payment" value="" />
                {paymentModes.map((mode, index) => (

                  <Picker.Item key={index} label={mode} value={mode} style={{fontSize:13}} />
                ))}
              </Picker>
              </View>
            )}
            {isHRUSelected && (
              <View style={styles.hru_container}>
                <Text style={[styles.hru_text, { color: textColor }]}>
                  {showstatus}
                </Text>
                <View style={styles.hru_buttons}>
                  <TouchableOpacity style={[styles.hru_button, { backgroundColor: isButtonDisabled ? 'lightgray' : greenColor }]} onPress={handleNotify} disabled={isButtonDisabled}>
                    <Text style={styles.hru_button_text}>Notify Patient</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.hru_button, styles.hru_cancel_button]} onPress={handleRefresh}>
                    <Text style={styles.hru_button_text}>Refresh</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.my_component_button_container}>
              {/* <TouchableOpacity style={styles.my_component_button} onPress={hanndleClick}>
                <Text style={styles.my_component_button_text}>Submit</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={[
                  styles.my_component_button,
                  
                  { backgroundColor: isSubmitDisabled ? 'lightgray' : greenColor }// Change button color when disabled
                ]}
                onPress={hanndleClick}
                disabled={isSubmitDisabled} // Disable button when HRU is selected and payment is not received
              >
                <Text style={styles.my_component_button_text}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.my_component_button, styles.my_component_cancel_button]} onPress={onClose}>
                <Text style={styles.my_component_button_text}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={!!selectedPdf}
        animationType="slide"
        onRequestClose={() => setSelectedPdf(null)}>
        <PdfViewer pdfUrl={selectedPdf} />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setSelectedPdf(null)}>

        </TouchableOpacity>
      </Modal>
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: lightbackground,

  },
  header: {
    flexDirection: "row",
    height: 50,
    backgroundColor: greenColor,
    justifyContent: "space-between",
    alignItems: "center",
    width: "99.99%",

  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
    marginLeft: 10,
    alignItems: "center",

    color: whiteColor

  },
  hru_text: {
    fontSize: 10,
    color: 'red',
    marginBottom: 10,
  },
  scrollView: {
    // marginBottom: 10,
    // paddingHorizontal: 10,
    // paddingTop: 20,
    margin: 10
  },

  row: {
    // flexDirection: 'column',


    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
    elevation: 2,
    margin: 10,
    gap: 10,
  },
  field: {
    flex: 1,
    // width: 380,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker_container:{
    backgroundColor: "#fff", // White background
    borderRadius: 5, // Rounded corners
    borderWidth: 1,
    width:200,
    height:50,
    borderColor: "lightgray", // Light gray border
    overflow: "hidden",
  },
  dropdown: {
    color: "#000", // Black text color
    height: 50,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    width: 200

  },

  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addButton: {
    // backgroundColor: greenColor,
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText2: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: greenColor,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: greenColor,
    padding: 10
  },
  my_component_container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  my_component_row: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 5


  },
  my_component_text: {
    fontSize: 13,
    color: greenColor,
    fontWeight: '500',
  },
  my_component_button_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  my_component_button: {
    backgroundColor: greenColor,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
  },
  my_component_cancel_button: {
    backgroundColor: grayColor,
  },
  my_component_button_text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  checkbox_row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkbox_checked: {
    borderColor: 'blue',
    // backgroundColor: 'blue',
  },
  checkbox_inner: {
    width: 12,
    height: 12,
    backgroundColor: 'white',
  },
  checkbox_text: {
    fontSize: 13,
    color: '#000',
  },
  hru_buttons: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    gap: 10,
    width: '80%',
  },
  hru_button: {
    padding: 5,
    backgroundColor: greenColor,
    borderRadius: 5,
  },
  hru_button_text: {
    color: 'white',

  },
});


export default PaymentModal;
