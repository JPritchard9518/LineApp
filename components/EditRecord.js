import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Keyboard,
    Switch
} from 'react-native'
import config from '../config.json';

export default class EditRecord extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        var title = 'Edit Record';
        if(typeof params.record.name !== 'undefined')
            title = 'Edit ' + params.record.name;
        else if(typeof params.record.firstName !== 'undefined')
            title = 'Edit ' + params.record.firstName + ' ' + params.record.lastName
        return {
            title: title,
            headerTitleStyle: {
                color: '#FFF',
            },
        }
    };
    constructor(props) {
        super(props)
        var record = this.props.navigation.state.params.record
        var recordKeys = Object.keys(record)
        this.state = {
            record: record,
            recordKeys: recordKeys,
            permissionTypes: []
        }
        
    }
    componentWillReceiveProps(){
        navigationOptions.title = this.state.record.name;
    }
    componentWillMount(){
        url = config.adminRouteProd + '/mobileAPI/getPermissionTypes';
        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.success)
                    this.setState({permissionTypes:responseJson.permissionTypes})
            })
    }
    saveRecord(){
        Keyboard.dismiss()
        var data = JSON.stringify(this.state.record)
        var url = config.adminRouteProd + '/mobileAPI/saveRecord?data=' + data;
        return fetch(url, {
            method: "POST",
            }).then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.success) {
                        this.props.navigation.state.params.returnData(responseJson.record);
                        this.setState({
                            record: responseJson.record
                        })
                        this.props.navigation.goBack()
                    } else {
                        // Handle failed save here
                    }
                })
                .catch((error) => {
                    this.setState({ errorMessage: error })
                });
    }
    updateText(newValue,key){
        var updatedRecord = Object.assign({},this.state.record);
        updatedRecord[key] = newValue;
        this.setState({record: updatedRecord})
    }
    updateSwitch(value,switchPermission){
        var updatedRecord = this.state.record;
        if(value) // add permission
            updatedRecord.permissions.push(this.permission)
        else{ // remove permission
            var permissionArray = updatedRecord.permissions.filter(permission => permission !== switchPermission)
            updatedRecord.permissions = permissionArray;
        }
        this.setState({record:updatedRecord})

    }
    renderPermission(permission,userPermissions){
        var hasPermission = (userPermissions.indexOf(permission.name) > -1) ? true : false;
        return(
            <View key={permission.name} style={{flex:1, flexDirection:'row'}}>
                <Switch
                    value={hasPermission}
                    ref={permission.name}
                    permission={permission.name}
                    onValueChange={((value) => this.updateSwitch(value, permission.name))}/>
                <Text style={{paddingLeft: 20}}>{permission.label}</Text>
            </View>
        )
    }
    renderTextInput(key,index){
        if(key === 'password') return;
        if(key === 'permissions')
            return(
                <View key={key} style={Styles.inputContainer}>
                    <Text>{key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}</Text>
                    {this.state.permissionTypes.map((permission) => {return this.renderPermission(permission,this.state.record[key])})}
                </View>
            )
        var keyboardType = ([].indexOf(key) > -1) ? "numeric" : "default"; // Place numeric keyboard types inside array
        return(
            <View key={key} style={Styles.inputContainer}>
                <Text>{key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}</Text>
                <TextInput
                    keyboardType={keyboardType}
                    editable={!(key === '_id' || key === 'dateCreated' || key === 'type')}
                    onChangeText={((newValue) => this.updateText(newValue,key))}
                    value={this.state.record[key].toString()}/>
            </View>
        )
    }
    render() {
        return (
            <View style={Styles.container}>
                <ScrollView style={Styles.scrollView}>
                    {this.state.recordKeys.map((key,index) => this.renderTextInput(key,index))}
                </ScrollView>
                <TouchableOpacity style={Styles.saveButton} onPress={() => this.saveRecord()}>
                    <Text style={Styles.saveButtonText}>Save Record</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scrollView:{
        width: '100%',
    },
    inputContainer:{
        alignSelf: 'center',
        width: '90%',
        padding: 10
    },
    saveButton:{
        backgroundColor: '#689F38',
        padding: 10,
        width: 200,
        borderRadius: 5,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 25
    },
    saveButtonText: {
        color: '#FFF'
    }
})