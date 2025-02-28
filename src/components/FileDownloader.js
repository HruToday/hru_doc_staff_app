
import { Alert } from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
export const downloadFile = async (url, fileName) => {
  // const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`; 
  const filePath = `${RNFS.ExternalStorageDirectoryPath}/Download/${fileName}`;
 
  

  try {
    const download = await RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
    }).promise;

    if (download.statusCode === 200) {
      Alert.alert('Download Complete', `File saved to ${filePath}`);
      // FileViewer.open(filePath)
      //   .then(() => {
      //     console.log('File opened successfully');
      //   })
      //   .catch((error) => {
      //     console.error('Error opening file', error);
      //     Alert.alert('Error', 'Unable to open the file');
      //   });
    } else {
        Alert.alert('Error', `Failed to download. Status: ${download.statusCode}`);
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'An error occurred while downloading the file');
  }
};
