import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import moment from 'moment';
import config from '../config.json';

export default class Recipient extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            title: params ? params.recipient.name : 'Recipient',
            headerTitleStyle: {
                color: '#FFF',
            },
        }
    };
    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            recipient: this.props.navigation.state.params.recipient,
            errorMessage: '',
            dataSource: ds,
            loaded: false
        };
    }
    componentDidMount() {
        var url = 'http://' + config.ip + ':' + config.port + '/mobileAPI/retrieveRecipientActions?recipientID=' + this.state.recipient._id;
        return fetch(url).then((response) => response.json())
            .then((responseJson) => {
                // Add error checking
                this.setState({
                    loaded: true,
                    dataSource: this.state.dataSource.cloneWithRows(responseJson.recipientActions.actions)
                })

            })
            .catch((error) => {
                this.setState({ errorMessage: error })
            });
    }
    renderRow(data){
        return(
            <View style={Styles.actionContainer}>
                <Text style={Styles.actionContainerText}>Date: {moment(data.date).format("MM/DD/YYYY hh:mm:ss A")}</Text>
                <Text style={Styles.actionContainerText}>Line ID: {data.lineID}</Text>
                <Text style={Styles.actionContainerText}>Line Name: {data.lineName}</Text>
                <Text style={Styles.actionContainerText}>Resource: {data.resource}</Text>
                <Text style={Styles.actionContainerText}>Number Taken: {data.numTaken}</Text>
            </View>
        )

    }
    renderRecipientActions(){
        if(this.state.loaded){
            return (
                <ListView
                    style={Styles.listContainer}
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
    render() {
        return (
            <View style={Styles.container}>
                <View style={Styles.lineInfo}>
                    <Text style={Styles.recipientAttribute}>First Name: {this.state.recipient.firstName}</Text>
                    <Text style={Styles.recipientAttribute}>Last Name: {this.state.recipient.lastName}</Text>
                    <Text style={Styles.recipientAttribute}>Date Created: {moment(this.state.recipient.dateCreated).format("MM/DD/YYYY hh:mm:ss A")}</Text>
                    <Text style={Styles.recipientAttribute}>Family Members: {this.state.recipient.familyMembers.length}</Text>
                </View>
                {this.renderRecipientActions()}
                <Text>{this.state.errorMessage}</Text>
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
    lineInfo: {
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        marginBottom: 20
    },
    recipientAttribute: {
        fontSize: 20
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    listContainer:{
        flex:1,
        backgroundColor: '#FFF'
    },
    actionContainer: {
        padding: 30,
        backgroundColor: '#FFF',
        borderColor: '#000',
        marginBottom: 10,
        margin: 10,
        borderRadius: 3,
        elevation: 3
    },
    actionContainerText: {
        fontSize: 18
    }
})