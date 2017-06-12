/**
 * Created by kylechen on 17-5-31.
 */

const Record = {
  name: 'Record',
  properties: {
    id: 'int',
    name: 'string',
    starttime: 'string',
    endtime: 'string'
  }
}

const Mission = {
  name: 'Mission',
  properties: {
    id: 'int',
    name: 'string',
    type: {type: 'int', optional: true},
    daily: {type: 'int', default: 1},
    spent: {type: 'int', default: 0},
    date: 'string',
    percentage: {type: 'float', default: 0},
    needed: {type: 'int', default: 1},
    deadline: {type: 'string', optional: true},
    color: {type: 'string', optional: true}
  }
};

const Todo = {
    name: 'Todo',
    properties: {
      id: 'int',
      name: 'string',
      type: {type: 'string', optional: true},
      done: {type: 'bool', default: false},
      needed: 'int',
      spent: 'int',
      color: {type: 'string', optional: true},
      percentage: {type: 'float', default: 0}
    }
}

const Day = {
  name: 'Day',
  properties: {
    date: 'string',
    learning: {type: 'int', optional: true},
    percentage: {type: 'float', optional: true},
    getup: {type: 'string', optional: true},
    sleep: {type: 'string', optional: true},
    grade: {type: 'string', optional: true},
  }
}


export default [Record, Mission, Todo, Day];