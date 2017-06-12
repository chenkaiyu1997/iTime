import React, {
  Component
} from 'react'

import {
  StyleSheet
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

    this.renderDayRow = this.renderDayRow.bind(this);
  }

  getTmpDays() {
    this.tmpDays = [];
    for (let i = 0; i < this.days.length; i++) {
        this.tmpDays.push(this.days[i]);
    }
  }

  renderDayRow(day,sectionId,i){
    return (
      <Row>
        <View/>
        <Title>{day.grade}</Title>
        <View styleName="vertical stretch space-between">
          <Subtitle>{'Percentage:' + day.percentage + '\nLearning Time:' + day.learning}</Subtitle>
          <Caption>{day.getup + '~' +  day.sleep}</Caption>
        </View>
      </Row>)
  }

  render() {
    return (
      <View>
        <ListView
          data={this.tmpDays}
          renderRow={this.renderDayRow}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  rowleft: {
    marginRight: 10
  },
  rowRight: {
    alignSelf: 'flex-end'
  }
})
