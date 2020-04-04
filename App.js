import React from 'react';
import { Text, View, Button, Vibration } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export default class AppContainer extends React.Component {
  state = {
    expoPushToken : '',
  };

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }try{
        let token = await Notifications.getExpoPushTokenAsync();
        this.setState({expoPushToken: token});
        console.log(token);
      }catch(e){
        this.setState({expoPushToken: e.message});
        console.log(e.message);
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
  };

  componentDidMount() {
    this.registerForPushNotificationsAsync();
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Expo token: {this.state.expoPushToken}</Text>
        </View>
      </View>
    );
  }
}