import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView
} from 'react-native'
import config from '../config.json';

export default class Admins extends React.Component {
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

        };
    }
    componentDidMount(){
        var url = 'http://' + config.ip + ':' + config.port + '/mobileAPI/retrieveList?type=admins';
        return fetch(url).then((response) => response.json())
            .then((responseJson) => {
                debugger;
                this.setState({
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
                <Text>First Name: {admin.firstName}</Text>
                <Text>Last Name: {admin.lastName}</Text>
                <Text>Date Created: {admin.dateCreated}</Text>
            </View>
        )
    }
    render() {
        return (
            <ListView
                style={Styles.container}
                dataSource={this.state.dataSource}
                renderRow={(data) => this.renderRow(data)}/>
        )
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 20
    },
    adminContainer:{
        padding: 30,
        backgroundColor: '#DCDCDC',
        marginBottom: 10
    }
})