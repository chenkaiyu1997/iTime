/**
 * Created by kylechen on 17-5-30.
 */
import React, {
  Component
} from 'react'

import {
  StyleSheet,
  View,
  Text
} from 'react-native'

import TabBarComp from '../../components/tabbar'
import NavbarComp from '../../components/navbar'

export default class Home extends Component{
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'home',
      editMode : false
    }

    this._handleChangeEditMode = this._handleChangeEditMode.bind(this);
    this._handleChangeSelectedTab = this._handleChangeSelectedTab.bind(this);
  }

  _handleChangeSelectedTab(selectedTab) {
    this.setState({
      selectedTab: selectedTab
    })
  }

  _handleChangeEditMode(editMode) {
    this.setState({
      editMode: editMode
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavbarComp route={this.props.route} navigator={this.props.navigator} {...this.state} />
        <TabBarComp route={this.props.route} navigator={this.props.navigator} {...this.state} onChangeSelectedTab={this._handleChangeSelectedTab}
        onChangeEditMode={this._handleChangeEditMode} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  }
})
