import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import moment from 'moment';
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
            loaded: false,
            errorMessage: "none"
            // offlineLinesArr: []
        };
    }
    componentDidMount() {
        if(global.networkConnected){
            this.onlineMethod()
        }else{
            this.setOfflineLines()
        }
    }
    async setOfflineLines() {
        try {
            const lines = await AsyncStorage.getItem('lines');
            if (lines === null) lines = [];
            this.setState({
                loaded: true,
                errorMessage: "Success",
                dataSource: this.state.dataSource.cloneWithRows(JSON.parse(lines))
            })
            // this.offlineMethod()
        } catch (error) {
            // this.setState({ offlineLinesArr: [] })
            this.setState({errorMessage: "error"})
        }
    }
    onlineMethod(){
        var url = config.adminRoute + '/mobileAPI/retrieveList?type=lines';
        return fetch(url).then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loaded: true,
                    dataSource: this.state.dataSource.cloneWithRows(responseJson)
                })

            })
            .catch((error) => {
                this.setState({ errorMessage: error })
            });
    }
    // offlineMethod(){
    //     var offlineLinesArr = this.state.offlineLinesArr;
    //     this.setState({
    //         loaded: true,
    //         dataSource: thistate.dataSource.cloneWithRows(offlineLinesArr)
    //     })
    // }
    renderRow(line) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Line',{line:line})} style={Styles.lineContainer}>
                <Text style={[Styles.lineContainerText,{fontSize: 25}]}>Line Name: {line.name}</Text>
                <Text style={Styles.lineContainerText}>Resource: {line.resource}</Text>
                {/* <Text style={Styles.lineContainerText}>Capacity: {line.currentCapacity}/{line.capacity}</Text> */}
                <Text style={Styles.lineContainerText}>Open - Close: {line.openCloseTime}</Text>
                <Text style={Styles.lineContainerText}>Date Created: {moment(line.dateCreated).format("MM/DD/YYYY hh:mm:ss A")}</Text>
                {/* <Text style={Styles.lineContainerText}>Access Frequency: {line.accessFrequency} hrs</Text> */}
            </TouchableOpacity>
        )
    }
    render() {
        if(this.state.loaded){
            if(this.state.dataSource.getRowCount() > 0){
                return (
                    <ListView
                        style={Styles.container}
                        dataSource={this.state.dataSource}
                        renderRow={(data) => this.renderRow(data)} />
                )
            }else{
                return(<Text style={{fontSize:18,padding:15}}>No Data To Show. Please Add a Line.</Text>)
            }
        }else if(global.networkConnected){
            return(
                <View style={Styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }else{
            return(<Text style={{ fontSize: 18, padding: 15 }}>No network connection. Go within network range, open the menu, and press "Prepare for Offline Use" if you anticipate being outside of network.</Text>)
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
        margin: 10,
        borderRadius: 3,
        elevation: 3,
    },
    lineContainerText:{
        fontSize: 18,
    }
})