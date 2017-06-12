import React, {
  Component
} from 'react'

import {
  StyleSheet
} from 'react-native'

import {View, ListView, Image, Caption, Tile, Title, Text, Subtitle, Button, Screen, Divider, Icon, Row, DropDownMenu} from '@shoutem/ui'
import RealmTasks from '../../realm/index';
import * as Progress from 'react-native-progress';
import config from '../../config/index'
import TimePicker from '../../components/timepicker/index'
import utils from '../../utils/index'
import NavbarComp from '../../components/navbar'


export default class Records extends Component{
  constructor(props) {
    super(props)

    this.todos = RealmTasks.realm.objects('Todo');
    this.missions = RealmTasks.realm.objects('Mission');
    this.tmpMissions = [];
    for (let i = 0; i < this.missions.length; i++)
      this.tmpMissions.push({
        title: this.missions[i].name,
        value: this.missions[i].id
      });

    this.records = RealmTasks.realm.objects('Records').sorted('starttime');

    this.getTmpRecords();
    this.lastTime = this.records.length > 0 ? this.records[this.records.length-1].endtime : '0:00';
    this.records.addListener((name, changes) => {
      this.lastTime = this.records.length > 0 ? this.records[this.records.length-1].endtime : '0:00';
      this.getTmpRecords();
      this.forceUpdate();
    });

    this.updateTime = this.updateTime.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillMount() {
    this.props.route.addNew = this.addNew.bind(this)
  }

  updateOthers(id, minutes) {

    let mission = this.todos.filtered('id = ' + id);
    if(mission.length !== 1)
      console.error("Cant find mission");

    let todo = this.todos.filtered('id = ' + id);
    if(todo.length !== 1)
      console.error("Cant find todo");

    RealmTasks.realm.write(() => {
      todo.spent += minutes;
      todo.percentage = min(1.0, todo.spent / todo.needed);
      mission.spent += minutes;
      mission.percentage = min(1.0, mission.spent / mission.needed);
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
            selectedOption={() => {
              for(let ti = 0; ti < this.tmpMissions; ti++)
                if(record.id === this.tmpMissions[ti].value)
                  return this.tmpMissions[ti];
              return this.tmpMissions[0];
            }}
            onOptionSelected={(option) => this.changeId(i, option)}
            titleProperty="title"
            valueProperty="value"/>
          <Text onPress={() => this.changeId(i, 'endtime')}>{record.name}</Text>

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
      <View>
        <NavbarComp route={this.props.route} navigator={this.props.navigator}/>
        <ListView
          data={this.tmpRecords}
          renderRow={this.renderRow}
        />
        <TimePicker ref={(ref) => this.timePicker = ref}/>
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
