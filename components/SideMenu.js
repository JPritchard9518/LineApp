import PropTypes from 'prop-types';
import React from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

export default class SideMenu extends React.Component {
    constructor(props){
        super(props);
    }
    navigateToScreen = (route) => () => {
        if(route === 'loginStack') global.currentlyLoggedIn = {};
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }

    render() {
        return (
            <View style={Styles.container}>
                <ScrollView>
                    <View>
                        <View style={Styles.navSectionStyle}>
                            <View style={Styles.navItemContainer}>
                                <Text style={Styles.navItem} onPress={this.navigateToScreen('Lines')}>Lines</Text>
                            </View>
                            <View style={Styles.navItemContainer}>
                                <Text style={Styles.navItem} onPress={this.navigateToScreen('Admins')}>Admins</Text>
                            </View>
                            <View style={Styles.navItemContainer}>
                                <Text style={Styles.navItem} onPress={this.navigateToScreen('Recipients')}>Recipients</Text>
                            </View>
                            <View style={Styles.navItemContainer}>
                                <Text style={Styles.navItem} onPress={this.navigateToScreen('Line Managers')}>Line Managers</Text>
                            </View>
                            <View style={Styles.navItemContainer}>
                                <Text style={Styles.navItem} onPress={this.navigateToScreen('Add New Recipient')}>Add New Recipient</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={Styles.footerContainer}>
                    <Text style={{paddingLeft:10, padding: 10}}>Currently Logged In: {global.currentlyLoggedIn.firstName} {global.currentlyLoggedIn.lastName}</Text>
                    <View style={Styles.navItemContainer}>
                        <Text style={[Styles.navItem,Styles.logout]} onPress={this.navigateToScreen('loginStack')}>Logout</Text>
                    </View>
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
        borderTopColor: '#d6d7da'
    }
})
