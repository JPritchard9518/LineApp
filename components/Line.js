import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity
} from 'react-native'
import config from '../config.json';

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
            currentRecipientID: "5a995fd737449d965cf8e98b"
        };
        this.attemptLineAccess = this.attemptLineAccess.bind(this);
    }
    attemptLineAccess(){
        var url = 'http://' + config.ip + ':' + config.port + '/mobileAPI/attemptLineAccess?lineID=' + this.state.line._id + '&recipientID=' + this.state.currentRecipientID;
        return fetch(url,{method:"POST"}).then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.success){
                    this.setState({
                        line: responseJson.line
                    })
                }else{
                    // Handle recipient denied access here
                }
            })
            .catch((error) => {
                this.setState({ errorMessage: error })
            });
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
                    </View>
                    <Text>{this.state.errorMessage}</Text>
                    <Text style={{width: '75%', alignSelf: 'center', fontSize: 20}}>Recipient Currently Accessing: {this.state.currentRecipientID}</Text>
                    <View style={Styles.buttonContainer}>
                        <TouchableOpacity style={Styles.accessButton} onPress={() => this.attemptLineAccess()}>
                            <Text style={Styles.accessButtonText}>Access Line</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={Styles.accessButton} onPress={() => this.props.navigation.navigate('EditRecord', { record: this.state.line })}>
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