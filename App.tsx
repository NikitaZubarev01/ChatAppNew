import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, } from 'react-native';
import { Amplify, DataStore, Hub, Auth } from 'aws-amplify';
import awsconfig from './src/aws-exports';

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
import { Message, User } from './src/models';
import moment from 'moment';

Amplify.configure(awsconfig);

function App() {
  const isLoadingComplete = useCachedResources();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Create listener
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

  useEffect(() => {
    if (!user) { return }

    const subscription = DataStore.observe(User, user.id).subscribe((msg) => {
      if (msg.model === User && msg.opType === "UPDATE") {
        setUser(msg.element);
      }
    });

    return () => subscription.unsubscribe();
  }, [user?.id]);

  useEffect(() => {
    fetchUser();
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      updateLastOnline();
    }, 1 * 60 * 1000)
    return () => clearInterval(interval);
  }, [user])

  const fetchUser = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    const user = await DataStore.query(User, userData.attributes.sub);
    if (user) {
      setUser(user);
    }
  }

  const updateLastOnline = async () => {
    if (!user) {
      return;
    }
    const response = await DataStore.save(
      User.copyOf(user, (updated) => {
        updated.lastOnline = +(new Date());
      })
    );
    setUser(response);
  }

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


