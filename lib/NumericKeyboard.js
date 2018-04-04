import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Image,
  Animated,
  ScrollView,
  Keyboard,
  ViewPropTypes as RNViewPropTypes
} from 'react-native';

import PropTypes from 'prop-types';
import ModalWrapper from './ModalWrapper';

const ViewPropTypes = RNViewPropTypes || View.propTypes;

const images = {
  backspace: require('./images/backspace.png'),
  keyboard: require('./images/keyboard.png')
};

function valueToStr(value) {
  return String(value || '');
}

export default class NumericKeyboard extends Component {
  static propTypes = {
    onChangeText: PropTypes.func,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    prefixText: PropTypes.string,
    prefixTextStyle: Text.propTypes.style,
    textStyle: Text.propTypes.style,
    inputStyle: ViewPropTypes.style,
    maxAmount: PropTypes.number,
    maxLength: PropTypes.number,
    placeholderText: PropTypes.string,
    placeholderTextStyle: Text.propTypes.style,
    autoFocus: PropTypes.bool,
    text: PropTypes.number,
    twoZero: PropTypes.bool,
    returnTitle: PropTypes.string,
    renderInput: PropTypes.func
  };

  static defaultProps = {
    maxAmount: 9999999,
    twoZero: false,
    returnTitle: 'Done'
  };

  state = {
    value: valueToStr(this.props.text),
    opened: false,
    openAnimated: new Animated.Value(0),
    curosrAnimated: new Animated.Value(0)
  };

  _keyboard: null;
  _keyboardDidShowListener: null;

