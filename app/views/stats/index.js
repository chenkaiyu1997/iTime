import React, {
  Component
} from 'react'

import {
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native'

import {View, ListView, Image, Caption, Tile, Title, Text, Subtitle, Button, Screen, Divider, Icon, Row} from '@shoutem/ui'
import RealmTasks from '../../realm/index';
import config from '../../config/index';
import utils from '../../utils/index'
let moment = require('moment');


export default class Stats extends Component{
  constructor(props) {
    super(props)

    this.days = RealmTasks.realm.objects('Day').sorted('date', true);
    this.getTmpDays();

    this.days.addListener((name, changes) => {
      this.getTmpDays();
      this.forceUpdate();
    });

    this.renderDayRow = this.renderDayRow.bind(this);
    this.deleteDay = this.deleteDay.bind(this);
  }

  getTmpDays() {
    this.tmpDays = [];
    for (let i = 0; i < this.days.length; i++) {
      this.tmpDays.push(this.days[i]);
    }
  }

  deleteDay(i) {
    RealmTasks.realm.write(() => {
      RealmTasks.realm.delete(this.days[i]);
    });
  }

  deleteAlert(i) {
    Alert.alert(
      'Are you sure',
      'This operation may not be recovered',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => setImmediate(() => this.deleteDay(i))},
      ],
      { cancelable: true }
    )
  }

  renderDayRow(day,sectionId,i){
    return (
      <Row>
        <Button>
          <Title>{day.date}</Title>
        </Button>
        <Button>
          <Title></Title>
        </Button>
        <View styleName="vertical stretch space-between">
          <Subtitle>{'Percentage: ' + day.percentage.toFixed(2) + '\nLearning Time: ' + day.learning}</Subtitle>
          <Caption>{day.getup + '~' +  day.sleep}</Caption>
        </View>
        <Button styleName="disclosure" onPress={() => this.deleteAlert(i)}>
          <Title>{day.grade}</Title>
        </Button>
      </Row>)
  }

  render() {
    return (
      <ScrollView>
        <ListView
          data={this.tmpDays}
          renderRow={this.renderDayRow}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  rowleft: {
    marginRight: 20
  },
  rowRight: {
    alignSelf: 'flex-end'
  }
})