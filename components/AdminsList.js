import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    ActivityIndicator
} from 'react-native'
import config from '../config.json';

export default class AdminsList extends React.Component {
    static navigationOptions = {
        title: 'Admins',
        headerTitleStyle: {
            color: '#FFF',
        },
    };
    constructor(props){
        super(props)
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            admins: [],
            dataSource: ds,
            loaded:false,

        };
    }
    componentDidMount(){
        var url = 'http://' + config.ip + ':' + config.port + '/mobileAPI/retrieveList?type=admins';
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
    renderRow(admin){
        return (
            <View style={Styles.adminContainer}>
                <Text style={Styles.adminContainerText}>First Name: {admin.firstName}</Text>
                <Text style={Styles.adminContainerText}>Last Name: {admin.lastName}</Text>
                <Text style={Styles.adminContainerText}>Date Created: {admin.dateCreated}</Text>
            </View>
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
    adminContainer: {
        padding: 30,
        backgroundColor: '#FFF',
        borderColor: '#000',
        marginBottom: 10,
        margin: 10,
        borderRadius: 3,
        elevation: 3
    },
    adminContainerText: {
        fontSize: 18
    }
})