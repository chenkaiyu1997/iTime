import React, {
  Component
} from 'react'

import {
  StyleSheet,
  ScrollView
} from 'react-native'

import {View, ListView, Image, Caption, Tile, Title, Text, Subtitle, Button, Screen, Divider, Icon, Row, DropDownMenu} from '@shoutem/ui'
import RealmTasks from '../../realm/index';
import * as Progress from 'react-native-progress';
import config from '../../config/index'
import TimePicker from '../../components/timepicker/index'
import utils from '../../utils/index'
import NavbarComp from '../../components/navbar'
let moment = require('moment');

export default class Records extends Component{
  constructor(props) {
    super(props)

    this.todos = RealmTasks.realm.objects('Todo');
    this.missions = RealmTasks.realm.objects('Mission');
    this.tmpMissions = [];
    for (let i = 0; i < this.todos.length; i++)
      this.tmpMissions.push({
        title: this.todos[i].name,
        value: this.todos[i].id
      });

    this.records = RealmTasks.realm.objects('Record').sorted('starttime');

    this.getTmpRecords();
    this.lastTime = this.records.length > 0 ? this.records[this.records.length-1].endtime : '0:00';
    this.records.addListener((name, changes) => {
      this.lastTime = this.records.length > 0 ? this.records[this.records.length-1].endtime : '0:00';
      this.getTmpRecords();
      this.forceUpdate();
    });

    this.updateTime = this.updateTime.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.findRowId = this.findRowId.bind(this);
  }

  componentWillMount() {
    this.props.route.addNew = this.addNew.bind(this)
  }

  updateOthers(id, minutes) {

    let mission = this.missions.filtered('id = ' + id);
    if(mission.length !== 1)
      console.warn("Cant find mission");

    let todo = this.todos.filtered('id = ' + id);
    if(todo.length !== 1)
      console.warn("Cant find todo");

    RealmTasks.realm.write(() => {
      if(todo.length === 1)
        todo[0].spent += minutes;
      if(todo.length === 1)
        todo[0].percentage = Math.min(1.0, todo[0].needed === 0 ? 0 : todo[0].spent / todo[0].needed);
      if(mission.length === 1)
        mission[0].spent += minutes;
      if(mission.length === 1)
        mission[0].percentage = Math.min(1.0, mission[0].needed === 0 ? 0 :mission[0].spent / mission[0].needed);
    });
  }

  addNew() {
    if(this.missions.length === 0)
      return;
    this.updateOthers(this.missions[0].id, utils.s2m(moment().format('H:mm')) - utils.s2m(this.lastTime))
    
    RealmTasks.realm.write(() => {
      RealmTasks.realm.create('Record', {
        starttime: this.lastTime,
        id: this.missions[0].id,
        name: this.missions[0].name,
        endtime: moment().format('H:mm')
      });
    });
  }

  getTmpRecords() {
    this.tmpRecords = [];
    for (let i = 0; i < this.records.length; i++)
      this.tmpRecords.push(this.records[i]);
  }

  adjustTime(t, i, type) {
    this.timePicker.show(t, this.updateTime.bind(undefined, i, type));
  }

  updateTime(i, type, time) {
    let pre = utils.s2m(this.records[i].endtime) - utils.s2m(this.records[i].starttime);
    let now = 0;
    if(type === 'starttime')
      now = utils.s2m(this.records[i].endtime) - utils.s2m(time);
    else
      now = utils.s2m(time) - utils.s2m(this.records[i].starttime);

    RealmTasks.realm.write(() => {
      this.records[i][type] = time;
    });

    this.updateOthers(this.records[i].id, now - pre);
  }

  changeId(i, option) {
    let time = utils.s2m(this.records[i].endtime) - utils.s2m(this.records[i].starttime);
    this.updateOthers(this.records[i].id, -time);

    RealmTasks.realm.write(() => {
      this.records[i].name = option.title;
      this.records[i].id = option.value;
    });

    this.updateOthers(option.value, time);
  }
  deleteRecord(i) {
    let time = utils.s2m(this.records[i].endtime) - utils.s2m(this.records[i].starttime);
    this.updateOthers(this.records[i].id, -time);

    RealmTasks.realm.write(() => {
      RealmTasks.realm.delete(this.records[i]);
    });
  }

  findRowId(recordId) {
    for(let ti = 0; ti < this.tmpMissions.length; ti++)
      if(this.tmpMissions[ti].id === recordId)
        return ti;
    return 0;
  }
  renderRow(record,sectionId,i){
    return (
      <View>
        <Row styleName="small">


          <Button title="adjusttime" onPress={() => this.adjustTime(record.starttime, i, 'starttime')}>
            <Text>{record.starttime}</Text>
            <View styleName="Vertical">
              <Icon name="up-arrow" />
              <Icon name="down-arrow" />
            </View>
          </Button>

          <DropDownMenu
            options={this.tmpMissions}
            selectedOption={this.tmpMissions[this.findRowId(record.id)]}
            onOptionSelected={(option) => this.changeId(i, option)}
            titleProperty="title"
            valueProperty="value"/>
          <Text>{record.name}</Text>


          <Button title="adjusttime" styleName="disclosure" onPress={() => this.adjustTime(record.endtime, i, 'endtime')}>
            <Text>{record.endtime}</Text>
            <View styleName="Vertical">
              <Icon name="up-arrow" />
              <Icon name="down-arrow" />
            </View>
          </Button>

          <Button title="delete" styleName="right-icon" onPress={() => this.deleteRecord(i)}>
            <Icon name="close" />
          </Button>



        </Row>
        <Divider styleName="line"/>
      </View>)
  }

  render() {
    return (
      <ScrollView>
        <NavbarComp route={this.props.route} navigator={this.props.navigator}/>
        <ListView
          data={this.tmpRecords}
          renderRow={this.renderRow}
        />
        <TimePicker ref={(ref) => this.timePicker = ref}/>
      </ScrollView>
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
