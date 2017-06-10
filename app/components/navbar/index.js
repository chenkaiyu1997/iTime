/**
 * Created by kylechen on 17-6-8.
 */
import React, {
  Component
} from 'react'

import Icon from 'react-native-vector-icons/Ionicons';
import I18n from '../../i18n/i18n'
import NavigationBar from 'react-native-navbar'



import {
  View,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native'

const styles = {
  navbar: {
    alignItems: 'center',
    borderColor: '#e1e1e1',
    borderBottomWidth: 1
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  titleText: {
    fontSize: 18,
    color: '#333333'

  },
  button: {
    width: 35,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: '#333333'
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
      {icon ? <Icon name={text} style={buttonText} size={30} color={'#333333'}/> : <Text style={buttonText}>{text}</Text>}
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
      case 'index':
        return _renderBarButton('ios-person', () => this.props.navigator.push({
          title: 'settings',
          id: 'settings'
        }), true, {
          paddingRight: 5
        })
      default:
        return _renderBarButton('md-arrow-round-back', () => this.props.navigator.pop(), {
          paddingRight: 5
        })
    }
  }

  _rightButton() {
    switch (this.props.route.id) {
      case 'index':
        switch (this.props.selectedTab) {
          case 'home':
          case 'today':
            if(!this.props.editMode) {
              return _renderBarButton('md-create', this.props.route.toggleEditMode, true);
            }
            return _renderBarButton(I18n.t('done'), this.props.route.toggleEditMode, false, {
              width: 50,
              marginRight: 7
            });
          case 'missions':
            return _renderBarButton('md-add', this.props.route.addNew, true);
          default:
            return (<View/>)
        }
      case 'record':
        return _renderBarButton('md-add', this.props.route.addNew, true);
      case 'missiondetail':
        return _renderBarButton(I18n.t('confirm'), this.props.route.confirm, false,{
          width: 50,
          marginRight: 7
        });
      default:
        return (<View/>);
    }
  }

  _title() {
    let title = this.props.route.id;
    if(title === 'index')
      title = this.props.selectedTab;
    return (
      <View style={styles.title}>
        <Text style={styles.titleText}>{I18n.t(title)}</Text>
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
        tintColor={'#ffffff'}
        leftButton={this._leftButton()}
        rightButton={this._rightButton()}
        title={this._title()}
      />
    )
  }
}