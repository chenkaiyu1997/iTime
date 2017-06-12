/**
 * Created by kylechen on 17-6-12.
 */
/**
 * Created by kylechen on 17-5-31.
 */
'use strict';

import Realm from 'realm';
import RealmTasks from '../../realm/index'
import utils from '../../utils/index'
let moment = require('moment');

function getGrade(percentage, getup, sleep) {
  if(percentage < 0.3) return 'F';
  if(percentage < 0.4) return 'E';
  if(percentage < 0.6) return 'D';
  if(percentage < 0.7) return 'C';
  if(percentage < 0.8) return 'C+';
  if(percentage < 0.9) return 'B';
  if(percentage < 0.95) return 'B+';
  if(utils.s2m(getup) < utils.s2m('7:30') && utils.s2m(sleep) < utils.s2m('23:30')) return 'A+';
  return 'A';
}

function newDay() {
  console.log('newDay');
  let todos = RealmTasks.realm.objects('Todo');
  let records = RealmTasks.realm.objects('Record');
  let missions = RealmTasks.realm.objects('Mission');

  let sum = 0, learning = 0, lack = 0;
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].needed <= 0) continue;
    learning += todos[i].spent;
    sum += todos[i].needed;
    lack += Math.max(0, todos[i].needed - todos[i].spent);
  }
  let getup = records[0] ? records[0].endtime : '0:00';
  let sleep = records[records.length - 1] ? records[records.length - 1].endtime : '0:00';
  let grade = getGrade(sum === 0 ? 0 : lack / sum, getup, sleep);
  RealmTasks.realm.write(() => {
    let yesterday = RealmTasks.realm.objects('Day').filtered('date = ' + '"' + moment().subtract(1, 'days').format('MM-DD-YYYY') + '"');
    RealmTasks.realm.delete(yesterday);

    RealmTasks.realm.create('Day', {
      date: moment().subtract(1, 'days').format('MM-DD-YYYY'),
      learning: learning,
      percentage: sum === 0 ? 0 : lack / sum,
      getup: getup,
      sleep: sleep,
      grade: grade
    });

    RealmTasks.realm.create('Day', {
      date: moment().format('MM-DD-YYYY'),
      learning: 0,
      percentage: 0,
      getup: '0:00',
      sleep: '0:00',
      grade: 'F'
    });

    RealmTasks.realm.delete(todos);
    RealmTasks.realm.delete(records);
    for (let i = 0; i < missions.length; i++) {
      if (missions[i].daily > 0)
        RealmTasks.realm.create('Todo', {
          id: missions[i].id,
          name: missions[i].name,
          needed: missions[i].daily,
          spent: 0
        });
      missions[i].needed = missions[i].daily * moment().diff(moment(missions[i].date), 'days') + 1
    }
  });
}

export default {
  startup: function() {
    let days = RealmTasks.realm.objects('Day');
    if(days.length === 0 || days[days.length - 1].date !== moment().format('MM-DD-YYYY'))
      newDay();
  }
}