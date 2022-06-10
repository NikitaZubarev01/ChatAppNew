import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, } from 'react-native';
import { Amplify, DataStore, Hub } from 'aws-amplify';
import awsconfig from './src/aws-exports';

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
import { Message } from './src/models';

Amplify.configure(awsconfig);

function App() {
  const isLoadingComplete = useCachedResources();

  useEffect(() => {
    // Create listener
    console.log("registeriong listener");
    const listener = Hub.listen("datastore", async (hubData) => {
      const { event, data } = hubData.payload;
      if (event === "outboxMutationProcessed"
        && data.model === Message
        && !(["DELIVERED", "READ"].includes(data.element.status))) {
        // set the message status to delivered
        DataStore.save(
          Message.copyOf(data.element, (updated) => {
            updated.status = "DELIVERED";
          })
        );
      }
    });

    // Remove listener
    return () => listener();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider style={styles.root}>
        <Navigation />
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  }
})

export default App;


