import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView
} from 'react-native'

export default class Users extends React.Component {
    static navigationOptions = {
        title: 'Users',
        headerTitleStyle: {
            color: '#FFF',
        },
    };
    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            users: [],
            dataSource: ds,

        };
    }
    componentDidMount() {
        var url = 'http://10.0.0.6:3000/mobileAPI/retrieveList?type=users';
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
    renderRow(user) {
        return (
            <View style={Styles.userContainer}>
                <Text>First Name: {user.firstName}</Text>
                <Text>Last Name: {user.lastName}</Text>
                <Text>Country: {user.country}</Text>
                <Text>Language(s): {user.languages}</Text>
                <Text>Case Number: {user.caseNumber}</Text>
                <Text>Housing Location: {user.housingLocation}</Text>
                <Text>Special Needs: {user.specialNeeds}</Text>
                <Text>Family Members: {user.familyMembers.length}</Text>
                <Text>Date Created: {user.dateCreated}</Text>
            </View>
        )
    }
    render() {
        return (
            <ListView
                style={Styles.container}
                dataSource={this.state.dataSource}
                renderRow={(data) => this.renderRow(data)} />
        )
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 20
    },
    userContainer: {
        padding: 30,
        backgroundColor: '#DCDCDC',
        marginBottom: 10
    }
})