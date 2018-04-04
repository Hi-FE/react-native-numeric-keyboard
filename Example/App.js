/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, ScrollView } from 'react-native';

import NumericKeyboard from 'react-native-numeric-keyboard';

export default class App extends Component {
  state = {
    value: ''
  };
  _scrollView: null;

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container} ref={ref => this._scrollView = ref}>
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
            onClose={() => {
              this._scrollView.scrollTo({ y: 0 })
              console.log('[Keyboard]', 'onClose')
            }}
            onOpen={() => {
              this._scrollView.scrollTo({ y: 200 })
              console.log('[Keyboard]', 'onOpen')
            }}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.titleRow}>Custom Input</Text>
          <NumericKeyboard
            text={666}
            maxLength={6}
            renderInput={text => this._renderInput(text)}            
            onClose={() => console.log('[Keyboard]', 'onClose')}
            onOpen={() => console.log('[Keyboard]', 'onOpen')}
          />
        </View>
      </ScrollView>
    );
  }

  _renderInput (text) {
    const arr = [1,2,3,4,5,6];
    const textArr = text.split('');

    return (
      <View style={customInputStyles.container}>
        <View style={customInputStyles.codeRow}>
          {arr.map((value, index) => {
            let text = textArr[index];
            return (
              <View style={customInputStyles.textContainer} key={index}>
                {text && <Text style={customInputStyles.text}>{text}</Text>}
              </View>
            )
          })}
        </View>
        <View style={customInputStyles.indicatorRow}>
          {arr.map((value, index) => <View style={customInputStyles.indicator} key={index} />)}
        </View>
      </View>
    )
  }
  }

const customInputStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: 60
  },

  codeRow: {
    flexDirection: 'row',
    flex: 1
  },

  indicatorRow: {
    flexDirection: 'row',
  },
  indicator: {
    flex: 1,
    height: 2,
    backgroundColor: '#d8d8d8',
    marginLeft: 4,
    marginRight: 4
  },

  textContainer: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 24,
    color: '#333'
}
})

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
