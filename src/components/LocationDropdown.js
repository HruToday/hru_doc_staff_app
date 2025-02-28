import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import Customicons from '../common/Customicons';
import { AppContext } from '../context _api/Context';
import LinearGradient from 'react-native-linear-gradient';
import { greenColor, lightbackground, whiteColor } from '../common/Color';

const LocationDropdown = () => {
  const { userdata, updateSelectedLocationId, loctioncolor } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const locations = Array.isArray(userdata?.location_list)
    ? userdata.location_list
    : [];

  useEffect(() => {
    if (locations.length > 0) {
      setSelectedLocation(locations[0].location_name);
      updateSelectedLocationId(locations[0].location_id);
    }
  }, [locations]);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.dropdownButton}>
        <Text style={[styles.locationText, { color: loctioncolor }]}>
          {selectedLocation}
        </Text>
        <Customicons name={'chevron-down'} size={16} color={loctioncolor} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={locations}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedLocation(item.location_name);
                    updateSelectedLocationId(item.location_id);
                    setModalVisible(false);
                  }}>
                  <Text style={styles.modalItemText}>{item.location_name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LocationDropdown;

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 5,
    padding: 5,
    gap:5
  },
  locationText: {
    fontSize: 13,
    // fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    backgroundColor: whiteColor,
    borderRadius: 12,
    width: '85%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: lightbackground,
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '400',
    color: greenColor,
  },
});
