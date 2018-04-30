import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import moment from 'moment';
import config from '../config.json';

export default class SystemsUsersList extends React.Component {
    static navigationOptions = {
        title: 'System Users',
        headerTitleStyle: {
            color: '#FFF',
        },
    };
    constructor(props){
        super(props)
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            systemUsers: [],
            dataSource: ds,
            loaded:false,

        };
    }
    returnData(lineObj) {
        this.setState({ line: lineObj })
    }
    componentDidMount(){
        var url = config.adminRoute + '/mobileAPI/retrieveList?type=systemUsers';
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
    renderRow(systemUser){
        return (
            <View style={Styles.systemUsersContainer}>
                {global.currentlyLoggedIn.type === 'systemUser' &&
                    <TouchableOpacity style={Styles.accessButton} onPress={() => this.props.navigation.navigate('EditRecord', { record: systemUser, returnData: this.returnData.bind(this) })}>
                        <Text style={Styles.systemUsersContainerText}>First Name: {systemUser.firstName}</Text>
                        <Text style={Styles.systemUsersContainerText}>Last Name: {systemUser.lastName}</Text>
                        <Text style={Styles.systemUsersContainerText}>User Name: {systemUser.userName}</Text> 
                        <Text style={Styles.systemUsersContainerText}>Date Created: {moment(systemUser.dateCreated).format("MM/DD/YYYY hh:mm:ss A")}</Text>
                    </TouchableOpacity>
                }
                
            </View>
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
            return (
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
    systemUsersContainer: {
        padding: 30,
        backgroundColor: '#FFF',
        borderColor: '#000',
        marginBottom: 10,
        margin: 10,
        borderRadius: 3,
        elevation: 3
    },
    systemUsersContainerText: {
        fontSize: 18
    }
})