import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native'
import config from '../config.json';

export default class RecipientsList extends React.Component {
    static navigationOptions = {
        title: 'Recipients',
        headerTitleStyle: {
            color: '#FFF',
        },
    };
    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
            loaded:false

        };
    }
    componentDidMount() {
        var url = 'http://' + config.ip + ':' + config.port + '/mobileAPI/retrieveList?type=recipients';
        return fetch(url).then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loaded:true,
                    dataSource: this.state.dataSource.cloneWithRows(responseJson)
                })

            })
            .catch((error) => {
                this.setState({ errorMessage: error })
            });
    }
    renderRow(recipient) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Recipient',{recipient:recipient})} style={Styles.recipientContainer}>
                <Text>First Name: {recipient.firstName}</Text>
                <Text>Last Name: {recipient.lastName}</Text>
                <Text>Country: {recipient.country}</Text>
                <Text>Language(s): {recipient.languages}</Text>
                <Text>Case Number: {recipient.caseNumber}</Text>
                <Text>Housing Location: {recipient.housingLocation}</Text>
                <Text>Special Needs: {recipient.specialNeeds}</Text>
                <Text>Family Members: {recipient.familyMembers.length}</Text>
                <Text>Date Created: {recipient.dateCreated}</Text>
            </TouchableOpacity>
        )
    }
    render() {
        if(this.state.loaded){
            return (
                <ListView
                    style={Styles.container}
                    dataSource={this.state.dataSource}
                    renderRow={(data) => this.renderRow(data)} />
            )
        }else{
            return (
                <View style={Styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    recipientContainer: {
        padding: 30,
        backgroundColor: '#DCDCDC',
        marginBottom: 10
    }
})