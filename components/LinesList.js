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

export default class LinesList extends React.Component {
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
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Line',{line:line})} style={Styles.lineContainer}>
                <Text>Line Name: {line.name}</Text>
                <Text>Resource: {line.resource}</Text>
                <Text>Capacity: {line.currentCapacity}/{line.capacity}</Text>
                <Text>Open - Close: {line.openCloseTime}</Text>
                <Text>Date Created: {line.dateCreated}</Text>
            </TouchableOpacity>
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
    },
    lineContainer: {
        padding: 30,
        backgroundColor: '#DCDCDC',
        marginBottom: 10
    }
})