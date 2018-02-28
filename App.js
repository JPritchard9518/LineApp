import React from 'react'
import { Text } from 'react-native'
import { StackNavigator, DrawerNavigator } from 'react-navigation'
import LoginScreen from './components/Login.js'
import Admins from './components/Admins.js'
import Users from './components/Users.js'
import LineManagers from './components/LineManagers.js'
import Lines from './components/Lines.js'

// drawer stack
const DrawerStack = DrawerNavigator({
  "Lines": { screen: Lines },
  "Admins": { screen: Admins },
  "Users": { screen: Users },
  "Line Mangers": { screen: LineManagers },
})
// https://reactnavigation.org/
// https://shift.infinite.red/react-navigation-drawer-tutorial-a802fc3ee6dc
const DrawerNavigation = StackNavigator({
  DrawerStack: { screen: DrawerStack }
}, {
    headerMode: 'float',
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#0288D1' },
      headerLeft: <Text style={{marginLeft: 15, color:"#FFF"}} onPress={() => navigation.navigate('DrawerOpen')}>Menu</Text>
    })
  })

// login stack
const LoginStack = StackNavigator({
  loginScreen: { screen: LoginScreen },
}, {
    headerMode: 'float',
    navigationOptions: {
      headerStyle: { backgroundColor: '#C02C33' },
      title: 'You are not logged in'
    }
  })

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  loginStack: { screen: LoginStack },
  drawerStack: { screen: DrawerNavigation }
}, {
    // Default config for all screens
    headerMode: 'none',
    title: 'Main',
    initialRouteName: 'loginStack'
  })

export default PrimaryNav