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
import NavbarComp from '../../components/navbar'


export default class Settings extends Component{
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <View style={styles.container}>
        <NavbarComp route={this.props.route} navigator={this.props.navigator}/>
        <Text>Hello!</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  }
})
