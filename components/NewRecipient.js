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
    Keyboard,
    NativeModules,
    Alert
} from 'react-native';
import moment from 'moment';
import config from '../config.json';
import DatePicker from 'react-native-datepicker';
import CountryPicker from 'react-native-country-picker-modal'
import { NavigationActions } from 'react-navigation';

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
                notes: "",
                familyMembers: [],
                fmd: ""
            },
            customFields:[],
            message: '',
            familyMemberCount: 0,
        };
        this.saveRecipient = this.saveRecipient.bind(this);
        this.addFamilyMember = this.addFamilyMember.bind(this);
        this.scanFinger = this.scanFinger.bind(this);
    }
    componentDidMount() {
        var url = config.adminRouteProd + '/mobileAPI/retrieveSettings?type=recipient';
        return fetch(url).then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    customFields: responseJson.settings.fields
                })

            })
            .catch((error) => {
                this.setState({ errorMessage: error })
            });
    }
    saveRecipient() {
        Keyboard.dismiss()
        if(this.state.record.fmd === ""){
            return Alert.alert(
                'Fingerprint Not Captured',
                'A recipient may not be saved without a captured fingerprint. Please press the "Scan Finger" button.',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            )
        }
        var data = JSON.stringify(this.state.record)
        var url = config.adminRouteProd + '/mobileAPI/saveRecipient?data=' + data;
        return fetch(url, {
            method: "POST",
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success) {
                    // this.setState({message: "Recipient Successfully Added"})
                    const newRecipientAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Add New Recipient' })
                        ],
                    });
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Lines' })
                        ],
                    });
                    return Alert.alert(
                        "Recipient Successfully Added!",
                        "Would you like to add another new recipient, or return to the lines list?",
                        [
                            { text: 'New Recipient', onPress: () => this.props.navigation.dispatch(newRecipientAction)},
                            { text: 'Lines List', onPress: () => this.props.navigation.dispatch(resetAction)}
                        ],
                        { cancelable: false}
                    )
                    
                } else {
                    this.setState({message: "Error: Recipient Could Not Be Added"})
                }
            })
            .catch((error) => {
                this.setState({ errorMessage: error })
            });
    }
    scanFinger(){
        NativeModules.OpenScanApp.openScanAppAndEnroll(fmd => {
            var record = this.state.record;
            record.fmd = fmd;
            this.setState({record:record,message: 'Fingerprint ID successfully captured'})
        })
    }
    updateFamText(newValue,key,index){
        var updateRecord = this.state.record;
        updateRecord.familyMembers[index][key] = newValue;
        this.setState({record: updateRecord})
    }
    updateText(newValue,key) {
        var updatedRecord = this.state.record;
        updatedRecord[key] = newValue;
        this.setState({ record: updatedRecord })
    }
    renderCustomFields(key,index){
        return(
            <View key={key} style={Styles.inputContainer}>
                <Text>{key}</Text>
                <TextInput
                    onChangeText={((newValue) => this.updateText(newValue, key))}
                    value={this.state.record.familyMembers[index][key]} />
            </View>
        )
    }
    renderFamilyInput(){
            return(
            <View>
                {this.state.record.familyMembers.map((key, index)=> this.renderFam(key,index))}
            </View>
        )
    }
    renderFam(obj,famArrPos){
        return(
            <View key={"Fam="+famArrPos}>
                <Text style={Styles.header}>Family Member {famArrPos + 1}</Text>
                {Object.keys(obj).map((field) => this.renderInput(field,famArrPos,obj))}
            </View>
        )
    }
    renderInput(field,index,obj){
        var keys={
            firstName:'First Name',
            lastName: 'Last Name',
            country: 'Country',
            languages: 'Languages',
            dateOfBirth: 'Date of Birth',
            caseNumber: 'Case Number',
            housingLocation: 'Housing Location',
            specialNeeds: 'Special Needs',
            notes: 'Notes'
        }
        if(field === 'dateOfBirth'){
            return (
                <View key={index + field} style={Styles.inputContainer}>
                    <Text>{keys[field]}</Text>
                    <DatePicker
                        style={{ width: '100%' }}
                        date={this.state.record.familyMembers[index]["dateOfBirth"]}
                        mode="date"
                        format="MM/DD/YYYY"
                        minDate="2016-05-01"
                        maxDate={moment().format('MM/DD/YYYY')}
                        showIcon={true}
                        onDateChange={(date) => { this.updateFamText(date, "dateOfBirth", index) }} />
                </View>
            )
        }else if(field === 'country'){
            return(
                <View key={index + field} style={Styles.inputContainer}>
                    <Text>{keys[field]}</Text>
                    <View style={Styles.countryInputContainer}>
                        <Text style={Styles.countryText}>{this.state.record.familyMembers[index].country.name || "Press Flag to Select Country"}</Text>
                        
                        <CountryPicker
                            onChange={(country) => this.updateFamText(country, "country", index)}
                            cca2={this.state.record.familyMembers[index].country.cca2 || "GR"}
                            translation='eng'
                        />
                    </View>
                </View>
            )
        }
        return(
            <View key={index + field} style={Styles.inputContainer}>
                <Text>{keys[field]}</Text>
                <TextInput
                    onChangeText={((newValue) => this.updateFamText(newValue, field,index))}
                    value={obj[field]} />
            </View>
        )
    }
    addFamilyMember(){
        var famNum = this.state.familyMemberCount;
        var familyMembers = this.state.record.familyMembers;
        var famObj = {
            firstName: "",
            lastName: "",
            country: "",
            languages: "",
            dateOfBirth: "",
            caseNumber: "",
            housingLocation: "",
            specialNeeds: "",
            notes: "",
        }
        var newFamObj = {}
        for (field in famObj) {
            var newField = (famNum - 1) + field
            newFamObj[newField] = ""
        }
        familyMembers.push(famObj);
        var record = this.state.record;
        record.familyMembers = familyMembers;
        this.setState({record: record, familyMemberCount: famNum+1})
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
                        <View style={Styles.countryInputContainer}>
                            <Text style={Styles.countryText}>{this.state.record.country.name || "Press Flag to Select Country"}</Text>
                            {/* Select region for smaller list of countries */}
                            <CountryPicker
                                onChange={(country) => this.updateText(country, "country")}
                                cca2={this.state.record.country.cca2 || "GR"}
                                translation='eng'
                                style={{width: '100%'}}
                            />
                        </View>
                    </View>
                    <View style={Styles.inputContainer}>
                        <Text>Language(s)</Text>
                        <TextInput
                            onChangeText={((newValue) => this.updateText(newValue, "languages"))}
                            value={this.state.record["languages"]} />
                    </View>
                    
                    <View style={Styles.inputContainer}>
                        <Text>Date of Birth</Text>
                        <DatePicker
                            style={{width:'100%'}}
                            date={this.state.record["dateOfBirth"]}
                            mode="date"
                            format="MM/DD/YYYY"
                            minDate="2016-05-01"
                            maxDate={moment().format('MM/DD/YYYY')}
                            showIcon={true}
                            onDateChange={(date) => { this.updateText(date, "dateOfBirth") }} />
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
                    <View style={Styles.inputContainer}>
                        <Text>Special Needs</Text>
                        <TextInput
                            onChangeText={((newValue) => this.updateText(newValue, "specialNeeds"))}
                            value={this.state.record["specialNeeds"]} />
                    </View>
                    <View style={Styles.inputContainer}>
                        <Text>Notes</Text>
                        <TextInput
                            multiline={true}
                            onChangeText={((newValue) => this.updateText(newValue, "notes"))}
                            value={this.state.record["notes"]} />
                    </View>
                    {this.state.customFields.map((key,index) => this.renderCustomFields(key,index))}
                    {this.renderFamilyInput()}
                </ScrollView>
                <TouchableOpacity style={Styles.button} onPress={() => this.addFamilyMember()}>
                    <Text style={Styles.buttonText}>Add Family Member</Text>
                </TouchableOpacity>
                { this.state.record.fmd === "" && 
                    <TouchableOpacity style={Styles.button} onPress={() => this.scanFinger()}>
                        <Text style={Styles.buttonText}>Scan Finger</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity style={Styles.button} onPress={() => this.saveRecipient()}>
                    <Text style={Styles.buttonText}>Save Recipient</Text>
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
    button: {
        width: '95%',
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
    },
    countryInputContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        marginBottom: 10
    },
    countryText:{
        fontSize:18
    }
})