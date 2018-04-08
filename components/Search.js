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
    Picker
} from 'react-native'
import config from '../config.json';

export default class Search extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        var title = 'Search';
        return {
            title: title,
            headerTitleStyle: {
                color: '#FFF',
            },
        }
    };
    constructor(props) {
        super(props)
        this.state = {
            searchType: 'recipients',
            recipientID: '5aba6683b3a25d0019f5cbc2',
            errorMessage: ''
        }
    }
    findUserByFinger(){
        // Gather finger credentials and return recipient record
        var url = config.adminRouteProd + '/mobileAPI/searchRecipient?&recipientID=' + this.state.recipientID;
        return fetch(url, { method: "GET" }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success) {
                    this.props.navigation.navigate('Recipient', { recipient: responseJson.recipient })
                } else {
                    var remainingAttempts = this.state.remainingAttempts;
                    if (responseJson.type === 'credentialsNotFound')
                        remainingAttempts--;
                    this.setState({
                        recipientResult: '',
                        recipientID: '',
                        errorMessage: responseJson.errorMessage
                    })
                }
            })
            .catch((error) => {
                this.setState({ errorMessage: error })
            });
        return;
    }
    render() {
        return (
            <View style={Styles.container}>
                <Text style={Styles.headerText}>Find Recipient By Fingerprint</Text>
                <View style={Styles.buttonContainer}>
                    <TouchableOpacity style={Styles.scanButton} onPress={() => this.findUserByFinger()}>
                        <Text style={Styles.scanButtonText}>Scan Finger</Text>
                    </TouchableOpacity>
                </View>
                <View style={Styles.errorContainer}>
                    <Text style={Styles.errorMessage}>{this.state.errorMessage}</Text>
                </View>
                {/* <Picker
                    style={{ width: '75%' }}
                    selectedValue={this.state.searchType}
                    onValueChange={(searchType) => this.setState({ searchType: searchType })}>
                    <Picker.Item label="Lines" value="lines" />
                    <Picker.Item label="Recipients" value="recipients" />
                    <Picker.Item label="Line Managers" value="lineManagers" />
                    <Picker.Item label="Admins" value="admins" />
                </Picker> */}
            </View>
        )
    }
}
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    headerText: {
        padding: 20,
        fontSize: 20,
    },
    buttonContainer: {
        flexDirection: 'row'
    },
    scanButton: {
        backgroundColor: '#689F38',
        padding: 10,
        flex: 1,
        // maxWidth: '100%',
        height: 50,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    scanButtonText: {
        color: '#FFF',
        alignSelf: 'center'
    },
    errorContainer:{
        paddingTop: 30
    },
    errorMessage: {
        color: 'red',
        fontSize: 20
    }
    
})