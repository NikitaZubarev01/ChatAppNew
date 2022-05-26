import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, } from 'react-native';
import { Amplify } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import awsconfig from './src/aws-exports';

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';

Amplify.configure(awsconfig);

function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider style={styles.root}>
        <Navigation/>
      </SafeAreaProvider>
    );
  }
}

const styles= StyleSheet.create({
  
  root:{
    flex: 1,
    backgroundColor: '#F9FBFC',
  }
})

export default App;


