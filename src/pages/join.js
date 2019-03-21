import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Join extends Component {
  constructor(props) {
    super(props);
    // console.log(props.match.params.id);
    // this.state = {
    //   id: props.match.params.id,
    //   group: {}
    // }
    // axios.get(`/api/group/${props.match.params.id}`)
    //   .then(res => {
    //     if (res.status !== 200) throw new Error(res);
    //     return res;
    //   })
    //   .then(res => this.setState({ group: res.data }))
    //   .catch(error => this.setState({
    //     error
    //   }));
  }

  componentDidUpdate() {
    // const leadMember = this.state.group.leadMember
    // if (leadMember) {
    //   console.log(leadMember)
    // }
  }

  joinGroup = () => {
    const id = this.state.id;
    console.log('id', id);
    axios.post(`/api/group/${id}`)
      .then(res => {
        if (res.status !== 200) throw new Error(res);
        console.log(res);
        return res;
      })
      .then(res => this.setState(res.data))
      .catch(error => this.setState({
        error: error
      }));
  }

  render() {
    // console.log(this.state)
    // const group = this.state.group;
    // const leadMember = group.leadMember
    return (
      <div id='group-join'>
        <h1>Join Group</h1>
        {/* { (leadMember) ? <p>Split the bill with {leadMember.firstname} {leadMember.lastname}</p> : null} */}
        {/* <Link to={`/group${group.endpoint}`}>Split it!</Link> */}
      </div>
    );
  }
}

export default Join;