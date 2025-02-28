import React from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Linking } from 'react-native';
import Pdf from 'react-native-pdf';

const PdfViewer = ({ pdfUrl }) => {
    return (
        <View style={styles.container}>
            <Pdf
                source={{ uri: pdfUrl }}
                trustAllCerts={false}
                renderActivityIndicator={() => (
                    <ActivityIndicator color="black" size="large" />
                )}
                enablePaging={true}
              
                onPageSingleTap={(page) => alert(page)}
                onPressLink={(link) => Linking.openURL(link)}
                
                minScale={1.0} // Minimum zoom level
                maxScale={3.0} // Maximum zoom level
                scale={1.0} // Default scale
                fitPolicy={2} // Fit to width
                spacing={10}
                horizontal
                style={{ flex: 1, width: Dimensions.get('window').width }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
});

export default PdfViewer;


