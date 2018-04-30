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
        var url = config.adminRoute + '/mobileAPI/searchRecipient?&recipientID=' + this.state.recipientID;
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
                    <TouchableOpacity style={Styles.button} onPress={() => this.findUserByFinger()}>
                        <Text style={Styles.buttonText}>Scan Finger</Text>
                    </TouchableOpacity>
                </View>
                <View style={Styles.errorContainer}>
                    <Text style={Styles.errorMessage}>{this.state.errorMessage}</Text>
                </View>
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
    errorContainer:{
        paddingTop: 30
    },
    errorMessage: {
        color: 'red',
        fontSize: 20
    }
    
})