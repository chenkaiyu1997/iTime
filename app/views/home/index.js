import React, {
  Component
} from 'react'

import {
  StyleSheet
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

    this.todos = RealmTasks.realm.objects('Todo').sorted('percentage', true);
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
      if(this.todos[i].completed)
        this.tmpCompletedTodo.push(this.todos[i]);
      else {
        this.sum += max(0, this.todos[i].needed - this.todos[i].spent);
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
    i = this.todos[i].id;

    let mission = this.todos.filtered('id = ' + i);
    if(mission.length !== 1)
      console.error("Cant find mission");

    let todo = this.todos.filtered('id = ' + i);
    if(todo.length !== 1)
      console.error("Cant find todo");

    RealmTasks.realm.write(() => {
      todo.spent += minutes;
      todo.percentage = min(1.0, todo.spent / todo.needed);

      mission.spent += minutes;
      mission.percentage = min(1.0, mission.spent / mission.needed);

      RealmTasks.realm.create('Record', {
        starttime: this.lastTime,
        id: i,
        name: todo.name,
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
              {todo.spent - todo.needed}
            </Text>
          </Button>

          <Button title="record" styleName="right-icon" onPress={() => this.addRecord(i)}>
            <Icon name="add-event" />
          </Button>
          <Button title="modify-record" styleName="right-icon" onPress={() => this.modifyAdd(i)}>
            <Icon name="edit" />
          </Button>
          <Button title="complete" styleName="right-icon" onPress={() => this.completeTodo(i, true)}>
            <Icon name="share" />
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
              {todo.spent - todo.needed}
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
      <View>
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
          <Icon name = "add-to-favorites-full"/>
          <Text>{utils.m2s(this.sum)} To go ~</Text>
        </Button>
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
