/**
 * Created by kylechen on 17-5-30.
 */
import React, {
  Component
} from 'react'

import {
  StyleSheet,
  ScrollView
} from 'react-native'

import {View, TextInput, ListView, Image, Caption, Tile, Title, Text, Subtitle, Button, Screen, Divider, Icon, Row, DropDownMenu} from '@shoutem/ui'
import RealmTasks from '../../realm/index';
import * as Progress from 'react-native-progress';
import config from '../../config/index'
import DatePicker from '../../components/datepicker/index'
import utils from '../../utils/index'
import NavbarComp from '../../components/navbar'
import TimePicker from '../../components/timepicker/index'
let moment = require('moment');

export default class Missiondetail extends Component{
  constructor(props) {
    super(props);

    this.id = this.props.missionid;
    this.missions = RealmTasks.realm.objects('Mission').filtered('id = ' + this.id);
    if(this.missions.length === 0)
      console.error("no mission found!");
    this.mission = this.missions[0];

    this.missions.addListener((name, changes) => {
      this.forceUpdate();
    });

    this.state = {
      name: this.mission.name,
      daily: this.mission.daily,
      spent: this.mission.spent,
      date: this.mission.date,
      needed: this.mission.needed,
      percentage: this.mission.percentage,
      deadline: ''
    };
    this.allValues();

    this.renderitem = this.renderitem.bind(this);
    this.allValues = this.allValues.bind(this);
    this.updateDate = this.updateDate.bind(this);

  }

  allValues() {
    this.setState({
      name: this.mission.name,
      daily: this.mission.daily,
      spent: this.mission.spent,
      date: this.mission.date,
      needed: this.mission.needed,
      percentage: this.mission.percentage,
      deadline: ''
    });
  }
  onChangeText(part, text) {
    let tmp = {};
    tmp[part] = text;
    this.setState(tmp);
  }
  onSubmit(part, state, keyboard) {
    if(state === false)
      return;
    let tmp = this.state[part];
    if(keyboard === 'numeric')
      tmp = parseInt(tmp, 10);
    RealmTasks.realm.write(() => {
      this.mission[part] = tmp;
      this.mission.needed = this.mission.daily * (moment().diff(moment(time, 'MM-DD-YYYY'), 'days') + 1);
      this.mission.percentage = this.mission.needed === 0 ? 0 : this.mission.spent / this.mission.needed;
    });
  }
  renderitem(part, keyboard='default') {
    return (
      <View>
        <Divider styleName="section-header">
          <Caption>
            {part}
          </Caption>
        </Divider>
        <TextInput
          value={'' + this.state[part]}
          placeholder={part}
          onChangeText={(text) => this.onChangeText(part, text)}
          onEndEditing={() => this.onSubmit(part, true, keyboard)}
          onBlur={() => this.onSubmit(part, false, keyboard)}
          onSubmitEditing={() => this.onSubmit(part, true, keyboard)}
          keyboardType={keyboard}
        />
      </View>
    )
  }
  showPicker(t, part) {
    this.datePicker.show(t, this.updateDate.bind(undefined, part));
  }
  updateDate(part, time) {
    RealmTasks.realm.write(() => {
      this.mission[part] = time;
      this.mission.needed = this.mission.daily * (moment().diff(moment(time, 'MM-DD-YYYY'), 'days') + 1);
      this.mission.percentage = this.mission.needed === 0 ? 0 : this.mission.spent / this.mission.needed;
    });
    setImmediate(() => this.allValues());
  }

  render() {
    return (
      <ScrollView>
        <NavbarComp route={this.props.route} navigator={this.props.navigator}/>

        {this.renderitem('name')}
        {this.renderitem('daily', 'numeric')}
        {this.renderitem('spent', 'numeric')}
        {this.renderitem('needed', 'numeric')}
        {this.renderitem('percentage', 'numeric')}
        <Divider styleName="section-header">
          <Caption>
            {'Date'}
          </Caption>
        </Divider>
        <Row>
          <Text>{this.mission.date}</Text>
          <Icon name="add-event" onPress={() => this.showPicker(this.mission.date, 'date')}/>
        </Row>
        <DatePicker ref={(ref) => this.datePicker = ref}/>
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  }
})
