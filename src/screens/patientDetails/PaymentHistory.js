import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {patientPaymentHistory} from '../../api/authService';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {greenColor, lightbackground} from '../../common/Color';
import {AppContext} from '../../context _api/Context';

import { downloadFile } from '../../components/FileDownloader';
import PdfViewer from '../../components/PdfViewer';
const PaymentHistory = ({patient_profile}) => {
  const {userdata} = useContext(AppContext);
  const {profileId, _id} = patient_profile;
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const handlefetch = async () => {
      const token = userdata?.data?.auth_token;
      const credentials = {
        token: token,
        patientId: _id,
        profileId: profileId,
      };

      try {
        const response = await patientPaymentHistory(credentials);
       
        setPaymentData(response.docs || []); // Assuming API returns an array of payment data
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };
    handlefetch();
  }, []);

  const COLUMN_WIDTH = `${100 / 7}%`; // 7 columns with equal width

  const renderRow = (item, index) => (
    <View key={index} style={styles.tableRow}>
      <Text style={[styles.cellText, {width: COLUMN_WIDTH}]}>
        {item.bookingId}
      </Text>
      <Text style={[styles.cellText, {width: COLUMN_WIDTH}]}>
        {item.statusTxt === 'Checked In'
          ? '-'
          : new Date(item.endTime).toLocaleDateString()}
      </Text>
      <Text style={[styles.cellText, {width: COLUMN_WIDTH}]}>
        {item.statusTxt === 'Checked In'
          ? '-'
          : new Date(item.endTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
      </Text>
      <Text style={[styles.cellText, {width: COLUMN_WIDTH}]}>
        {item.totalAmt}
      </Text>
      <Text style={[styles.cellTextstatus, {width: COLUMN_WIDTH}]}>
        {item.statusTxt}
      </Text>
      <Text style={[styles.cellText, {width: COLUMN_WIDTH}]}>
        {item.refundInfo || '-'}
      </Text>

      {item.statusTxt === 'Checked In' ? (
        <View style={[styles.cellInvoice, {width: COLUMN_WIDTH}]}>
          <Text style={[styles.cellText]}>NO</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.cellInvoice, {width: COLUMN_WIDTH}]}
          onPress={() => {
            const url=`https://beta.hru.today/doctor/${item._id}/invoice.pdf`
            
            
            const fileName = `invoice${item.bookingId}.pdf`; 
            downloadFile(url, fileName);
            setSelectedPdf(url);
           
          }}>
          <Icon name="file-download" size={20} color={greenColor} />
        </TouchableOpacity>
        
      )}
      <ScrollView style={{ flex: 1 }}>
      
      {/* <PdfViewer pdfUrl={`https://beta.hru.today/doctor/${item._id}/invoice.pdf`} /> */}
    </ScrollView>

    </View>

  );

  if (loading) {
    // Show loader while data is being fetched
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={greenColor} />
      </View>
    );
  }
 
  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, {width: COLUMN_WIDTH}]}>
          Trans. ID
        </Text>
        <Text style={[styles.headerText, {width: COLUMN_WIDTH}]}>Date</Text>
        <Text style={[styles.headerText, {width: COLUMN_WIDTH}]}>Time</Text>
        <Text style={[styles.headerText, {width: COLUMN_WIDTH}]}>Amount</Text>
        <Text style={[styles.headerText, {width: COLUMN_WIDTH}]}>Status</Text>
        <Text style={[styles.headerText, {width: COLUMN_WIDTH}]}>Refund</Text>
        <Text style={[styles.headerText, {width: COLUMN_WIDTH}]}>Invoice</Text>
      </View>

      {/* Table Body */}
      <ScrollView>
        {paymentData.map((item, index) => renderRow(item, index))}
        {paymentData.length === 0 && (
          <View style={styles.noDataContainer}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Image
                source={require('../../assets/nodata.png')} // Replace with your image path
                style={styles.placeholderImage}
              />
            </View>
          </View>
        )}
      </ScrollView>
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
    </View>
  );
};

export default PaymentHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: greenColor,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cellText: {
    fontSize: 9,
    color: '#555',
    textAlign: 'center',
  },
  cellTextstatus: {
    fontSize: 8,
    color: '#555',
    backgroundColor: lightbackground,
    borderRadius: 10,
    textAlign: 'center',
    borderColor: greenColor,
    borderWidth: 0.5,
    padding: 3,
  },
  cellInvoice: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  loadingContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
