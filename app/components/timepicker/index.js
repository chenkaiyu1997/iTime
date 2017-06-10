/**
 * Created by kylechen on 17-6-10.
 */
import DatePicker from 'react-native-datepicker'
import React, {
  Component
} from 'react';

import {
  View
} from 'react-native';

export default class TimePicker extends Component {

  constructor(props){
    super(props)
    this.state = {
      time:"0:00"
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
      time: "0:00"
    });
  }

  render(){
    return (
      <DatePicker
        ref={(ref) => this.datePicker=ref}
        style={{height: 0}}
        date={this.state.time}
        mode="time"
        placeholder="select time"
        format="H:mm"
        minDate="0:00"
        maxDate="23:59"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        is24Hour={true}
        onDateChange={(time) => {
          this.setState({time: time});
          this.confirm(time)
        }}
      />
    )
  }
}