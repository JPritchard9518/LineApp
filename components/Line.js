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
            errorMessage:''
        };
        this.attemptLineAccess = this.attemptLineAccess.bind(this);
    }
    attemptLineAccess(){
        var url = 'http://' + config.ip + ':' + config.port + '/mobileAPI/attemptLineAccess?lineID=' + this.state.line._id;
        return fetch(url,{method:"POST"}).then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.success){
                    this.setState({
                        line: responseJson.line
                    })
                }else{
                    // User was not granted access
                }
            })
            .catch((error) => {
                this.setState({ errorMessage: error })
            });
    }
    render() {
        return (
            <View style={Styles.container}>
                <View style={Styles.lineInfo}>
                    <Text style={Styles.lineAttribute}>Name: {this.state.line.name}</Text>
                    <Text style={Styles.lineAttribute}>Resource: {this.state.line.resource}</Text>
                    <Text style={Styles.lineAttribute}>Capacity: {this.state.line.currentCapacity}/{this.state.line.capacity}</Text>
                    <Text style={Styles.lineAttribute}>Open - Close: {this.state.line.openCloseTime}</Text>
                </View>
                <Text>{this.state.errorMessage}</Text>
                <TouchableOpacity style={Styles.accessButton} onPress={() => this.attemptLineAccess()}>
                    <Text style={Styles.accessButtonText}>Access Line</Text>
                </TouchableOpacity>
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
    lineInfo:{
        justifyContent: 'space-between',
        padding: 20,
    },
    lineAttribute:{
        fontSize: 20
    },
    accessButton:{
        backgroundColor: '#689F38',
        padding: 10,
        width: 200,
        borderRadius: 5,
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 25
    },
    accessButtonText:{
        color: '#FFF'
    }
})