  componentWillMount() {
    this._keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        this.state.opened && this.hide();
      }
    );
  }

  componentWillUnmount() {
    this._keyboardDidShowListener && this._keyboardDidShowListener.remove();
    this._hideModal();
  }

  componentDidMount() {
    this.props.autoFocus && this.show();
  }

  componentWillReceiveProps(newProps) {
    let textString = valueToStr(newProps.text);
    if (
      typeof newProps.text !== 'undefined' &&
      this.state.value !== textString
    ) {
      this.setState({
        value: textString
      });
    }
  }

  render() {
    const { value } = this.state;
    
    return (
      <TouchableWithoutFeedback onPress={this._handleInputPressed}>
        <View>
          {this._renderInput()}
          <ModalWrapper
            maskStyle={{ backgroundColor: 'transparent' }}
            onPressMask={() => this._hideKeyboard()}
            containerStyle={{ bottom: 0 }}
            ref={ref => (this._keyboard = ref)}
          >
            {this._renderKeyboard(value)}
          </ModalWrapper>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _renderInput() {
    const { value } = this.state;
    const {
      textStyle,
      inputStyle,
      placeholderText,
      placeholderTextStyle,
      renderInput
    } = this.props;

    if (typeof renderInput !== 'undefined') {
      return renderInput(value);
    }

    const isShowPlaceholder = placeholderText && !value;

    let placeholderStyle = isShowPlaceholder && [
      { color: '#999' }, // default placeholder text color
      placeholderTextStyle // custom
    ];
    let floatCurosrStyle = isShowPlaceholder && {
      position: 'absolute',
      left: -1,
      top: 0,
      bottom: 0
    };

    return (
      <View style={[styles.wrapper, inputStyle]}>
        {this._renderPrefix()}
        <ScrollView
          contentContainerStyle={styles.input}
          horizontal
          showsHorizontalScrollIndicator={false}
          ref="inputScrollView"
        >
          <Text style={[styles.text, textStyle, placeholderStyle]}>
            {value || placeholderText}
          </Text>
          <Animated.View
            style={[
              styles.cursor,
              floatCurosrStyle,
              { opacity: this.state.curosrAnimated }
            ]}
          />
        </ScrollView>
      </View>
    )
  }

  _renderPrefix() {
    const { prefixText, prefixTextStyle } = this.props;
    if (prefixText) {
      return <Text style={[styles.prefix, prefixTextStyle]}>{prefixText}</Text>;
    }
  }

  _renderKeyboard(value) {
    const { twoZero, returnTitle } = this.props;

    let isDisableEnter = !!!value;

    let disableEnterStyle = isDisableEnter && {
      backgroundColor: '#FFA6A6'
    };

    let transformStyle = {
      transform: [
        {
          translateY: this.state.openAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [300, 0]
          })
        }
      ]
    };

    let lastColArr = twoZero ? ['.', 0, '000'] : ['.', 0, 'keyboard'];

    return (
      <Animated.View style={[keyboardStyles.wrapper, transformStyle]}>
        <View style={keyboardStyles.numbers}>
          {this._renderKeyboardCol([1, 2, 3])}
          {this._renderKeyboardCol([4, 5, 6])}
          {this._renderKeyboardCol([7, 8, 9])}
          {this._renderKeyboardCol(lastColArr)}
        </View>
        <View style={keyboardStyles.control}>
          <TouchableHighlight
            underlayColor="#edeaea"
            onPress={() => this._handleKeyPressed('backspace')}
            style={keyboardStyles.backspace}
          >
            <View>
              <Image
                style={keyboardStyles.backspaceIcon}
                source={images.backspace}
                resizeMode="contain"
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={isDisableEnter ? '#edeaea' : '#FFA6A6'}
            onPress={() => this._handleKeyPressed('done')}
            disabled={isDisableEnter}
            style={[keyboardStyles.enter, disableEnterStyle]}
          >
            <View>
              <Text style={keyboardStyles.returnKeyText}>{returnTitle}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </Animated.View>
    );
  }

  _renderKeyboardCol(items) {
    return (
      <View style={keyboardStyles.row}>
        {items.map((item, i) => {
          return (
            <TouchableHighlight
              underlayColor="#edeaea"
              onPress={() => this._handleKeyPressed(item)}
              key={i}
              style={keyboardStyles.cell}
            >
              <View>
                {item === 'keyboard' ? (
                  <Image
                    style={keyboardStyles.keyboardIcon}
                    source={images.keyboard}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={keyboardStyles.cellText}>{item}</Text>
                )}
              </View>
            </TouchableHighlight>
          );
        })}
      </View>
    );
  }

  _handleKeyPressed = item => {
    const { value = '' } = this.state;
    const { maxAmount, maxLength } = this.props;

    if (item === 'keyboard') {
      return this.hide();
    }
    if (item === 'done') {
      return this.hide();
    }

    // 第一个不能输入小数点;
    // 已经输入过小数点，不能再输入小数点
    if (item === '.' && (value.indexOf('.') !== -1 || value.length === 0)) {
      return;
    }

    let newValue = (value || '') + (item === 'backspace' ? '' : item);

    if (maxAmount !== undefined) {
      if (Number(newValue) > maxAmount) {
        newValue = '' + maxAmount;
      }
    }

    if (newValue.length > maxLength) {
      return;
    }
    

    if (item === 'backspace') {
      newValue = newValue.slice(0, newValue.length - 1);
    }
    this.props.onChangeText && this.props.onChangeText(newValue);

    this.setState({
      value: newValue
    });

    this.refs.inputScrollView &&
      this.refs.inputScrollView.scrollToEnd({ animated: false });
  };

  _handleInputPressed = () => {
    this.show();
  };

  show() {
    if (this.state.opened) {
      return;
    }

    // 显示键盘
    this._keyboard.show();

    // 开始光标动画
    this._startCurosrAnimate();
    this._startOpenAnimate();

    this.setState({
      opened: true
    });
    this.props.onOpen && this.props.onOpen();
  }

  hide() {
    if (!this.state || !this.state.opened) {
      return;
    }

    // 键盘关闭后才关闭遮罩
    this._hideKeyboard().then(() => {
      this._hideModal();
    });
  }

  clear() {
    this.setState({ value: '' });
  }

  async _hideKeyboard() {
    this.setState({
      opened: false
    });

    await this._endOpenAnimate();
    this.props.onClose && this.props.onClose();
  }

  _hideModal() {
    this._keyboard.hide();
  }

  /**
   * 键盘弹出动画
   */
  _startOpenAnimate() {
    Animated.timing(this.state.openAnimated, {
      toValue: 1,
      duration: 300
    }).start();
  }

  _endOpenAnimate() {
    return new Promise(resolve => {
      Animated.timing(this.state.openAnimated, {
        toValue: 0,
        duration: 300
      }).start(() => resolve());
    });
  }

  /**
   * 光标动画
   */
  _startCurosrAnimate() {
    Animated.timing(this.state.curosrAnimated, {
      toValue: 1,
      duration: 800
    }).start(() => this._endCurosrAnimate());
  }

  _endCurosrAnimate() {
    Animated.timing(this.state.curosrAnimated, {
      toValue: 0,
      duration: !this.state.opened ? 0 : 400
    }).start(() => {
      if (!this.state.opened) {
        return;
      }
      this._startCurosrAnimate();
    });
  }
}

const keyboardStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F6F6F6',
    flexDirection: 'row',
    zIndex: 2
  },
  absolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1
  },
  numbers: {
    flex: 0.8
  },
  control: {
    flex: 0.2,
    flexDirection: 'column'
  },

  row: {
    flexDirection: 'row'
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  cellText: {
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 32,
    textAlign: 'center',
    color: '#333'
  },

  backspace: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backspaceIcon: {
    width: 36,
    height: 27
  },
  keyboardIcon: {
    width: 38,
    height: 28,
    paddingTop: 16,
    paddingBottom: 16
  },
  enter: {
    flex: 1,
    backgroundColor: 'red',
    borderRadius: 60,
    justifyContent: 'center',
    margin: 10
  },
  returnKeyText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center'
  }
});

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: '#999',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    height: 48
  },
  prefix: {
    fontSize: 14,
    color: '#333',
    paddingRight: 2
  },

  input: {
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingRight: 5
  },

  cursor: {
    width: 2,
    backgroundColor: '#466eee',
    marginLeft: 2,
    marginRight: 5
  },
  text: {
    color: '#333',
    fontSize: 14
  }
});
