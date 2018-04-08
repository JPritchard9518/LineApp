import PropTypes from 'prop-types';
import React from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, StyleSheet, NetInfo , TouchableOpacity , AsyncStorage} from 'react-native';
import config from '../config.json';
import moment from 'moment';

const collectionsToDownload = ['lines','recipients','recipientActions','admins','lineManagers'];

export default class SideMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            connected: false,
            downloadStatus: 0,
            downloadProgress: '',
            recipientActions: null,
            numDownloaded:0,
        }
        this.queryCollections = this.queryCollections.bind(this);
    }
    componentDidMount() {
        NetInfo.isConnected.fetch().then((isConnected) => {
            global.connected = isConnected;
            this.setState({ connected: isConnected })
        });
        NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
    }
    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
    }
    // Connection Type: none, wifi, cellular, unknown
    _handleConnectionChange = (isConnected) => {
        global.connected = isConnected;
        this.setState({ connected: isConnected })
    }
    navigateToScreen = (route) => () => {
        if(route === 'loginStack') global.currentlyLoggedIn = {};
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }
    queryCollections(index){
        if(!global.connected)
            return this.setState({message: "Please Connect to the Network"})
        else if(typeof collectionsToDownload[index] === 'undefined'){
            this.setState({downloadStatus: 2, message: 'Import Complete!', numDownloaded: 0})
        }else{
            this.setState({ downloadStatus: 1, numDownloaded: index, message: (collectionsToDownload.length - index) + '/' + collectionsToDownload.length + ' collections left to import'},function(){
                this.gatherResource(collectionsToDownload[index],index).then((val) => {
                })
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
        if(this.state.downloadStatus || this.state.message === 'Import Complete!'){
            var progressPerc = (this.state.numDownloaded/collectionsToDownload.length) * 100;
            if(this.state.message === 'Import Complete!')
                progressPerc = 100;
            return(
                <View>
                    <View style={Styles.progressContainer}>
                        {/* <Text>{this.state.numDownloaded} / {collectionsToDownload.length} - {progressPerc}</Text> */}
                        <View style={{backgroundColor: '#689F38', height: '100%', width: progressPerc + '%'}}/>
                        <View style={{backgroundColor: '#FFF', height: '100%', width: (1-progressPerc) + '%'}}/>
                    </View>
                    {this.state.message === 'Import Complete!' && <Text style={Styles.navItem}>Collections Last Imported: {moment().format("MM/DD/YYYY hh:mm:ss A")}</Text>}
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
                            {global.currentlyLoggedIn.type === 'admin' && 
                                (<View>
                                    <View style={Styles.navItemContainer}>
                                        <Text style={Styles.navItem} onPress={this.navigateToScreen('Admins')}>Admins</Text>
                                    </View>
                                    <View style={Styles.navItemContainer}>
                                        <Text style={Styles.navItem} onPress={this.navigateToScreen('Recipients')}>Recipients</Text>
                                    </View>
                                    <View style={Styles.navItemContainer}>
                                        <Text style={Styles.navItem} onPress={this.navigateToScreen('Line Managers')}>Line Managers</Text>
                                    </View>
                                </View>)
                            }
                            <View style={Styles.navItemContainer}>
                                <Text style={Styles.navItem} onPress={this.navigateToScreen('Add New Recipient')}>Add New Recipient</Text>
                            </View>
                            <TouchableOpacity style={Styles.navItemContainer} onPress={() => this.queryCollections(0)}>
                                <Text style={Styles.navItem}>Prepare for Offline Use</Text>
                            </TouchableOpacity>
                            <Text style={Styles.navItem}>{this.state.message}</Text>
                            {this.renderDownloadProgress()}
                        </View>
                    </View>
                </ScrollView>
                <View style={Styles.footerContainer}>
                    
                    <Text style={{paddingLeft:10}}>Currently Logged In: {global.currentlyLoggedIn.firstName} {global.currentlyLoggedIn.lastName}</Text>
                    <Text style={{padding: 15,paddingLeft: 10}}>Type: {global.currentlyLoggedIn.type}</Text>
                    <View style={Styles.navItemContainer}>
                        <Text style={[Styles.navItem,Styles.logout]} onPress={this.navigateToScreen('loginStack')}>Logout</Text>
                    </View>
                    <Text style={{ padding: 10 }}>Network Status: <Text style={{ color: (global.connected) ? "#689F38" : "#BE2E37" }}>{(global.connected) ? "Connected" : "Not Connected"}</Text></Text>
                        
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
