/**
 * Created by kylechen on 17-5-30.
 */
import React, {
  Component
} from 'react'

import {
  StyleSheet,
  View,
  Text,
  Alert
} from 'react-native'
import NavbarComp from '../../components/navbar'


export default class Missiondetail extends Component{
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    this.props.route.confirmMission = this.confirmMission.bind(this)
  }

  render() {
    return (
      <View style={styles.container}>
        <NavbarComp route={this.props.route} navigator={this.props.navigator}/>
        <Text>Hello!</Text>
      </View>
    )
  }

  confirmMission() {
    Alert.alert(
      'Sent successfully',
      this.state.text,
      [
        {text: 'OK', onPress: () => this.props.navigator.pop()}
      ]
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  }
})
