/**
 * Created by kylechen on 17-5-31.
 */

const Record = {
  name: 'Record',
  properties: {
    starttime: 'string',
    endtime: 'string'
  }
}

const Mission = {
  name: 'Mission',
  properties: {
    name: 'string',
    type: {type: 'string', optional: true},
    plan: {type: 'string', optional: true},
    total: {type: 'string', optional: true},
    deadline: {type: 'string', optional: true},
    color: 'string'
  }
};

const Todo = {
    name: 'Todo',
    properties: {
      name: 'string',
      type: {type: 'string', optional: true},
      done: {type: 'bool', default: false},
      needed: 'string',
      spent: 'string',
      color: 'string',
    }
}

const Day = {
  name: 'Day',
  properties: {
    date: 'string',
    learning: 'string',
    waste: 'string',
    dark: 'string',
    getup: 'string',
    sleep: 'string'
  }
}


export default [Record, Mission, Todo, Day];