import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    ScrollView,
    Keyboard
} from 'react-native';
import moment from 'moment';
import config from '../config.json';

export default class NewRecipient extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            title: params ? params.recipient.name : 'New Recipient',
            headerTitleStyle: {
                color: '#FFF',
            },
        }
    };
    constructor(props) {
        super(props)
        this.state = {
            record: {
                firstName: "",
                lastName: "",
                country: "",
                languages: "",
                dateOfBirth: "",
                caseNumber: "",
                housingLocation: "",
                specialNeeds: "",
            },
            message: ''
        };
        this.saveRecipient = this.saveRecipient.bind(this);
    }
    saveRecipient() {
        Keyboard.dismiss()
        var data = JSON.stringify(this.state.record)
        var url = 'http://' + config.ip + ':' + config.port + '/mobileAPI/saveRecipient?data=' + data;
        return fetch(url, {
            method: "POST",
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success) {
                    this.setState({message: "Recipient Successfully Added"})
                } else {
                    this.setState({message: "Error: Recipient Could Not Be Added"})
                }
            })
            .catch((error) => {
                this.setState({ errorMessage: error })
            });
    }
    updateText(newValue,key) {
        var updatedRecord = this.state.record;
        updatedRecord[key] = newValue;
        this.setState({ record: updatedRecord })
    }
    render() {
        return (
            <View style={Styles.container}>
                <Text style={Styles.header}>New Recipient</Text>
                <ScrollView>
                    <View style={Styles.inputContainer}>
                        <Text>First Name</Text>
                        <TextInput
                            onChangeText={((newValue) => this.updateText(newValue, "firstName"))}
                            value={this.state.record["firstName"]} />
                    </View>
                    <View style={Styles.inputContainer}>
                        <Text>Last Name</Text>
                        <TextInput
                            onChangeText={((newValue) => this.updateText(newValue, "lastName"))}
                            value={this.state.record["lastName"]} />
                    </View>
                    <View style={Styles.inputContainer}>
                        <Text>Country</Text>
                        <TextInput
                            onChangeText={((newValue) => this.updateText(newValue, "country"))}
                            value={this.state.record["country"]} />
                    </View>
                    <View style={Styles.inputContainer}>
                        <Text>Language(s)</Text>
                        <TextInput
                            onChangeText={((newValue) => this.updateText(newValue, "languages"))}
                            value={this.state.record["languages"]} />
                    </View>
                    <View style={Styles.inputContainer}>
                        <Text>Date of Birth</Text>
                        <TextInput
                            onChangeText={((newValue) => this.updateText(newValue, "dateOfBirth"))}
                            value={this.state.record["dateOfBirth"]} />
                    </View>
                    <View style={Styles.inputContainer}>
                        <Text>Case Number</Text>
                        <TextInput
                            onChangeText={((newValue) => this.updateText(newValue, "caseNumber"))}
                            value={this.state.record["caseNumber"]} />
                    </View>
                    <View style={Styles.inputContainer}>
                        <Text>Housing Location</Text>
                        <TextInput
                            onChangeText={((newValue) => this.updateText(newValue, "housingLocation"))}
                            value={this.state.record["housingLocation"]} />
                    </View>
                </ScrollView>
                <TouchableOpacity style={Styles.saveButton}>
                    <Text style={Styles.saveButtonText}>Scan Finger</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.saveButton} onPress={() => this.saveRecipient()}>
                    <Text style={Styles.saveButtonText}>Save Recipient</Text>
                </TouchableOpacity>
                <View style={Styles.messageContainer}>
                    <Text style={Styles.messageText}>{this.state.message}</Text>
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between'
    },
    header:{
        alignSelf: 'center',
        marginTop: 20,
        fontSize:30
    },
    inputContainer:{
        paddingLeft: 20,
        paddingRight: 20
    },
    saveButton: {
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
    },
    messageContainer:{
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 20,
        height: 'auto'
    },
    messageText:{
        color: '#000',
        alignSelf: 'center',
    }
})