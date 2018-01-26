import React, {Component} from 'react';
import {
    Text,
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import {NavigationActions} from "react-navigation";

import Styles from '../../utilities/styles';
import * as api from '../../utilities/api';
import {setUserInRedux} from '../../utilities/redux/redux';

export class DashboardScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleView: false,
            showLoader: false,
            planets: []
        };
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerRight: (
                <TouchableOpacity onPress={() => {
                    navigation.state.params.logout();
                }}>
                    <Text style={Styles.headerRightText}>
                        Logout
                    </Text>
                </TouchableOpacity>
            ),
            headerLeft: (
                <Text style={Styles.headerLeftText}>
                    Planets
                </Text>
            ),
            headerStyle: {backgroundColor: "black", borderBottomColor: '#fff'}
        }
    };

    componentDidMount() {
        this.getAllPlanets();
    }

    componentWillMount() {
        let {setParams} = this.props.navigation;
        setParams({logout: this.logout});
    }

    getAllPlanets = (value) => {
        this.setState({showLoader: true});
        api.get(`https://swapi.co/api/planets/?search=${value ? value.trim() : ""}&format=json`).then((response) => {
            let results = response.results ? response.results : [];
            results = results.sort((a, b) => {
                let aPopulation = isNaN(a.population) ? 0 : a.population;
                let bPopulation = isNaN(b.population) ? 0 : b.population;
                return (bPopulation - aPopulation)
            });
            this.setState({planets: results, showLoader: false});
        });
    };

    logout = () => {
        setUserInRedux({});
        let resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Home'})]
        });
        this.props.navigation.dispatch(resetAction);
    };

    render() {
        let {planets, showLoader} = this.state;
        return (
            <View style={Styles.container}>
                <View style={[Styles.p_a_20, Styles.m_t_20]}>
                    <TextInput
                        placeholder="search"
                        underlineColorAndroid={"transparent"}
                        placeholderTextColor={"#fff"}
                        style={[Styles.credentialText]}
                        onChangeText={(text) => this.getAllPlanets(text)}
                    />
                </View>
                <View style={[Styles.p_a_20, Styles.m_b_100]}>
                    <FlatList
                        data={planets}
                        keyExtractor={(item) => {
                            return item.name;
                        }}
                        renderItem={(data) => {
                            return (
                                <Details data={data} count={planets.length} />
                            )
                        }}
                    />
                    {!showLoader && planets.length === 0 &&
                        <View style={[Styles.justifyContentCenter, Styles.alignItemsCenter]}>
                            <Text style={Styles.noDataText}>
                                Their is no data to show
                            </Text>
                        </View>
                    }
                </View>
                <ActivityIndicator size="large" color="#0000ff" animating={this.state.showLoader}/>
            </View>
        )
    }
}


class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleView: false
        };
    }

    info = (data) => {
        let {item} = data;
        return (
            <View>
                <Text><Text style={Styles.boldWeight}>Population</Text>- {item.population}</Text>
                <Text><Text style={Styles.boldWeight}>Diameter</Text>- {item.diameter}</Text>
                <Text><Text style={Styles.boldWeight}>Climate</Text>- {item.climate}</Text>
                <Text><Text style={Styles.boldWeight}>Gravity</Text>- {item.gravity}</Text>
            </View>
        )
    };

    componentDidMount() {
        this.setFontSize();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.count !== this.props.count) {
            this.setFontSize()
        }
    }

    setFontSize = () => {
        let {data, count} = this.props;
        if (count > 12) {
            this.setState({defaultFontSize: ((4*count) - data.index)});
        } else {
            this.setState({defaultFontSize: 48 - (2*data.index)});
        }
    };

    render() {
        let {data} = this.props;
        let {defaultFontSize, toggleView} = this.state;
        return (
            <View>
                <TouchableOpacity onPress={() => {
                    this.setState({toggleView: !this.state.toggleView});
                }} style={Styles.itemContainer}>
                    <Text style={[Styles.itemName, {fontSize: defaultFontSize}]}>{data.item.name}</Text>
                    {toggleView &&
                        <View style={[Styles.p_a_20, Styles.whiteBackground]}>
                            {this.info(data)}
                        </View>
                    }
                </TouchableOpacity>
            </View>
        )
    }
}