'use strict';
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    TouchableWithoutFeedback,
    TouchableOpacity,
    AsyncStorage,
    Dimensions,
    Alert,
} from 'react-native';
import Button from 'apsl-react-native-button';
import Svg, {Text as SVGText, Circle, Polyline} from 'react-native-svg';
import Graph from 'react-native-line-plot';
import {styles, colorControl} from './styles.js';


var startTime;
// TODO: Get rid of this nasty use of state.
var testState = 0;

// Main class, contains navigator.
var ReactionTraining = React.createClass({
    renderScene (route, navigator) {
        return <route.component navigator={navigator} {...route.passProps} />
    },
    render () {
        return(
            <Navigator
                renderScene={(route, navigator) => 
                    this.renderScene(route, navigator)}
                initialRoute={{component: Menu}}
                configureScene={this.configureScene}
            />  
        );
    }
});

// Menu screen.
var Menu = React.createClass({
    _navigate: function () {
        this.props.navigator.push({component: GameInit})
    },
    _goToSettings: function () {
        this.props.navigator.push({component: Settings})
    },
    _goToDataScreen: function () {
        this.props.navigator.push({component: DataScreen})
    },
    render () {
        return (
            <View style={styles.bg}>
                <View style={styles.container}>
                    <Svg height="300" width="350">
                        <Circle
                            fill="none"
                            stroke={colorControl.buttonColor}
                            strokeWidth="18"
                            cx="175"
                            cy="125"
                            r="110"
                        />
                        <SVGText
                            fill="none"
                            stroke={colorControl.buttonBorderColor}
                            strokeWidth="1.3"
                            fontSize="64"
                            fontWeight="900"
                            x="175"
                            y="85"
                            textAnchor="middle"
                        >SACCADE</SVGText>
                    </Svg>
                    <Button
                        style={styles.button} 
                        textStyle={styles.buttonTextStyle} 
                        onPress={this._navigate}>
                        TRAIN
                    </Button>
                    <Button 
                        style={styles.button}
                        textStyle={styles.buttonTextStyle} 
                        onPress={this._goToDataScreen}>
                        DATA
                    </Button>
                    <Button 
                        style={styles.button}
                        textStyle={styles.buttonTextStyle} 
                        onPress={this._goToSettings}>
                        SETTINGS
                    </Button>
                </View>         
            </View>         
        )
    }
});

// Display graph of user reaction speed over time.
var DataScreen = React.createClass({
    getInitialState () {
        return { isLoading: true }
    },
    componentWillMount () {
        var reactionData = [];
        var keyList = [];
        AsyncStorage.getAllKeys((error, keys) => {
            if (error) { console.warn(error) } else {
                for (var i in keys) {
                    keyList.push(keys[i]);
                }
            }
        }).then(()=>{
            keyList.forEach((listItem, index) => {
                AsyncStorage.getItem(listItem, (error, result) => {
                    if (error) { console.warn(error) }
                    else { reactionData.push([listItem, result]); }
                });
            });
        }).then(() => {
            setTimeout(() => {
                console.warn("reactionData:",reactionData);
                this.setState({
                    reactionData: reactionData,
                    isLoading: false
                });
            }, 300);
        });
    },
    _back: function () {
        this.props.navigator.pop();
    },
    render () {
        var xAxisDensity = 5;
        if (this.state.isLoading){
            return(<View style={styles.bg}/>)
        }
        if (this.state.reactionData.length < 2){
            return(
                <View style={styles.bg}>
                    <View style={styles.container}>
                        <Text style={styles.warningTextStyle}>
                            Graphing requires at least two days of data,
                            come back tomorrow!
                        </Text>
                        <Button 
                            style={styles.thinButton}
                            textStyle={styles.buttonTextStyle} 
                            onPress={this._back}>
                            BACK
                        </Button>
                    </View>
                </View>
            )
        }
        else if (this.state.reactionData.length < 6) {
            xAxisDensity = 2;
        }
        return(
            <View style={styles.bg}>
                <View style={styles.container}>
                    <Graph data={this.state.reactionData}
                        graphColorPrimary={colorControl.buttonColor}
                        graphColorSecondary={colorControl.buttonBorderColor}
                        xUnit="date"
                        yUnit="ms"
                        xAxisDensity={xAxisDensity}
                    />
                    <Button 
                        style={styles.thinButton}
                        textStyle={styles.buttonTextStyle} 
                        onPress={this._back}>
                        BACK
                    </Button>
                </View> 
            </View> 
        )
        
    },
});

// Settings menu, only clears data, no other functionality.
var Settings = React.createClass({
    deleteData: function () {
        AsyncStorage.clear((error) => {if (error) {console.warn(error)}});
    },
    _back: function () {
        this.props.navigator.pop();
    },
    render () {
        return(
            <View style={styles.bg}>
                <View style={styles.container}>
                    <Button 
                        textStyle={styles.buttonTextStyle} 
                        style={styles.button} 
                        onPress={this.deleteData}>
                        CLEAR DATA
                    </Button>
                    <Button 
                        textStyle={styles.buttonTextStyle} 
                        style={styles.button}
                        onPress={this._back}>
                        BACK
                    </Button>
                </View>
            </View>
        )
    }
});

