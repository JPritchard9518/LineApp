import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity
} from 'react-native';
import config from '../config.json';
import moment from 'moment';

export default class Line extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            title: params ? params.line.name : 'Line',
            headerTitleStyle: {
                color: '#FFF',
            },
        }
    };
    constructor(props) {
        super(props)
        this.state = {
            line: this.props.navigation.state.params.line,
            errorMessage:'',
            accessFault: false,
            accessSuccess: false,
            currentFault: {},
            currentSuccess: {},
            faultType: '',
            remainingAttempts: 3, // For rescanning a fingerprint when credentials were not found.
            currentRecipientID: "5a995fd737449d965cf8e98b" // Need to update this once finger is scanned
        };
        this.attemptLineAccess = this.attemptLineAccess.bind(this);
        this.renderAccessFault = this.renderAccessFault.bind(this);
        this.renderAccessSuccess = this.renderAccessSuccess.bind(this);
    }
    returnData(lineObj){
        this.setState({line: lineObj})
    }
    attemptLineAccess(){
        if(this.state.remainingAttempts === 0){
            return this.setState({faultType: 'maxAttemptsReached', remainingAttempts: 3})
        }
        var url = 'http://' + config.ip + ':' + config.port + '/mobileAPI/attemptLineAccess?lineID=' + this.state.line._id + '&recipientID=' + this.state.currentRecipientID + '&accessFrequency=' + this.state.line.accessFrequency;
        return fetch(url,{method:"POST"}).then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.success){
                    const { setParams } = this.props.navigation;
                    this.setState({
                        line: responseJson.line,
                        accessFault: false,
                        accessSuccess: true,
                        currentSuccess: responseJson.accessSuccess,
                        faultType: '',
                        remainingAttempts: 3,
                    })
                }else{
                    var remainingAttempts = this.state.remainingAttempts;
                    if(responseJson.type === 'credentialsNotFound')
                        remainingAttempts--;
                    this.setState({
                        accessFault:true,
                        accessSuccess: false,
                        currentFault: responseJson.accessFault || {},
                        faultType: responseJson.type,
                        remainingAttempts: remainingAttempts
                    })
                }
            })
            .catch((error) => {
                this.setState({ errorMessage: error })
            });
    }
    renderAccessFault(){
        if(this.state.accessFault === false)
            return
        if(this.state.faultType === 'faultyAccess'){
            var faultDate = moment(this.state.currentFault.date);
            var now = moment();
            var validAccessDate = moment(faultDate).add(this.state.line.accessFrequency,'hours');
            var timeDiff = validAccessDate.diff(now,'milliseconds');
            var seconds = Math.floor((timeDiff / 1000) % 60);
            var minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
            var hours = Math.floor(((timeDiff / (1000 * 60 * 60)) % 24));
            var timeString = hours.toFixed(0) + ' hours, ' +  minutes.toFixed(0) +  ' minutes, ' + seconds.toFixed(0) + ' seconds';
            
            return(
                <View style={Styles.faultContainer}>
                    <Text style={[Styles.faultAttribute,{fontSize: 25}]}>Access Fault</Text>
                    <Text style={Styles.faultAttribute}>Last Line Access: {moment(this.state.currentFault.date).format("MM/DD/YYYY hh:MM:SS A")}</Text>
                    <Text style={Styles.faultAttribute}>Next Valid Access: {moment(validAccessDate).format("MM/DD/YYYY hh:MM:SS A")} ({timeString})</Text>
                </View>
            )
        }else if(this.state.faultType === 'credentialsNotFound'){
            return(
                <View style={Styles.faultContainer}>
                    <Text style={[Styles.faultAttribute,{fontSize: 25}]}>Credentials Not Found</Text>
                    <Text style={[Styles.faultAttribute, { fontSize: 22 }]}>Please Try Again</Text>
                    <Text style={Styles.faultAttribute}>Attempts Remaining: {this.state.remainingAttempts}</Text>
                </View>
            )
        }else if(this.state.faultType === 'maxAttemptsReached'){
            return(
                <View style={Styles.faultContainer}>
                    <Text style={[Styles.faultAttribute, { fontSize: 25 }]}>Access Denied: Maximum Attempts Have Been Reached</Text>
                </View>
            )
        }
    }
    renderAccessSuccess(){
        if (this.state.accessSuccess === false)
            return
        var faultDate = moment(this.state.currentSuccess.date);
        var now = moment();
        var validAccessDate = moment(faultDate).add(this.state.line.accessFrequency, 'hours');
        var timeString = this.state.line.accessFrequency + ' hour(s) from now'
        return (
            <View style={Styles.successContainer}>
                <Text style={[Styles.successAttribute, { fontSize: 25 }]}>Successful Access</Text>
                <Text style={Styles.successAttribute}>Last Line Access: {moment(this.state.currentSuccess.date).format("DD/MM/YYYY hh:MM:SS A")}</Text>
                <Text style={Styles.successAttribute}>Next Valid Access: {moment(validAccessDate).format("DD/MM/YYYY hh:MM:SS A")} ({timeString})</Text>
            </View>
        )
    }
    render() {
        return (
            <View style={Styles.container}>
                <View style={Styles.contentContainer}>
                    <View style={Styles.lineInfo}>
                        <Text style={Styles.lineAttribute}>Name: {this.state.line.name}</Text>
                        <Text style={Styles.lineAttribute}>Resource: {this.state.line.resource}</Text>
                        <Text style={Styles.lineAttribute}>Capacity: {this.state.line.currentCapacity}/{this.state.line.capacity}</Text>
                        <Text style={Styles.lineAttribute}>Open - Close: {this.state.line.openCloseTime}</Text>
                        <Text style={Styles.lineAttribute}>Access Frequency: {this.state.line.accessFrequency} hrs</Text>
                    </View>
                    <Text>{this.state.errorMessage}</Text>
                    {this.renderAccessFault()}
                    {this.renderAccessSuccess()}
                    <Text style={{width: '75%', alignSelf: 'center', fontSize: 20}}>Recipient Currently Accessing: {this.state.currentRecipientID}</Text>
                    <View style={Styles.buttonContainer}>
                        <TouchableOpacity style={Styles.accessButton} onPress={() => this.attemptLineAccess()}>
                            <Text style={Styles.accessButtonText}>Access Line</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={Styles.accessButton} onPress={() => this.props.navigation.navigate('EditRecord', { record: this.state.line, returnData: this.returnData.bind(this)})}>
                            <Text style={Styles.accessButtonText}>Edit Line</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    faultContainer:{
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#C02C33'
    },
    faultAttribute:{
        fontSize: 18,
        color: '#FFF'
    },
    successContainer:{
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#689F38'
    },
    successAttribute: {
        fontSize: 18,
        color: '#FFF'
    },
    lineInfo:{
        justifyContent: 'space-between',
        padding: 20,
    },
    lineAttribute:{
        fontSize: 20
    },
    buttonContainer:{
        // justifyContent: 'flex-end'
    },
    accessButton:{
        backgroundColor: '#689F38',
        padding: 10,
        width: 200,
        borderRadius: 5,
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 25,
        justifyContent:'flex-end',
    },
    accessButtonText:{
        color: '#FFF'
    },
})