import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      error: null
    };
  }

  componentDidMount() {

    axios.get('/api/starling/info')
      .then(result => this.setState({
        username: `${result.data.firstName} ${result.data.lastName}`
      }))
      .catch(error => this.setState({
        error
      }));
  }

  render() {
    const { username } = this.state;
    let infoDiv = <a className="App-link" href="/starling">Auth Starling</a>;
    if (username) {
      infoDiv = <h1>{username}</h1>
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          {infoDiv}
        </header>
      </div>
    );
  }
}

export default App;
