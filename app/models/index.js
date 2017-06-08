/**
 * Created by kylechen on 17-5-31.
 */

const DailyRecordSchema = {
  name: 'DailyRecord',
  properties: {
    startTime: 'string',
    endTime: 'string'
  }
}

const MissionRecordSchema = {
  name: 'MissionRecord',
  properties: {
    date: 'string',
    time: 'string'
  }
}

const MissionSchema = {
  name: 'Mission',
  properties: {
    name: 'string',
    type: {type: 'string', default: 'ni'},
    timePerDay: 'string',
    totalTime: 'string',
    records: {type: 'list', objectType: 'MissionRecord'}
  },
};

const TodoSchema = {
    name: 'Todo',
    properties: {
      done: {type: 'bool', default: false},
      name: 'string',
      type: 'string',
      needed: 'string',
      spent: 'string',
      percentage: {type: 'float', default: 0},
      color: 'string',
    },
}

const DailySchema = {
  name: 'Daily',
  properties: {
    prevTime: 'string',
    records: {type: 'list', objectType: 'DailyRecord'}
  }
}

export default [
  DailyRecordSchema, MissionRecordSchema, MissionSchema,
  TodoSchema, DailySchema];