import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {StackNavigator, NavigationActions} from 'react-navigation';

import {LoginScreen} from './components/login/login.js';
import {DashboardScreen} from './components/dashboard/dashboard.js';
import store from './utilities/redux/store.js';
import {getUserFromRedux} from './utilities/redux/redux';

const Routes = StackNavigator({
    Home: {
        screen: LoginScreen,
        navigationOptions: {
            header: null
        },
    },
    Dashboard: {
        screen: DashboardScreen
    },
    initialRouteName: {
        screen: LoginScreen
    }
});

class App extends Component {

    componentWillMount() {
        let user = getUserFromRedux();
        if (user) {
            let resetAction = NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: 'Dashboard'})]
            });
            this.props.navigation.dispatch(resetAction)
        }
    }

    render() {
        return (
            <Provider store={store}>
                <Routes/>
            </Provider>
        )
    }
}

export default App;
