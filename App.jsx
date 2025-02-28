import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
// Add this line to polyfill crypto

import Routes from './src/navigation/Routes';
import {AppProvider} from './src/context _api/Context';
import {whiteColor} from './src/common/Color';
import CheckDashboard from './src/screens/dashboard/CheckDashboard';
import ProgressBarExample from './src/components/ProgressBarExample ';
import DateCalculation from './src/components/DateCalculation';
import PdfViewer from './src/components/PdfViewer';
import NewDashboard from './src/screens/dashboard/NewDashboard';
import AddressSearch from './src/components/Address';

const App = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={whiteColor} />
        <Routes />
      </SafeAreaView>
    </AppProvider>
    // <AddressSearch/>
  

  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default App;
