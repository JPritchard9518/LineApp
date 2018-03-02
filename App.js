import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { StackNavigator, DrawerNavigator } from 'react-navigation'
import LoginScreen from './components/Login.js'
import AdminsList from './components/AdminsList.js'
import UsersList from './components/UsersList.js'
import LineManagersList from './components/LineManagersList.js'
import LinesList from './components/LinesList.js'
import Line from './components/Line.js'
import Icon from 'react-native-vector-icons/FontAwesome';


// https://reactnavigation.org/
// https://shift.infinite.red/react-navigation-drawer-tutorial-a802fc3ee6dc

const LineStack = StackNavigator({
  "Lines": {screen: LinesList},
  "Line": {screen: Line}
},{
    headerMode: 'none',
    initialRouteName: 'Lines'
})
// drawer stack (menu)
const DrawerStack = DrawerNavigator({
  "Lines": { screen: LineStack },
  "Admins": { screen: AdminsList },
  "Users": { screen: UsersList },
  "Line Mangers": { screen: LineManagersList },
})

const DrawerNavigation = StackNavigator({
  DrawerStack: { screen: DrawerStack }
}, {
    headerMode: 'float',
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#0288D1' },
      headerLeft: <Icon name="bars" size={25} style={{ marginLeft: 15, color: "#FFF" }} onPress={() => (navigation.state.index === 0) ? navigation.navigate('DrawerOpen') : navigation.navigate('DrawerClose')} />,
      headerRight: (
        <TouchableOpacity
          onPress={() => navigation.navigate({ routeName: 'loginStack' })}
          style={{ marginRight: 15, borderColor: '#FFF'}}
        ><Text style={{color: "#FFF", fontWeight: "700", fontSize: 15}}>Logout</Text></TouchableOpacity>
      ),
    })
  })

// login stack
const LoginStack = StackNavigator({
  loginScreen: { screen: LoginScreen },
}, {
    headerMode: 'float',
    navigationOptions: {
      headerStyle: { backgroundColor: '#C02C33' },
    },
  })

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  loginStack: { screen: LoginStack },
  drawerStack: { screen: DrawerNavigation }
}, {
    // Default config for all screens
    headerMode: 'none',
    title: 'Main',
    initialRouteName: 'loginStack',
  })

export default PrimaryNav