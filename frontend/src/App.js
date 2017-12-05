import React, { Component } from 'react';
import elasticlunr from 'elasticlunr';
import { Button, ButtonToolbar, Navbar, Nav, FormControl, Panel } from 'react-bootstrap';
import cheerio from 'cheerio'

import request from './request';
import Keys from './Keys';

import './bootstrap.css';
import './bootstrap-theme.css';
import './App.css';
import {Socket} from "phoenix";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      classes: [],

      messages: [],
      selectedSquares: [],

      showingClass: null,
      showingRegister: null,

      isLoggedIn: false,
      email: ''
    };

    this.textBox = null;

    this.usernameBox = null;
    this.passwordBox = null;
    this.messageBody = null;
    
    // Set up a channel connection
    this.socket = new Socket("ws://" + window.location.hostname + "/socket")
    // this.socket = new Socket("/socket")

    this.socket.connect();

    // Now that you are connected, you can join channels with a topic:
    this.channel = this.socket.channel("updates:lobby", {});
    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) });

    this.channel.on('ping', this.receiveMessage.bind(this));

    this.submitMessage = this.submitMessage.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.getMessages();

  }

  handleClick(selected) {
    selected.currentTarget.style.backgroundColor = 'red';
  }

  receiveMessage(messageData) {
    this.getMessages()
  }

  async getMessages() {

    let posts = await request({
      url: '/api/v1/likes',
      method: 'GET'
    })

    const $ = cheerio.load(posts);

    let postid = $('.postid')
    let content = $('.content')
    let users = $('.postuserid')

    let output = []

    for (var i = 0; i < users.length; i++) {
      output.push({
        id: $(postid[i]).text(),
        content: $(content[i]).text(),
        userId: $(users[i]).text()
      })
    }

    console.log('Fetched messages')

    this.setState({
      messages: output
    })
  }

  // Class key is a key to a class. This can be found by running Keys.create(aClass).getHash()
  // a key looks like this: lafayette.edu/201740/WAIT/001_1967790890
  async submitMessage() {
    let text = this.messageBody.value;
    let userEmail = this.usernameBox;
    
    await request({
      method: 'POST',
      form: true,
      body: {
        _utf8: '✓',
        'post[postid]': '4',
        'post[content]': text,
        'post[user_id]': userEmail
      },
      url: '/api/v1/likes'
    })

    this.channel.push("ping", {
      content: text
    });

    return this.getMessages();
  }

  getMessageForm(aClass) {
    return (
      <div className='message-form'>
        <FormControl
          type='text'
          placeholder='Chat!'
          className='message-body'
          ref={(message) => { this.messageBody = message }}
        />
        <Button className='send-message' onClick={ this.submitMessage.bind(this) }>Send</Button>
      </div>
      )
  }

  render() {

    let messageForm = this.getMessageForm();

    return (
      <div className='App'>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href='#'>Battleship!</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav />
            <Nav pullRight />
          </Navbar.Collapse>
        </Navbar>

        <div className='container'>
          <div className='game-container'>
            <div className='battleship-container'>
              <span className='game-header'>Your Board</span>
              <div className='user-game'>
                <div onClick={this.handleClick.bind(this)} className='game-cell 00'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 01'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 02'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 03'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 04'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 05'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 06'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 07'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 08'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 09'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 10'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 11'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 12'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 13'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 14'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 15'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 16'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 17'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 18'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 19'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 20'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 21'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 22'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 23'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 24'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 25'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 26'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 27'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 28'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 29'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 30'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 31'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 32'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 33'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 34'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 35'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 36'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 37'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 38'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 39'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 40'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 41'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 42'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 43'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 44'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 45'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 46'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 47'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 48'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 49'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 50'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 51'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 52'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 53'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 54'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 55'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 56'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 57'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 58'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 59'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 60'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 61'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 62'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 63'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 64'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 65'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 66'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 67'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 68'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 69'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 70'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 71'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 72'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 73'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 74'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 75'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 76'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 77'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 78'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 79'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 80'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 81'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 82'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 83'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 84'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 85'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 86'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 87'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 88'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 89'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 90'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 91'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 92'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 93'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 94'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 95'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 96'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 96'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 97'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 98'></div>
              </div>
            </div>
            <div className='battleship-container'>
              <span className='game-header'>Your Guesses</span> 
              <div className='opponent-game'>
                <div onClick={this.handleClick.bind(this)} className='game-cell 00'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 01'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 02'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 03'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 04'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 05'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 06'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 07'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 08'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 09'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 10'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 11'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 12'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 13'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 14'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 15'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 16'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 17'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 18'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 19'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 20'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 21'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 22'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 23'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 24'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 25'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 26'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 27'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 28'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 29'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 30'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 31'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 32'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 33'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 34'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 35'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 36'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 37'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 38'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 39'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 40'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 41'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 42'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 43'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 44'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 45'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 46'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 47'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 48'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 49'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 50'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 51'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 52'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 53'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 54'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 55'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 56'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 57'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 58'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 59'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 60'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 61'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 62'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 63'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 64'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 65'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 66'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 67'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 68'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 69'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 70'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 71'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 72'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 73'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 74'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 75'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 76'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 77'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 78'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 79'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 80'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 81'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 82'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 83'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 84'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 85'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 86'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 87'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 88'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 89'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 90'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 91'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 92'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 93'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 94'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 95'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 96'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 96'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 97'></div>
                <div onClick={this.handleClick.bind(this)} className='game-cell 98'></div>
              </div>
            </div>
          </div>
          <div className='chat-container'>
            <ul className = 'message-container'>
              { this.state.messages.map((message) => {
                return(  
                  <li className='message'>
                    { message.content }
                  </li>
                )
              })}
            </ul>
            {messageForm}
          </div>
        </div>
          
      </div>
    );
  }
}

export default App;
