import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import preview_description from './previews';

class Preview extends Component {
    render() {
        return (
            <div className="preview" onClick={() => window.open(this.props.link, '_self')}>
                <img className='preview_img' alt={this.props.title} src={this.props.img}/>
                <h4 className='preview_title'>{this.props.title}</h4>
                <p className='preview_text'>{this.props.text}</p>
                <p className='preview_bottom'>{this.props.bottom}</p>
            </div>
        )
    }
}

class App extends Component {
    render() {

        return (
            <div id="app-container">
                <h3 id="app-title">My Projects</h3>
                {preview_description.map((d, index) => 
                    <Preview 
                        key={index} 
                        title={d.title} 
                        text={d.text}
                        bottom={d.bottom_text}
                        img={d.img}
                        github={d.github}
                        link={d.link}
                />)}
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));

export default App;
