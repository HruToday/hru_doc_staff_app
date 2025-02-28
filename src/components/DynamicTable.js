import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library
import { greenColor } from '../common/Color';

import { downloadFile } from './FileDownloader';
import PdfViewer from './PdfViewer';
const DynamicTable = ({ headerData, data, type }) => {
  // Create a ref for FlatList
  const flatListRef = useRef(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: 0, animated: true });
    }
  };

  const renderItem = item => {
    if (type === 'prescription') {
      return (
        <>
          <Text style={styles.cellText}>{item.bookingId}</Text>
          <Text style={styles.cellText}>
            {new Date(item.startTime).toLocaleDateString()}
          </Text>
          <Text style={styles.cellText}>
            {new Date(item.startTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => {
              const url = `https://beta.hru.today/doctor/${item._id}/prescription.pdf`;
              setSelectedPdf(url);
              const fileName = `prescription_${item.bookingId}.pdf`; // Unique file name
              downloadFile(url, fileName);
            }}>
            <Icon
              name="file-download"
              size={20}
              color={greenColor}
              style={styles.icon}
            />
          </TouchableOpacity>
        </>
      );
    } else if (type === 'report') {
      return (
        <>
          <Text style={styles.cellText}>{item.bookingId}</Text>
          <Text style={styles.cellText}>
            {new Date(item.startTime).toLocaleDateString()}
          </Text>
          <Text style={styles.cellText}>
            {item.uploadedReports[0].reportType}
          </Text>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => {

              const url = `https://beta.hru.today/doctor/${item._id}/${item.uploadedReports[0].id}/report.pdf`


              setSelectedPdf(url);
              const fileName = `report${item.bookingId}.pdf`;
              downloadFile(url, fileName);
            }}>
            <Icon
              name="file-download"
              size={20}
              color={greenColor}
              style={styles.icon}
            />
          </TouchableOpacity>
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Image
            source={require('../assets/nodata.png')}
            style={styles.noDataImage}
          />
        </View>
      ) : (
        <>
          {/* Table Header */}
          <View style={styles.header}>
            {headerData.map((headerItem, index) => (
              <Text key={index} style={styles.headerText}>
                {headerItem}
              </Text>
            ))}
          </View>

          {/* Table Body */}
          <FlatList
            ref={flatListRef}
            data={data}
            renderItem={({ item, index }) => (
              <View key={index} style={styles.row}>
                {renderItem(item)}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
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

          {/* Scroll to Top Button */}
          {/* <TouchableOpacity
            onPress={scrollToTop}
            style={styles.scrollToTopButton}>
            <Text style={styles.scrollToTopText}>Scroll to Top</Text>
          </TouchableOpacity> */}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: greenColor,
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  headerText: {
    flex: 1,
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cellText: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  downloadButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  icon: {
    alignSelf: 'center',
  },
  scrollToTopButton: {
    padding: 10,
    backgroundColor: greenColor,
    marginTop: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  scrollToTopText: {
    color: '#fff',
  },
});

export default DynamicTable;
