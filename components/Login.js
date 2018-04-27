import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  NetInfo,
  AsyncStorage,
  NativeModules
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
      connected: ''
    }
    this.login = this.login.bind(this);
    this.openScanApp1 = this.openScanApp1.bind(this);
  }
  componentDidMount() {
    AsyncStorage.clear()
    NetInfo.isConnected.fetch().then((isConnected) => {
      global.networkConnected = isConnected;
      this.setState({ connected: isConnected })
    });
    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
  }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
  }
  // Connection Type: none, wifi, cellular, unknown
  _handleConnectionChange = (isConnected) => {
    global.networkConnected = isConnected;
    this.setState({connected:isConnected})
  }
  login() {
    Keyboard.dismiss()
    var userName = this.state.userName;
    var password = this.state.password;
    userName = 'testUser'
    password = 'password123'
    var url = config.adminRouteProd + '/mobileAPI/login?userName=' + userName + '&password=' + password;
    return fetch(url).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          global.currentlyLoggedIn = responseJson.loggedIn;
          this.props.navigation.navigate('drawerStack')
        } else {
          global.currentlyLoggedIn = {}
          this.setState({ errorMessage: responseJson.message })
        }
      })
      .catch((error) => {
        this.setState({ errorMessage: error })
      });
  }
  openScanApp1(){
    NativeModules.OpenScanApp.openSettings1(data => {
      this.setState({errorMessage:data})
      // console.log('call back data validate',data)
    });
  }
  openScanApp2() {
    NativeModules.OpenScanApp.openSettings2(fid => {
      console.log('call back data enroll', fid)
    })
  }
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <Text style={{ color: (global.networkConnected) ? '#689F38' : '#BE2E37'}}>{(global.networkConnected) ? "Connected":"Not Connected - Please Connect to Network to Login"}</Text>
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
          <Text>Username: testUser</Text>
          <Text style={{paddingBottom: 20}}>Password: password123</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => this.login()}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.openScanApp1}>
            <Text style={styles.buttonText}>Launch Settings 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.openScanApp2}>
            <Text style={styles.buttonText}>Launch Settings 2</Text>
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
    marginTop: 30,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  errorContainer: {
    paddingTop: 30,
  },
  errorText: {
    color: 'red',
  },
  button: {
    width: '50%',
    marginTop: 10,
    height: 50,
    backgroundColor: '#689F38',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    borderRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    alignSelf: 'center',
    fontSize: 20
  },
});