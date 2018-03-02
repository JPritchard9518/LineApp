import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    ActivityIndicator,
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
            dataSource: ds,
            loaded: false
        };
    }
    componentDidMount() {
        var url = 'http://' + config.ip + ':' + config.port + '/mobileAPI/retrieveList?type=lines';
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
    renderRow(line) {
        debugger;
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Line',{line:line})} style={Styles.lineContainer}>
                <Text style={Styles.lineContainerText}>Line Name: {line.name}</Text>
                <Text style={Styles.lineContainerText}>Resource: {line.resource}</Text>
                <Text style={Styles.lineContainerText}>Capacity: {line.currentCapacity}/{line.capacity}</Text>
                <Text style={Styles.lineContainerText}>Open - Close: {line.openCloseTime}</Text>
                <Text style={Styles.lineContainerText}>Date Created: {line.dateCreated}</Text>
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
            return(
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
    lineContainer: {
        padding: 30,
        backgroundColor: '#FFF',
        borderColor: '#000',
        marginBottom: 10,
        margin: 10,
        borderRadius: 3,
        elevation: 3
    },
    lineContainerText:{
        fontSize: 18
    }
})