// Start reaction test from this screen.
var GameInit = React.createClass({
    getInitialState() {
        return { activeState: 0 }
    },
    _navigate: function () {
        this.setState({ activeState: 1 });
        testState += 1;
        /* Each click increments testState by 1 so if a user clicks in between
         * triggering the test and GameLive being pushed onto the view stack
         * they should be taken to the cheating screen. */
        if (testState == 1) {
            let delay = 2500 + 1000 * Math.random()
            window.setTimeout(() => {
                    if (testState == 1){ 
                        this.props.navigator.replace({component: GameLive})
                    }
                }, delay)
        }
        else {
            testState = 0;
            this.props.navigator.replace({component: GameResult,
                passProps: {timeElapsed: 0}});
        }
    },
    _back: function () {
        testState = 0;
        this.props.navigator.popToTop({component: Menu});
    },
    render () {
        var gameInitStyle = styles.container;
        var gameBGStyle = styles.bg;
        var bigButtonStyle = styles.bigButton;
        var thinButtonStyle = styles.thinButton;
        if (this.state.activeState) {
            gameInitStyle = styles.containerActive;
            gameBGStyle = styles.bgActive; 
            bigButtonStyle = styles.bigButtonActive;
            thinButtonStyle = styles.thinButtonActive;
        }
        return(
            <View style={gameBGStyle}>
                <View style={gameInitStyle}>
                    <Button 
                        style={bigButtonStyle} 
                        textStyle={styles.buttonTextStyle} 
                        onPress={this._navigate}>
                        START TEST
                    </Button>
                    <Button
                        style={thinButtonStyle} 
                        textStyle={styles.buttonTextStyle} 
                        onPress={this._back}>
                        BACK
                    </Button>
                </View>
            </View>
        )
    }
});

// Reaction test is live here.
var GameLive = React.createClass({
    getInitialState(){
        startTime = (new Date()).getTime();
        return {
            backgroundColor: colorControl.liveColor
        }
    },
    _reactionHandler(){
        var timeElapsed = (new Date()).getTime() - startTime;
        this.props.navigator.replace({component: GameResult,
            passProps: {timeElapsed: timeElapsed}});

    },
    render () {
        return(
            <View style={{flex: 1,
                        backgroundColor: this.state.backgroundColor,
                        justifyContent: 'center',
                        alignItems: 'center'}}>
                <TouchableWithoutFeedback
                    onPress={() => this._reactionHandler()}>
                    <View style={{flex: 1, 
                        justifyContent: 'center',
                        alignItems: 'center'}}>
                        <Text style={{height: 1000, width: 1000}}>Click!</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
});

var GameResult = React.createClass({
    save (time) {
        // Passing arg to new Date() spoofs a date. For testing purposes only.
        var dateOfResult = new Date(1468814400000);
        
        /* Normalize dates; collapse same-day entries into single entry
         * representing the 'high-score' for that day. */
        const months = ['January, ', 'February, ', 'March, ', 'April, ', 'May, ',
            'June, ', 'July, ', 'August, ', 'September, ', 'October, ', 'November, ',
            'December, '];
        var normalizedDOR = String(Date.parse(months[dateOfResult.getMonth()]
            + String(dateOfResult.getDate()) + " "
            + String(dateOfResult.getFullYear())));
        AsyncStorage.getItem(normalizedDOR, (error, result) => {
            if (error) { console.warn(error) }
            else {
                if (!result) {

                    console.warn("No result for this date found, logging time of "
                            + String(time) + ", " + normalizedDOR + " ms since that"
                            + " arbitrary time in 1970.");

                    AsyncStorage.setItem(normalizedDOR, String(time), (error) => {
                        if (error) { console.warn(error) }
                    }); 
                } else {
                    var newResult = (Number(result) < time) ? result : String(time);

                    if (newResult == time) {
                        console.warn("Overwriting previous result with "
                                + String(newResult) + ", " + normalizedDOR + " ms "
                                + "since that arbitrary time in 1970.");
                    } else { console.warn("Did not beat record"); }

                    AsyncStorage.setItem(normalizedDOR, newResult, (error) => {
                        if (error) { console.warn(error) }
                    });
                }
            }
        });

    },
    _done() {
        // Reset testState and go back to GameInit
        testState = 0;
        if (this.props.timeElapsed){
            this.save(this.props.timeElapsed);
        }
        this.props.navigator.push({component: GameInit});
    },
    render(){
        if (this.props.timeElapsed){
            return(
                <TouchableWithoutFeedback
                    onPress={() => this._done()}>
                    <View style={styles.bg}>
                        <View style={styles.container}>
                            <Text>{this.props.timeElapsed} ms</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )
        } else {
            // timeElapsed will be 0 if user makes an input too early.
            return(
                <TouchableWithoutFeedback
                    onPress={() => this._done()}>
                    <View style={styles.bg}>
                        <View style={styles.container}>
                            <Text>You cheater!</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )
        }
    }
});

AppRegistry.registerComponent('ReactionTraining', () => ReactionTraining);
