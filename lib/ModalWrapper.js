import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  InteractionManager,
  Platform,
  ViewPropTypes as RNViewPropTypes
} from 'react-native';

import PropTypes from 'prop-types';
const ViewPropTypes = RNViewPropTypes || View.propTypes;

/**
 * [Example]
 *   <Modal
 *     ref="modal"
 *   >
 *     <View>Content</View>
 *   </Modal>
 */
class ModalWrapper extends PureComponent {
  static propTypes = {
    maskStyle: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style,
    onPressMask: PropTypes.func
  };

  state = {
    visible: false,
    opacityAnimated: new Animated.Value(0)
  };

  render() {
    const { visible, opacityAnimated } = this.state;
    const { containerStyle, maskStyle } = this.props;
    return (
      <Modal transparent visible={visible} onRequestClose={() => {}}>
        <Animated.View style={[styles.wrapper, { opacity: opacityAnimated }]}>
          <View style={[styles.container, containerStyle]} ref="container">
            {this.props.children}
          </View>
          <View style={[styles.fullMask, styles.mask, maskStyle]} />
          <TouchableOpacity
            style={styles.fullMask}
            onPress={() => {
              this.props.onPressMask && this.props.onPressMask();
              this._hideModal();
            }}
          />
        </Animated.View>
      </Modal>
    );
  }

  show() {
    this._showModal();
  }

  hide() {
    this._hideModal();
  }

  _hideModal() {
    this._startAnimate(0, () => {
      this.setState({
        visible: false
      });
    });
  }

  _showModal() {
    this.setState(
      {
        visible: true
      },
      () => {
        this._startAnimate(1);
      }
    );
  }

  _startAnimate(toValue, callback = () => {}) {
    Animated.timing(this.state.opacityAnimated, {
      toValue,
      duration: Platform.OS === 'ios' ? 300 : 100
    }).start(callback);
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1
  },
  mask: {
    backgroundColor: 'rgba(51,51,51,0.50)'
  },
  fullMask: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
});

export default ModalWrapper;
