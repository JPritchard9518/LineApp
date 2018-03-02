import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Keyboard
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import config from '../config.json';

export default class LoginScreen extends Component {
  static navigationOptions = {
    title: 'Login',
    headerTitleStyle: {
      color: '#FFF',
    },
  };
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      password: '',
      errorMessage: '',
    }
    this.login = this.login.bind(this);
  }
  login() {
    Keyboard.dismiss()
    var userName = this.state.userName;
    var password = this.state.password;
    userName = "JPritchard9518"
    password = "Jp918136!"
    var url = 'http://' + config.ip + ':' + config.port + '/mobileAPI/validateLineManager?userName=' + userName + '&password=' + password;
    return fetch(url).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          this.props.navigation.navigate('DrawerStack')
        } else {
          this.setState({ errorMessage: responseJson.message })
        }

      })
      .catch((error) => {
        this.setState({ errorMessage: error })
      });
  }
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Line Manager Login</Text>
        <TextInput
          ref="userName"
          style={styles.input}
          onChangeText={(userName) => this.setState({ userName: userName })}
          placeholder="Username" />
        <TextInput
          ref="password"
          style={styles.input}
          onChangeText={((password) => this.setState({ password: password }))}
          secureTextEntry={true}
          placeholder="Password" />
        <View style={styles.buttonContainer}>
          <Button
            onPress={this.login}
            title="Login" />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{this.state.errorMessage}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 30,
  },
  input: {
    width: '75%'
  },
  header: {
    fontSize: 30,
    paddingBottom: 30
  },
  buttonContainer: {
    marginTop: 30
  },
  errorContainer: {
    paddingTop: 30,
  },
  errorText: {
    color: 'red',
  }
});