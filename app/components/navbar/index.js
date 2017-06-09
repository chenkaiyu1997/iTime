/**
 * Created by kylechen on 17-6-8.
 */
import React, {
  Component
} from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import I18n from '../../i18n/i18n'

import {
  View,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native'

import NavigationBar from 'react-native-navbar'

const styles = {
  navbar: {
    alignItems: 'center',
    borderColor: '#e1e1e1',
    borderBottomWidth: 1
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  titleText: {
    fontSize: 18
  },
  button: {
    width: 35,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: '#333'
  },
  buttonIconFontText: {
    fontSize: 26,
    fontFamily: 'iconfont'
  }
}

function _renderBarButton(text, handler, icon = false, buttonStyle = {}, buttonTextStyle = {}) {
  let buttonText = [styles.buttonText, buttonTextStyle]
  if(icon) {
    buttonText = [buttonText, styles.buttonIconFontText]
  }
  return (
    <TouchableOpacity
      onPress={handler}
      style={[styles.button, buttonStyle]}>
      <Icon name="ios-person" size={30} color="#ff9630" />
    </TouchableOpacity>
  )
}

export default class NavbarComp extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  _leftButton() {
    switch (this.props.route.id) {
      case 'missiondetail':
      case 'settings':
      case 'records':
        return _renderBarButton('md-arrow-round-back', () => this.props.navigator.pop(), {
          paddingRight: 5
        })
      default:
        return (<View> </View>)
    }
  }

  _rightButton() {
    switch (this.props.route.id) {
      case 'missiondetail':
        return _renderBarButton(I18n.t('confirm'), this.props.route.sendTweet, false, {
          width: 50,
          marginRight: 7
        })
      case 'today':
      case 'missions':
        return _renderBarButton('md-create', this.props.route.sendFeedback, true, {
          paddingRight: 5
        })
      case 'home':
      case 'stats':
        return _renderBarButton('md-settings', this.props.route.sendFeedback, true, {
          paddingRight: 5
        })
      default:
        return (<View></View>);
    }
  }

  _title() {
    return (
      <View style={styles.title}>
        <Text style={styles.titleText}>{this.props.route.title || 'iTime'}</Text>
      </View>
    )
  }

  render() {
    let style = {
      paddingTop: 0,
      height: Platform.OS === 'android' ? 56 : 44
    }
    return (
      <NavigationBar
        style={[styles.navbar, style]}
        tintColor={'#f7f7f8'}
        leftButton={this._leftButton()}
        rightButton={this._rightButton()}
        title={this._title()}
      />
    )
  }
}