import React, {
  Component
} from 'react'

import {
  StyleSheet,
  ScrollView
} from 'react-native'

import {View, ListView, Image, Caption, Tile, Title, Text, Subtitle, Button, Screen, Divider, Icon, Row} from '@shoutem/ui'
import RealmTasks from '../../realm/index';
import * as Progress from 'react-native-progress';
import config from '../../config/index';
import TimePicker from '../../components/timepicker/index';
import utils from '../../utils/index'
let moment = require('moment');


export default class Home extends Component{
  constructor(props) {
    super(props)

    this.todos = RealmTasks.realm.objects('Todo').sorted('needed', true);

    this.getTmpTodos();
    this.todos.addListener((name, changes) => {
      this.getTmpTodos();
      this.forceUpdate();
    });

    this.records = RealmTasks.realm.objects('Record');
    this.lastTime = this.records.length > 0 ? this.records[this.records.length-1].endtime : '0:00';
    this.records.addListener((name, changes) => {
      this.lastTime = this.records.length > 0 ? this.records[this.records.length-1].endtime : '0:00';
      this.forceUpdate();
    });

    this.missions = RealmTasks.realm.objects('Mission');

    this.renderTodoRow = this.renderTodoRow.bind(this);
    this.renderCompletedRow = this.renderCompletedRow.bind(this);

    this.addRecord = this.addRecord.bind(this);
  }

  getTmpTodos() {
    this.tmpTodo = [];
    this.tmpCompletedTodo = [];
    this.sum = 0;
    for (let i = 0; i < this.todos.length; i++) {
      if(this.todos[i].done)
        this.tmpCompletedTodo.push(this.todos[i]);
      else {
        this.sum += Math.max(0, this.todos[i].needed - this.todos[i].spent);
        this.tmpTodo.push(this.todos[i]);
      }
    }
  }

  completeTodo(i, state) {
    RealmTasks.realm.write(() => {
      this.todos[i].done = state
    });
  }

  modifyAdd(i) {
    this.timePicker.show(moment().format('H:mm'), this.addRecord.bind(undefined, i));
  }

  addRecord(i, time) {
    let minutes = utils.s2m(time) - utils.s2m(this.lastTime);
    if(minutes < 0) return;
    i = this.todos[i].id;

    let mission = this.missions.filtered('id = ' + i);
    if(mission.length !== 1)
      console.error("Cant find mission");

    let todo = this.todos.filtered('id = ' + i);
    if(todo.length !== 1)
      console.error("Cant find todo");

    console.warn(minutes);

    RealmTasks.realm.write(() => {
      if(todo.length === 1)
        todo[0].spent += minutes;
      if(todo.length === 1)
        todo[0].percentage = Math.min(1.0, todo[0].spent / todo[0].needed);

      if(mission.length === 1)
        mission[0].spent += minutes;
      if(mission.length === 1)
        mission[0].percentage = Math.min(1.0, mission[0].spent / mission[0].needed);

      RealmTasks.realm.create('Record', {
        starttime: this.lastTime,
        id: i,
        name: mission[0].name,
        endtime: time
      });
    });
  }


  renderTodoRow(todo,sectionId,i){
    console.log(i);
    return (
      <View>
        <Row styleName="small">
          <Progress.Pie style={styles.rowleft} progress={todo.percentage} size={20} color={config.blue}/>
          <Text>{todo.name}</Text>

          <Button title="record" styleName="right-icon" onPress={() => {}}>
            <Text>
              {utils.m2s(todo.spent - todo.needed)}
            </Text>
          </Button>

          <Button title="record" styleName="right-icon" onPress={() => this.addRecord(i, moment().format('H:mm'))}>
            <Icon name="add-event" />
          </Button>
          <Button title="modify-record" styleName="right-icon" onPress={() => this.modifyAdd(i)}>
            <Icon name="edit" />
          </Button>
          <Button title="complete" styleName="right-icon" onPress={() => this.completeTodo(i, true)}>
            <Icon name="checkbox-on" />
          </Button>
        </Row>
        <Divider styleName="line"/>
      </View>)
  }
  renderCompletedRow(todo,sectionId,i){
    console.log(i);
    return (
      <View>
        <Row styleName="small">
          <Progress.Pie style={styles.rowleft} progress={todo.percentage} size={20} color={config.blue}/>
          <Text>{todo.name}</Text>

          <Button title="record" styleName="right-icon" onPress={() => {}}>
            <Text>
              {utils.m2s(todo.spent - todo.needed)}
            </Text>
          </Button>

          <Button title="complete" styleName="right-icon" onPress={() => this.completeTodo(i, false)}>
            <Icon name="refresh" />
          </Button>
        </Row>
        <Divider styleName="line"/>
      </View>)
  }

  render() {
    return (
      <ScrollView>
        <Divider styleName="section-header">
          <Caption>Todo</Caption>
        </Divider>
        <ListView
          data={this.tmpTodo}
          renderRow={this.renderTodoRow}
        />
        <Divider styleName="section-header">
          <Caption>Completed</Caption>
        </Divider>
        <ListView
          data={this.tmpCompletedTodo}
          renderRow={this.renderCompletedRow}
        />
        <Button>
          <Icon name = "like"/>
          <Text>{utils.m2s(this.sum)} To go ~</Text>
        </Button>
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
