import PropTypes from 'prop-types';
import React from 'react';
import { NavigationActions } from 'react-navigation';
import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    NetInfo,
    TouchableOpacity,
    AsyncStorage,
    Alert
} from 'react-native';
import config from '../config.json';
import moment from 'moment';

const collectionsToDownload = ['lines','systemUsers','recipients','recipientActions'];

export default class SideMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            connected: false,
            downloadStatus: 0,
            message: '',
            recipientActions: null,
            numDownloaded:0,
        }
        this.queryCollections = this.queryCollections.bind(this);
    }
    componentDidMount() {
        NetInfo.isConnected.fetch().then((isConnected) => {
            global.networkConnected = isConnected;
            this.uploadQueue(false)
            this.setState({ connected: isConnected })
        });
        NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
    }
    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
    }
    _handleConnectionChange = (isConnected) => {
        global.networkConnected = isConnected;
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Lines' })
            ],
        });
        if (global.networkConnected) {
            this.setState({ downloadStatus: 2, message: 'Import Complete!', numDownloaded: 0 })
            Alert.alert(
                "The application has lost connection",
                "You will be returned to the home screen. Please go within range of network. Open the menu and press \"Prepare for Offline Use\" if you expect to be outside of network range.",
                [
                    { text: 'Ok', onPress: () => this.props.navigation.dispatch(resetAction) }
                ],
                { cancelable: false }
            )
            this.uploadQueue(true);
        }
        this.setState({ connected: isConnected})
        if(!isConnected){
            this.setState({ downloadStatus: 2, message: 'Import Complete!', numDownloaded: 0 })
            Alert.alert(
                "The application has found the network",
                "In order to ensure that the most recent data is being accessed, you will be returned to the home screen.",
                [
                    { text: 'Ok', onPress: () => this.props.navigation.dispatch(resetAction) }
                ],
                { cancelable: false }
            )
        }
    }
    async uploadQueue(showMessage) {
        try {
            const value = await AsyncStorage.getItem('actionQueue');
            var url = config.adminRouteProd + '/mobileAPI/uploadQueue?queue=' + value
            return fetch(url,{method:'POST'})
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.success){
                        this.clearQueue(showMessage)
                    }
                }).done()
        } catch (error) {
            this.setState({message: 'Error uploading queue'});
        }
    }
    async clearQueue(showMessage) {
        try {
            await AsyncStorage.removeItem('actionQueue')
            if(showMessage)
                this.setState({ message: 'Queue successfully cleared at ' + moment().format("MM/DD/YYYY hh:mm:ss A"), uploadingQueue: false})
        } catch (error) {
            this.setState({mesage: 'Error clearing queue'})
        }
    }
    navigateToScreen = (route) => () => {
        if(route === 'loginStack') global.currentlyLoggedIn = {};
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }
    beginDownloadProcess(){
        if (!global.networkConnected)
            return Alert.alert(
                "Not Connected to Network",
                "You must be connected to the network in order to prepare for offline use. Please come within range of the network and try again.",
                [
                    { text: 'Dismiss' },
                ],
                { cancelable: false }
            )
        else{
            this.queryCollections(0)
        }
    }
    queryCollections(index){
        if(!global.networkConnected)
            return Alert.alert(
                "Not Connected to Network",
                "You must be connected to the network in order to download data. Please be within range of the network and try again.",
                [
                    { text: 'Dismiss'},
                ],
                { cancelable: false }
            )
        else if(typeof collectionsToDownload[index] === 'undefined'){
            this.setState({downloadStatus: 2, message: 'Import Complete!', numDownloaded: 0})
        }else{
            this.setState({ downloadStatus: 1, numDownloaded: index, message: (collectionsToDownload.length - index) + '/' + collectionsToDownload.length + ' collections left to import'},function(){
                this.gatherResource(collectionsToDownload[index],index).done()
            })
        }
    }
    gatherResource = async (collection,index) => {
        var url = config.adminRouteProd + '/mobileAPI/retrieveList?type=' + collection + '&limit=10000';
        await fetch(url)
            .then((response) => response.json())
            .then((responseJson) => this.saveKey(collection, JSON.stringify(responseJson)))
            .then(() => this.queryCollections(++index))
    }
    async getKey(key) {
        try {
            const value = await AsyncStorage.getItem(key);
            this.setState({ message: value });
        } catch (error) {
            this.setState({message: "Error retrieving data" + error});
        }
    }

    async saveKey(key,value) {
        try {
            // this.setState({message: key})
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            this.setState({message: "Error saving data" + error});
        }
    }
    renderDownloadProgress(){
        if(this.state.downloadStatus){
            var progressPerc = (this.state.numDownloaded/collectionsToDownload.length) * 100;
            if(this.state.downloadStatus > 1)
                progressPerc = 100;
            return(
                <View>
                    <View style={Styles.progressContainer}>
                        {/* <Text>{this.state.numDownloaded} / {collectionsToDownload.length} - {progressPerc}</Text> */}
                        <View style={{backgroundColor: '#689F38', height: '100%', width: progressPerc + '%'}}/>
                        <View style={{backgroundColor: '#FFF', height: '100%', width: (1-progressPerc) + '%'}}/>
                    </View>
                    {this.state.downloadStatus > 1 && <Text style={Styles.navItem}>Collections Last Imported: {moment().format("MM/DD/YYYY hh:mm:ss A")}</Text>}
                </View>
            )
        }
    }
    render() {
        return (
            <View style={Styles.container}>
                <ScrollView>
                    <View>
                        <View style={Styles.navSectionStyle}>
                            <View style={Styles.navItemContainer}>
                                <Text style={Styles.navItem} onPress={this.navigateToScreen('Search')}>Search</Text>
                            </View>
                            <View style={Styles.navItemContainer}>
                                <Text style={Styles.navItem} onPress={this.navigateToScreen('Lines')}>Lines</Text>
                            </View>
                            {global.currentlyLoggedIn.permissions.indexOf('viewRecipients') > -1 && 
                                <View style={Styles.navItemContainer}>
                                    <Text style={Styles.navItem} onPress={this.navigateToScreen('Recipients')}>Recipients</Text>
                                </View>
                                    
                            }
                            {global.currentlyLoggedIn.permissions.indexOf('viewSystemUsers') > -1 &&
                                <View style={Styles.navItemContainer}>
                                    <Text style={Styles.navItem} onPress={this.navigateToScreen('SystemUsers')}>System Users</Text>
                                </View>
                            }
                            {global.currentlyLoggedIn.permissions.indexOf('createRecipients') > -1 && global.networkConnected && // Cannot add new recipient if not connected to network.
                                <View style={Styles.navItemContainer}>
                                    <Text style={Styles.navItem} onPress={this.navigateToScreen('Add New Recipient')}>Add New Recipient</Text>
                                </View>
                            }
                            <TouchableOpacity style={Styles.navItemContainer} onPress={() => this.beginDownloadProcess()}>
                                <Text style={Styles.navItem}>Prepare for Offline Use</Text>
                            </TouchableOpacity>
                            <Text style={Styles.navItem}>{this.state.message}</Text>
                            {this.renderDownloadProgress()}
                        </View>
                    </View>
                </ScrollView>
                <View style={Styles.footerContainer}>
                    
                    <Text style={{padding: 15,paddingLeft:10}}>Currently Logged In: {global.currentlyLoggedIn.firstName} {global.currentlyLoggedIn.lastName}</Text>
                    <View style={Styles.navItemContainer}>
                        <Text style={[Styles.navItem,Styles.logout]} onPress={this.navigateToScreen('loginStack')}>Logout</Text>
                    </View>
                    <Text style={{ padding: 10 }}>Network Status: <Text style={{ color: (global.networkConnected) ? "#689F38" : "#BE2E37" }}>{(global.networkConnected) ? "Connected" : "Not Connected"}</Text></Text>
                        
                </View>
            </View>
        );
    }
}

SideMenu.propTypes = {
    navigation: PropTypes.object
};

const Styles = StyleSheet.create({
    container: {
        // paddingTop: 20,
        flex: 1
    },
    navItemContainer:{
        borderBottomWidth: 0.5,
        borderBottomColor: '#d6d7da',
        flexDirection: 'row',
        alignItems: 'center'
    },
    navItem: {
        padding: 15,
    },
    navSectionStyle: {
        // paddingLeft: 10,
    },
    footerContainer: {
        // padding: 20,
    },
    logout:{
        borderTopWidth: 0.5,
        width: '100%',
        borderTopColor: '#d6d7da'
    },
    progressContainer: {
        width: '100%',
        // borderWidth: 1,
        height: 25
    }
})
