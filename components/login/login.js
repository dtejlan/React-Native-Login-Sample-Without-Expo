import React, {Component} from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import {NavigationActions} from "react-navigation";

import Styles from '../../utilities/styles';
import * as api from '../../utilities/api';
import {setUserInRedux} from '../../utilities/redux/redux';

export class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    login = () => {
        let {username, password} = this.state;
        if (this.validateCredentials()) {
            api.get(`https://swapi.co/api/people/?search=${this.state.username}&format=json`, "GET").then((response) => {
                if (response && response.results) {
                    let isValidUser = response.results.filter(userData => {
                        return userData.name === username && userData.birth_year === password;
                    });
                    if (isValidUser.length === 1) {
                        setUserInRedux(isValidUser[0]);
                        let resetAction = NavigationActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({routeName: 'Dashboard'})]
                        });
                        this.props.navigation.dispatch(resetAction)
                    } else {
                        this.setState({invalidCredentials: true});
                    }
                }
            })
        }
    };

    validateCredentials = () => {
        let {username, password} = this.state;
        if (!username && !password) {
            this.setState({noUsername: true, noPassword: true});
            return false;
        } else if (!username) {
            this.setState({noUsername: true, noPassword: false});
            return false;
        } else if (!password) {
            this.setState({noUsername: false, noPassword: true});
            return false;
        } else {
            return true;
        }
    };


    render() {
        return (
            <KeyboardAvoidingView behavior={"padding"} style={Styles.container}>
                <View style={[Styles.flex2, Styles.justifyContentCenter, Styles.alignItemsCenter]}>
                    <Text style={Styles.welcomeText}>Welcome to Xebia sample !</Text>
                </View>
                <View style={[Styles.flex3, Styles.p_a_40]}>
                    <View style={Styles.p_a_20}>
                        <View style={Styles.m_b_20}>
                            <TextInput
                                underlineColorAndroid={"transparent"}
                                placeholder="username"
                                placeholderTextColor={"#fff"}
                                style={[Styles.credentialText]}
                                value={this.state.username || ""}
                                onChangeText={(text) => {
                                    this.setState({username: text, noUsername: false, invalidCredentials: false});
                                }}
                            />
                            {this.state.noUsername && <Text style={{color: "red"}}>Please enter username</Text> }
                        </View>
                        <TextInput
                            underlineColorAndroid={"transparent"}
                            placeholder="password"
                            placeholderTextColor={"#fff"}
                            secureTextEntry={true}
                            value={this.state && this.state.password ? this.state.password : ""}
                            onChangeText={(text) => {
                                this.setState({password: text, noPassword: false, invalidCredentials: false});
                            }}
                            style={Styles.credentialText}
                        />
                        { this.state.noPassword && <Text style={{color: "red"}}>Please enter password</Text> }
                        { this.state.invalidCredentials && <Text style={{color: "red"}}>username or password is incorrect</Text> }
                    </View>
                </View>
                <View style={[Styles.flex1, Styles.m_a_60]}>
                    <TouchableOpacity onPress={this.login} style={[Styles.justifyContentCenter, Styles. alignItemsCenter, Styles.height40, Styles.skyBlueBackground]}>
                        <Text style={Styles.loginButton}>
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}