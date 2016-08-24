'use strict';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

/* Style sheet for app. Global variable colorControl consolidates global
 * variables under one name to avoid burdening the global namespace.*/

const colorControl = {
    bgColor: '#BAC9CF',
    buttonColor: '#FFC02E',
    buttonBorderColor: '#FFF6E0',
    activeColor: '#FFF6E0',
    activeButtonColor: '#000000',
    liveColor: '#EF3456',
}
const styles = StyleSheet.create({
    bg: {
        flex: 1,
        backgroundColor: colorControl.bgColor,
    },
    bgActive: {
        flex: 1,
        backgroundColor: colorControl.activeColor,
    },
    center: {
        paddingTop: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BAC9CF',
        marginLeft: 25,
        marginRight: 25,
    },
    containerActive: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorControl.activeColor,
        marginLeft: 25,
        marginRight: 25,
    },
    button: {
        backgroundColor: colorControl.buttonColor,
        borderColor: colorControl.buttonBorderColor,
        height: 80,
    },
    thinButton: {
        backgroundColor: colorControl.buttonColor,
        borderColor: colorControl.buttonBorderColor,
        height: 40,
    },
    thinButtonActive: {
        backgroundColor: colorControl.activeButtonColor,
        borderColor: colorControl.buttonBorderColor,
        height: 40,
    },
    bigButton: {
        backgroundColor: colorControl.buttonColor,
        borderColor: colorControl.buttonBorderColor,
        height: 160,
    },
    bigButtonActive: {
        backgroundColor: colorControl.activeButtonColor,
        borderColor: colorControl.buttonBorderColor,
        height: 160,
    },
    buttonTextStyle: {
        fontSize: 24,
        fontFamily: 'Helvetica',
        letterSpacing: 2,
        fontWeight: '200',
        color: colorControl.buttonBorderColor,
        textShadowColor: colorControl.bgColor,
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
    },
    warningTextStyle: {
        fontSize: 20,
        fontFamily: 'Helvetica',
        letterSpacing: 0,
        fontWeight: '200',
        color: colorControl.buttonBorderColor,
        textShadowColor: colorControl.bgColor,
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
        paddingBottom: 15,
    },
    live: {
        flex: 1,
        backgroundColor: colorControl.liveColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

module.exports = {
    styles: styles,
    colorControl: colorControl,
};
