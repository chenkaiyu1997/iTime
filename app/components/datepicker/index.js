/**
 * Created by kylechen on 17-6-10.
 */
import HisDatePicker from 'react-native-datepicker'
let moment = require('moment');
import React, {
  Component
} from 'react';

import {
  View
} from 'react-native';

export default class DatePicker extends Component {

  constructor(props){
    super(props)
    this.state = {
      time: moment().format('MM-DD-YYYY')
    }
  }
  show(dtime, callback) {
    console.log("show!"+dtime);
    this.setState({
      time: dtime
    });
    setImmediate(() => {
      this.datePicker.state.date = dtime;
      this.datePicker.onPressDate();
      this.callback = callback;
    })
  }
  confirm(time) {
    console.log("confirm!"+time);
    this.callback(time);
    this.setState({
      time: moment().format('MM-DD-YYYY')
    });
  }

  render(){
    return (
      <HisDatePicker
        ref={(ref) => this.datePicker=ref}
        style={{height: 0}}
        date={this.state.time}
        mode="date"
        placeholder="select date"
        format="MM-DD-YYYY"
        minDate="12-25-1995"
        maxDate="01-01-2035"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        onDateChange={(time) => {
          this.setState({time: time});
          this.confirm(time)
        }}
      />
    )
  }
}