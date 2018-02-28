import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView
} from 'react-native'
import config from '../config.json';

export default class Lines extends React.Component {
    static navigationOptions = {
        title: 'Lines',
        headerTitleStyle: {
            color: '#FFF',
        },
    };
    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            lines: [],
            dataSource: ds,
        };
    }
    componentDidMount() {
        var url = 'http://' + config.ip + ':' + config.port + '/mobileAPI/retrieveList?type=lines';
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
    renderRow(line) {
        return (
            <View style={Styles.lineContainer}>
                <Text>Line Name: {line.name}</Text>
                <Text>Resource: {line.resource}</Text>
                <Text>Capacity: {line.capacity}</Text>
                <Text>Open - Close: {line.openCloseTime}</Text>
                <Text>Date Created: {line.dateCreated}</Text>
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
    lineContainer: {
        padding: 30,
        backgroundColor: '#DCDCDC',
        marginBottom: 10
    }
})