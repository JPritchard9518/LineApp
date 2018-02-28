import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView
} from 'react-native'

export default class LineManagers extends React.Component {
    static navigationOptions = {
        title: 'Line Mangers',
        headerTitleStyle: {
            color: '#FFF',
        },
    };
    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            lineManagers: [],
            dataSource: ds,

        };
    }
    componentDidMount() {
        var url = 'http://10.0.0.6:3000/mobileAPI/retrieveList?type=lineManagers';
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
    renderRow(lineManager) {
        return (
            <View style={Styles.lineManagerContainer}>
                <Text>First Name: {lineManager.firstName}</Text>
                <Text>Last Name: {lineManager.lastName}</Text>
                <Text>Date Created: {lineManager.dateCreated}</Text>
            </View>
        )
    }
    render() {
        // Add loading view
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
    lineManagerContainer: {
        padding: 30,
        backgroundColor: '#DCDCDC',
        marginBottom: 10
    }
})