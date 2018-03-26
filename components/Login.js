import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
    var url = 'http://' + config.ip + ':' + config.port + '/mobileAPI/login?userName=' + userName + '&password=' + password;
    return fetch(url).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          global.currentlyLoggedIn = responseJson.loggedIn;
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
        <Text style={styles.header}>Login</Text>
        <TextInput
          ref="userName"
          style={styles.input}
          onChangeText={(userName) => this.setState({ userName: userName })}
          placeholder="Username"
          autoCapitalize='none'/>
        <TextInput
          ref="password"
          style={styles.input}
          onChangeText={((password) => this.setState({ password: password }))}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize='none'/>
        <View style={{ marginTop: 20 }}>
          <Text style={{fontSize:20, paddingBottom: 20}}>Testing Credentials:</Text>
          <Text>LM User Name: testLM</Text>
          <Text style={{paddingBottom: 20}}>Password: password123</Text>
          <Text>Admin User Name: testAdmin</Text>
          <Text>Password: password123</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={() => this.login()}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
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
  },
  loginButton: {
    backgroundColor: '#689F38',
    paddingLeft: 50,
    paddingRight: 50,
    // width: '50%',
    height: 40,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFF',
    alignSelf: 'center'
  },
});