import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'; // Import AntDesign icons
import { blackColor, fontFamily, grayColor, greenColor, whiteColor } from '../../common/Color';

const Leb_report = () => {
 
  const data = [
    { id: '1', leftText: ['Left Text 1', 'Left Text 2'], rightText: ['Right Text 1', 'Right Text 2'] },
     ];

  
  const renderButtons = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.button, styles.viewButton]}>
        <Icon name="eye" size={20} color="white" />
        <Text style={styles.buttonText}>View</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.downloadButton]}>
        <Icon name="download" size={20} color="white" />
        <Text style={styles.buttonText}>Download</Text>
      </TouchableOpacity>
    </View>
  );

 
  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.leftContainer}>
        {item.leftText.map((text, index) => (
          <Text key={index} style={styles.text}>{text}</Text>
        ))}
      </View>
      <View style={styles.rightContainer}>
        {item.rightText.map((text, index) => (
          <Text key={index} style={styles.text}>{text}</Text>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderRow}
        ListHeaderComponent={
          <>
      
            <FlatList
              data={data.slice(0, 2)} 
              keyExtractor={(item) => item.id}
              renderItem={renderRow}
              style={styles.innerList}
            />
        
            {renderButtons()}
          </>
        }
        ListFooterComponent={
          <>
         
            <FlatList
              data={data.slice(2)} 
              keyExtractor={(item) => item.id}
              renderItem={renderRow}
              style={styles.innerList}
            />
      
            {renderButtons()}
          </>
        }
      />
    </View>
  );
};

export default Leb_report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteColor,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9', 
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 16,
    color: blackColor,
    marginBottom: 4,
    fontFamily: fontFamily, 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
    width: 140,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  viewButton: {
    backgroundColor: greenColor,
  },
  downloadButton: {
    backgroundColor: grayColor, 
  },
  buttonText: {
    color: whiteColor,
    fontSize: 14,
    marginLeft: 8,
  },
  innerList: {
    marginBottom: 16,
  },
});
