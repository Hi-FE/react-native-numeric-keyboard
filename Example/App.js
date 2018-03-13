/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';

import NumericKeyboard from 'react-native-numeric-keyboard';

export default class App extends Component {
  state = {
    value: ''
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.title}>Keyboard Demo</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.titleRow}>Basic</Text>
          <NumericKeyboard />
        </View>

        <View style={styles.row}>
          <Text style={styles.titleRow}>Customize Input style</Text>
          <NumericKeyboard
            text={9000}
            prefixText="¥"
            prefixTextStyle={{
              color: '#40a9ff',
              fontSize: 16,
              marginRight: 4
            }}
            textStyle={{
              color: 'red'
            }}
            inputStyle={{
              borderRadius: 4,
              borderColor: '#40a9ff',
              borderBottomWidth: 2
            }}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.titleRow}>Event callbacks props</Text>
          <Text>{this.state.value}</Text>
          <NumericKeyboard
            onChangeText={value => this.setState({ value })}
            onClose={() => console.log('[Keyboard]', 'onClose')}
            onOpen={() => console.log('[Keyboard]', 'onOpen')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 50,
    flexDirection: 'column'
  },
  row: {
    marginBottom: 20
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20
  },
  titleRow: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4
  }
});

AppRegistry.registerComponent('NumericKeyboard', () => App);
