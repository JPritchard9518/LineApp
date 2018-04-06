import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { StackNavigator, DrawerNavigator } from 'react-navigation'
import LoginScreen from './components/Login.js'
import AdminsList from './components/AdminsList.js'
import RecipientsList from './components/RecipientsList.js'
import Recipient from './components/Recipient.js'
import NewRecipient from './components/NewRecipient.js'
import LineManagersList from './components/LineManagersList.js'
import LinesList from './components/LinesList.js'
import Line from './components/Line.js'
import EditRecord from './components/EditRecord.js'
import Search from './components/Search.js'
import Icon from 'react-native-vector-icons/FontAwesome'; // https://github.com/oblador/react-native-vector-icons

import SideMenu from './components/SideMenu.js'

// https://reactnavigation.org/
// https://shift.infinite.red/react-navigation-drawer-tutorial-a802fc3ee6dc
// https://shift.infinite.red/react-navigation-drawer-tutorial-part-2-9c382217ac6b
const RecipientStack = StackNavigator({
  "Recipients": {screen: RecipientsList},
  "Recipient": {screen: Recipient}
},{
    headerMode: 'none',
    initialRouteName: 'Recipients'
})
const LineStack = StackNavigator({
  "Lines": {screen: LinesList},
  "Line": {screen: Line},
  "Recipient": {screen: Recipient},
  "EditRecord": {screen: EditRecord}
},{
    headerMode: 'none',
    initialRouteName: 'Lines'
})
const AdminStack = StackNavigator({
  "Admins": {screen: AdminsList},
  "EditRecord": {screen: EditRecord}
},{
  headerMode: 'none',
  initialRouteName: 'Admins'
})
const LineManagerStack = StackNavigator({
  "LineManagers": { screen: LineManagersList },
  "EditRecord": { screen: EditRecord }
}, {
    headerMode: 'none',
    initialRouteName: 'LineManagers'
  })
// drawer menu routes
const DrawerStack = DrawerNavigator({
  "Lines": { screen: LineStack },
  "Admins": { screen: AdminStack },
  "Recipients": { screen: RecipientStack },
  "Line Managers": { screen: LineManagerStack },
  "Add New Recipient": { screen: NewRecipient },
  "Search": { screen: Search },
},
{
  contentComponent: ({navigation}) => (
    <SideMenu navigation={navigation} />
  )
  // contentComponent: {props => <SideMenu {...props} {...myProps} />} //https://codeburst.io/custom-drawer-using-react-navigation-80abbab489f7
})

// Stack for Drawer Menu
const DrawerNavigation = StackNavigator({
  DrawerStack: { screen: DrawerStack }
}, {
    headerMode: 'float',
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#0288D1' },
      headerLeft: <View style={{ flexDirection: 'row' }}><Icon name="bars" size={25} style={{ marginLeft: 15, color: "#FFF" }} onPress={() => navigation.navigate('DrawerToggle')} /></View>,
      headerRight: (
        <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 15, paddingRight: 15 }}>{global.currentlyLoggedIn.firstName} {global.currentlyLoggedIn.lastName}</Text>
        // <TouchableOpacity
        //   onPress={() => navigation.navigate({ routeName: 'loginStack' })}
        //   style={{ marginRight: 15, borderColor: '#FFF'}}
        // ><Text style={{color: "#FFF", fontWeight: "700", fontSize: 15}}>Logout</Text></TouchableOpacity>
      ),
    })
  })

// Routes for login stack
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