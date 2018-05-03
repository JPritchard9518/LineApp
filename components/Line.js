import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    ScrollView,
    AsyncStorage,
    Animated,
    Easing,
    Dimensions,
    NativeModules,
} from 'react-native';
import config from '../config.json';
import moment from 'moment';

// import Fingerprint from '../NativeModules/Fingerprint';

export default class Line extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            title: params ? params.line.name : 'Line',
            headerTitleStyle: {
                color: '#FFF',
            },
        }
    };
    constructor(props) {
        super(props)
        this.state = {
            line: this.props.navigation.state.params.line,
            errorMessage:'',
            lastAccess: false,
            fadeAnim: new Animated.Value(0),
            swipeAnim: new Animated.Value(0),
            type: '',
            remainingAttempts: 3, // For rescanning a fingerprint when credentials were not found.
            recipient: {},
            offlineRecipientsArr: [],
            offlineRecipientActionsArr: [],
            offlineActionsQueueArr: [],
            currentRecipientID: "" // Need to update this once finger is scanned
        };
        this.attemptLineAccess = this.attemptLineAccess.bind(this);
        this.renderTimeSince = this.renderTimeSince.bind(this);
        // this.approveOrDeny = this.approveOrDeny.bind(this);
    }
    componentDidMount(){
        // Fingerprint.getReaders((msg) => { this.setState({errorMessage:msg})})
        if (!global.networkConnected) {
            this.setOfflineRecip();
            this.setOfflineActions();
            this.setOfflineActionsQueue();
        }
        
    }
    async setOfflineRecip(){
        try {
            const recipients = await AsyncStorage.getItem('recipients');
            if(recipients === null) recipients = [];
            this.setState({offlineRecipientsArr: JSON.parse(recipients)})
        } catch (error) {
            this.setState({ offlineRecipientsArr: []})
            // this.setState({errorMessage: error})
        }
    }
    async setOfflineActions() {
        try {
            const actions = await AsyncStorage.getItem('recipientActions');
            if(actions === null) actions = [];
            this.setState({ offlineRecipientActionsArr: JSON.parse(actions) })
        } catch (error) {
            this.setState({ offlineRecipientActionsArr: [] })
            // this.setState({ errorMessage: error })
        }
    }
    async setOfflineActionsQueue(){
        try {
            const actionsQueue = await AsyncStorage.getItem('actionQueue');
            if(actionsQueue === null) actionsQueue = [];
            this.setState({offlineActionsQueueArr: JSON.parse(actionsQueue)})
        } catch (error) {
            this.setState({ offlineActionsQueueArr: [] })
        }
    }
    returnData(lineObj){
        this.setState({line: lineObj})
    }
    attemptLineAccess(){
        // Scan finger here
        NativeModules.OpenScanApp.openScanAppAndValidate(recipID => {
            this.setState({currentRecipientID: recipID},function(){
                if (global.networkConnected)
                    return this.onlineAccessMethod();
                else
                    return this.offlineAccessMethod();
            })
            
        })
    }
    offlineAccessMethod(){
        if(this.state.remainingAttempts === 0){
            return this.setState({type: 'maxAttemptsReached', remainingAttempts: 3},function(){
                Animated.timing(this.state.swipeAnim, { toValue: 0, duration: 1 }).start()
                Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 200 }).start()
            })
        }
        var scannedID = this.state.currentRecipientID;
        var recipientsArr = this.state.offlineRecipientsArr;

        var recipient = recipientsArr.find(recipient => scannedID === recipient._id);
        
        if(typeof recipient === 'undefined'){ // If credentials not found, give another attempt until 3 failures
            var remainingAttempts = this.state.remainingAttempts;
            // Update the other states once we have sensor working
            return this.setState({
                type: 'credentialsNotFound',
                remainingAttempts: --remainingAttempts,
            })
        }else{
            var actions = this.state.offlineRecipientActionsArr;
            var matchingActionObj;
            var matchingActionObjFound = false;

            // Search through offline recipient actions to find existing access history
            var matchingActionObj = actions.find(action => recipient._id === action.recipientID)

            if(typeof matchingActionObj !== 'undefined')
                matchingActionObjFound = true;
            
            var offlineActionsQueue = this.state.offlineActionsQueueArr;
            if(typeof matchingActionObj === 'undefined'){
                matchingActionObj = {
                    recipientID: recipient._id,
                    actions: []
                }
            }
            // Search through offline actions queue for recent repeat offenders

            for (var i = 0; i < offlineActionsQueue.length; i++) {
                if(offlineActionsQueue[i].recipientID === recipient._id){
                    matchingActionObjFound = true;
                    matchingActionObj.actions.push(offlineActionsQueue[i])
                }
            }
            var accessFault = false;
            var line = this.state.line;
            // var accessFrequency = this.state.line.accessFrequency;
            // var accessLowerBound = moment().subtract(accessFrequency, 'hours').toDate();
            var lastAccessDate;
            var firstAccess = false;
            if(matchingActionObjFound){
                var fault = {};
                for(var i = 0; i < matchingActionObj.actions.length; i++){
                    var actionLine = matchingActionObj.actions[i].lineID;
                    var date = moment(matchingActionObj.actions[i].date);
                    if(line._id === actionLine){
                        if(typeof lastAccessDate === 'undefined')
                            lastAccessDate = moment(matchingActionObj.actions[i].date).toDate()
                        if(date.isAfter(lastAccessDate))
                            lastAccessDate = moment(date).toDate()
                    }
                }
                if(typeof lastAccessDate === 'undefined'){
                    firstAccess = true;
                    lastAccessDate = false;
                }
            }
            
            if(!matchingActionObjFound && !firstAccess){
                console.log('NNOOOOO')
                this.setState({
                    accessFault: true,
                    accessSuccess:false,
                    type: 'faultyAccess',
                    recipient: recipient,
                },function(){
                    Animated.timing(this.state.swipeAnim, { toValue: 0, duration: 1 }).start()
                    Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 200 }).start()
                })
            }else{
                // Success
                console.log(lastAccessDate);
                this.setState({
                    type: (firstAccess) ? 'firstAccess':'',
                    remainingAttempts: 3,
                    recipient: recipient,
                    lastAccess:lastAccessDate,
                },function(){
                    Animated.timing(this.state.swipeAnim, { toValue: 0, duration: 1 }).start()
                    Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 200 }).start()
                })
                // this.logOfflineApproval(line,recipient, setObj);
            }
        }
        
    }
    onlineAccessMethod(){
        if (this.state.remainingAttempts === 0) {
            Animated.timing(this.state.swipeAnim, { toValue: 0, duration: 1 }).start()
            Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 200 }).start()
            return this.setState({ type: 'maxAttemptsReached', remainingAttempts: 3, lastAccess:null})
        }
        var url = config.adminRoute + '/mobileAPI/validateAndRetrieveLastAction?lineID=' + this.state.line._id + '&recipientID=' + this.state.currentRecipientID;
        return fetch(url, { method: "GET" }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success) {
                    const { setParams } = this.props.navigation;
                    this.setState({
                        lastAccess: responseJson.lastAccess,
                        remainingAttempts: 3,
                        type: responseJson.type,
                        recipient: responseJson.recipient
                    },function(){
                        Animated.timing(this.state.swipeAnim, { toValue: 0, duration: 1 }).start()
                        Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 200 }).start()
                    })
                } else {
                    var remainingAttempts = this.state.remainingAttempts;
                    if (responseJson.type === 'credentialsNotFound')
                        remainingAttempts--;
                    this.setState({
                        lastAccess:null,
                        type: responseJson.type,
                        remainingAttempts: remainingAttempts,
                        recipient: responseJson.recipient,
                    },function(){
                        Animated.timing(this.state.swipeAnim, { toValue: 0, duration: 1 }).start()
                        Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 200 }).start()
                    })
                }
            })
            .catch((error) => {
                this.setState({ errorMessage: error })
            });
    }
    logOfflineApproval(line,recipient,setObj){
        var offActQueue = this.state.offlineActionsQueueArr;
        var actionDate = moment().toDate();
        var actionObj = {
            recipientID: recipient._id,
            lineID: line._id,
            lineName: line.name,
            date: actionDate,
            resource: line.resource,
            numTaken: 1 // Add family member access here
            // Add more items to track here for each transaction
        }
        offActQueue.push(actionObj);
        setObj.offlineActionsQueueArr = offActQueue;
        this.addToActionQueue(actionObj).then(() => this.setState(setObj))

    }
    async addToActionQueue(actionObj) {
        try {
            const actionQueue = await AsyncStorage.getItem('actionQueue');
            var actionQueue = JSON.parse(actionQueue);
            actionQueue.push(actionObj)
            await AsyncStorage.setItem('actionQueue',JSON.stringify(actionQueue))
        } catch (error) {
            var actionQueue = [];
            actionQueue.push(actionObj)
            await AsyncStorage.setItem('actionQueue', JSON.stringify(actionQueue))
        }
    }
    
    approveOrDeny(method){
        if(method === 'deny'){
            Animated.timing(this.state.swipeAnim, { toValue: Dimensions.get('window').width, duration: 200}).start()
            Animated.timing(this.state.fadeAnim, { toValue: 0, duration: 300 }).start()
        }else if(method === 'approve'){
            if(global.networkConnected){
                var url = config.adminRoute + '/mobileAPI/logAction?lineID=' + this.state.line._id + '&lineName=' + this.state.line.name + '&resource=' + this.state.line.resource + '&recipientID=' + this.state.currentRecipientID;
                return fetch(url, { method: "POST" }).then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.success) {
                            Animated.timing(this.state.swipeAnim, { toValue: -Dimensions.get('window').width, duration: 200 }).start()
                            Animated.timing(this.state.fadeAnim, { toValue: 0, duration: 300 }).start()
                        }
                    })
            }else{
                var setObj = {
                    type: '',
                    remainingAttempts: 3,
                    lastAccess: false
                }
                Animated.timing(this.state.swipeAnim, { toValue: -Dimensions.get('window').width, duration: 200 }).start()
                Animated.timing(this.state.fadeAnim, { toValue: 0, duration: 300 }).start(() => {this.logOfflineApproval(this.state.line, this.state.recipient, setObj)})
                
            }
        }
    }
    timeSince(date){
        if(!date) return '';
        date = moment(date);
        var timeSinceString = '';
        var now = moment()
        var daysAgo = now.diff(date,'days');
        if(daysAgo > 0){
            timeSinceString += daysAgo + ((daysAgo === 1) ? ' day, ' : ' days, ');
            date.add(daysAgo,'days');
        }
        var hoursAgo = now.diff(date,'hours');
        if (hoursAgo > 0) {
            timeSinceString += hoursAgo + ((hoursAgo === 1) ? ' hour, ' : ' hours, ');
            date.add(hoursAgo, 'hours');
        }
        var minutesAgo = now.diff(date, 'minutes');
        if (minutesAgo > 0) {
            timeSinceString += minutesAgo + ((minutesAgo === 1) ? ' minute ' : ' minutes ');
        }
        if(timeSinceString === '')
            return 'Less than a minute ago'
        timeSinceString += 'ago'

        return timeSinceString;
    }
    renderTimeSince() {
        if (this.state.type === 'credentialsNotFound') {
            return (
                <View style={[Styles.faultContainer, Styles.resultContainer]}>
                    <Text style={[Styles.attribute, { fontSize: 25 }]}>Credentials Not Found</Text>
                    <Text style={[Styles.attribute, { fontSize: 22 }]}>Please Try Again</Text>
                    <Text style={Styles.attribute}>Attempts Remaining: {this.state.remainingAttempts}</Text>
                </View>
            )
        } else if (this.state.type === 'maxAttemptsReached'){
            return (
                <View style={[Styles.faultContainer, Styles.resultContainer]}>
                    <Text style={[Styles.attribute, { fontSize: 25 }]}>Max Attempts Have Been Reached</Text>
                </View>
            )
        } else if (this.state.lastAccess || this.state.type === 'firstAccess'){
            return (
                <Animated.View style={{ opacity: this.state.fadeAnim, transform: [{ translateX: this.state.swipeAnim }, { perspective: 1000}], marginTop: 15}}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Recipient', { recipient: this.state.recipient })}>
                        <View style={Styles.successContainer}>
                                <Text style={Styles.attribute}>Touch To View Recipient Access History</Text>
                            {this.state.type === 'firstAccess' && <Text style={Styles.attribute}>This is the first access by this recipient</Text>}
                            {this.state.type !== 'firstAccess' && 
                                <View>
                                    <Text style={Styles.attribute}>Language(s): {this.state.recipient.languages}</Text>
                                    <Text style={Styles.attribute}>Family Members: {this.state.recipient.familyMembers.length}</Text>
                                    <Text style={Styles.attribute}>Last Line Access: {moment(this.state.lastAccess).format("MM/DD/YYYY hh:mm:ss A")}</Text>
                                    <Text style={[Styles.attribute, {fontSize: 22}]}>{this.timeSince(this.state.lastAccess)}</Text>
                                </View>
                            }
                            
                        </View>
                        <View style={Styles.resultButtonContainer}>
                            <TouchableOpacity onPress={() => this.approveOrDeny('approve')} style={Styles.approveButton}>
                                <Text style={Styles.buttonText}>Approve</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.approveOrDeny('deny')} style={Styles.denyButton}>
                                <Text style={Styles.buttonText}>Deny</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            )
        }
    }
    render() {
        return (
            <View style={Styles.container}>
                <View style={Styles.contentContainer}>
                    <View style={Styles.lineContainer}>
                        <Text style={[Styles.lineContainerText, { fontSize: 25 }]}>Line Name: {this.state.line.name}</Text>
                        <Text style={Styles.lineContainerText}>Resource: {this.state.line.resource}</Text>
                        <Text style={Styles.lineContainerText}>Open - Close: {this.state.line.openCloseTime}</Text>
                        <Text style={Styles.lineContainerText}>Date Created: {moment(this.state.line.dateCreated).format("MM/DD/YYYY hh:mm:ss A")}</Text>
                    </View>
                    <Text>{this.state.errorMessage}</Text>
                    {this.renderTimeSince()}
                </View>
                <View style={Styles.buttonContainer}>
                    <TouchableOpacity style={[Styles.accessButton,{marginRight: 10}]} onPress={() => this.attemptLineAccess()}>
                        <Text style={Styles.buttonText}>Scan Finger</Text>
                    </TouchableOpacity>
                    {global.currentlyLoggedIn.permissions.indexOf('editLines') > -1 && 
                        <TouchableOpacity style={[Styles.accessButton,{marginLeft: 10}]} onPress={() => this.props.navigation.navigate('EditRecord', { record: this.state.line, returnData: this.returnData.bind(this)})}>
                            <Text style={Styles.buttonText}>Edit Line</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
    },
    headerText:{
        fontSize: 25,
    },
    contentContainer:{
        flex: 1,
        flexDirection: 'column',
        // justifyContent: 'space-between'
    },
    faultContainer:{
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#C02C33',
        margin: 10,
        borderRadius: 3,
        elevation: 3
    },
    attribute:{
        fontSize: 18,
        color: '#FFF'
    },
    successContainer:{
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#689F38',
        borderRadius: 3,
        elevation: 3
    },
    resultButtonContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        elevation: 3
    },
    attribute:{
        fontSize: 18,
        color: '#FFF'
    },
    lineContainer: {
        justifyContent: 'flex-start',
        padding: 30,
        backgroundColor: '#FFF',
        borderColor: '#000',
        // margin: 10,
        borderRadius: 3,
        elevation: 3,
    },
    resultContainer:{
        margin: 10,
        borderRadius: 3,
        elevation: 3,
    },
    lineInfo:{
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 20,
        // borderBottomColor: '#000',
        // borderBottomWidth: 1,
        marginLeft: 20,
        marginRight: 20,
    },
    lineContainerText: {
        fontSize: 18,
    },
    lineAttribute:{
        fontSize: 20
    },
    approveButton:{
        width: '49%',
        height: 50,
        backgroundColor: '#689F38',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        borderRadius: 3,
        elevation: 3,
        // marginRight: 5
    },
    denyButton:{
        width: '49%',
        height: 50,
        backgroundColor: '#C02C33',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        borderRadius: 3,
        elevation: 3,
        // marginLeft: 5
    },
    buttonContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        // padding: 10
    },
    accessButton:{
        backgroundColor: '#689F38',
        padding: 10,
        flex:1,
        // maxWidth: '100%',
        height: 75,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent:'center',
        borderRadius: 3,
        elevation: 3,
        margin: 10
    },
    buttonText:{
        color: '#FFF',
        alignSelf: 'center',
        fontSize: 20
    },
    
})