import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    ActivityIndicator,
    AsyncStorage,
    FlatList
} from 'react-native';
import {  SearchBar } from "react-native-elements"
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
        // const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            data: [],
            searching: false,
            searchResults: [],
            loading: false,
            errorMessage: "none",
            page: 0,
            refreshing: false,
            // offlineLinesArr: []
        };
        this.setSearchData = this.setSearchData.bind(this);
    }
    componentDidMount() {
        this.beginNetworkRequests();
    }
    beginNetworkRequests(){
        if (global.networkConnected) {
            this.onlineMethod()
        } else {
            this.setOfflineLines()
        }
    }
    async setOfflineLines() {
        try {
            this.setState({ loading: true })
            const lines = await AsyncStorage.getItem('lines');
            if (lines === null) lines = [];
            lines = JSON.parse(lines)
            lines.sort((a,b) => a.dateCreated > b.dateCreated)
            this.setState({
                loading: false,
                data: lines,
                refreshing: false,
                searching: false
            })
            // this.offlineMethod()
        } catch (error) {
            // this.setState({ offlineLinesArr: [] })
            this.setState({errorMessage: "error"})
        }
    }
    onlineMethod(){
        this.setState({ loading: true, page: 0 })
        var url = config.adminRoute + '/mobileAPI/retrieveList?type=lines&page=' + (this.state.page + 1);
        return fetch(url).then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    data: responseJson,
                    page: this.state.page + 1,
                    refreshing: false
                })

            })
            .catch((error) => {
                this.setState({ errorMessage: error })
            });
    }
    refresh(){
        if(!global.networkConnected) return null;
        this.setState({refreshing:true, loading: true})
        this.beginNetworkRequests()
    }
    loadMore(){
        if(!global.networkConnected) return null;
        this.setState({loading: true})
        var url = config.adminRoute + '/mobileAPI/retrieveList?type=lines&page=' + (this.state.page + 1);
        return fetch(url).then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    data: (responseJson.length === 0) ? this.state.data : [...this.state.data, ...responseJson],
                    page: this.state.page + 1
                }) 
            })
    }
    // offlineMethod(){
    //     var offlineLinesArr = this.state.offlineLinesArr;
    //     this.setState({
    //         loading: true,
    //         dataSource: thistate.dataSource.cloneWithRows(offlineLinesArr)
    //     })
    // }
    renderRow(line) {
        return (
            <TouchableOpacity key={line._id} onPress={() => this.props.navigation.navigate('Line',{line:line})} style={Styles.lineContainer}>
                <Text style={[Styles.lineContainerText,{fontSize: 25}]}>Line Name: {line.name}</Text>
                <Text style={Styles.lineContainerText}>Resource: {line.resource}</Text>
                {/* <Text style={Styles.lineContainerText}>Capacity: {line.currentCapacity}/{line.capacity}</Text> */}
                <Text style={Styles.lineContainerText}>Open - Close: {line.openCloseTime}</Text>
                <Text style={Styles.lineContainerText}>Date Created: {moment(line.dateCreated).format("MM/DD/YYYY hh:mm:ss A")}</Text>
                {/* <Text style={Styles.lineContainerText}>Access Frequency: {line.accessFrequency} hrs</Text> */}
            </TouchableOpacity>
        )
    }
    setSearchData(value){
        this.setState({ searching: true })
        var url = config.adminRoute + '/mobileAPI/searchLines?searchTerm=' + value;
        return fetch(url).then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    searchResults: responseJson,
                })
            })
    }
    renderHeader = () => {
        if(!global.networkConnected) return null;
        return (
            <SearchBar
                placeholder="Search Line Name or Resource..."
                showLoading
                platform="android"
                lightTheme
                onChangeText={(value) => this.setSearchData(value)}
                onClear={() => this.setState({searching: false})}
                onCancel={() => this.setState({searching: false})}
            />);
    }
    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large" />
            </View>
        );
    };
    render() {
        if(this.state.data.length > 0){
            return (
                <FlatList
                    data={(this.state.searching) ? this.state.searchResults : this.state.data}
                    renderItem={({ item }) => (
                        this.renderRow(item)
                    )}
                    keyExtractor={item => item.name}
                    ListHeaderComponent={this.renderHeader()}
                    ListFooterComponent={this.renderFooter()}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.refresh()}
                    onEndReachedThreshold={0.25}
                    onEndReached={() => this.loadMore()}
                />
            )
        } else if(!global.networkConnected) {
            return (<Text style={{ fontSize: 18, padding: 15 }}>No network connection. Go within network range, open the menu, and press "Prepare for Offline Use" if you anticipate being outside of network.</Text>)
        
        }else{
            return(<Text style={{fontSize:18,padding:15}}>No Data To Show. Please Add a Line.</Text>)
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