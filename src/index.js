import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
            Project list
        </header>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));

export default App;
