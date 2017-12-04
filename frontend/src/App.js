import React, { Component } from 'react';
import elasticlunr from 'elasticlunr';
import { Button, ButtonToolbar, Navbar, Nav, FormControl, Panel } from 'react-bootstrap';
import cheerio from 'cheerio'

import termDump from './classes.json';
import searchIndex from './searchIndex.json';

import request from './request';
import Keys from './Keys';
import Register from './Register';

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
    this.socket = new Socket("wss://" + window.location.hostname + ":4000/socket")
    // this.socket = new Socket("/socket")

    this.socket.connect();

    // Now that you are connected, you can join channels with a topic:
    this.channel = this.socket.channel("updates:lobby", {});
    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) });

    this.channel.on('ping', this.receiveMessage.bind(this));

    this.verifyLogin = this.verifyLogin.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.onRegister = this.onRegister.bind(this);
    this.backToHome = this.backToHome.bind(this);

    this.getMessages();
  }

  receiveMessage(messageData) {
    this.getMessages()
  }

  async getMessages() {

    let posts = await request({
      url: '/posts',
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
      url: '/posts'
    })

    this.channel.push("ping", {
      content: text
    });

    return this.getMessages();
  }

  async verifyLogin() {
    // verify that information was input to the forms
    if(!this.usernameBox.value || !this.passwordBox.value) {
      alert('Please input a Username and Password!')
    }

    let resp = await request({
      method: 'POST',
      form: true,
      body: {
        password: this.passwordBox.value,
        email: this.usernameBox.value
      },
      url: '/session'
    })


    if (resp.includes('Bad email/password')) {
      this.setState({
        isLoggedIn: false,
        email: this.usernameBox.value
      });
      alert('Bad Username/Password!');
    }
    else {
      this.setState({
        isLoggedIn: true,
        email: this.usernameBox.value
      })
    }
  }

  showClass(aClass) {
    console.log(aClass);
    this.setState({
      showingClass: aClass
    })
  }

  onRegister() {
    this.setState({
      showingRegister: true
    })
  }

  getHomePage() {
    return (
      <span>
        Battleship
      </span>
        
        )
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

  getLogInOForm() {
    return (

          <form className='login-form'>
            <FormControl
              className='login-input'
              type='text'
              placeholder='Username'
              inputRef={ (usernameBox) => { this.usernameBox = usernameBox; } }
            />
            <FormControl
              className='login-input'
              type='password'
              placeholder='Password'
              inputRef={ (passwordBox) => { this.passwordBox = passwordBox; } }
            />
            <ButtonToolbar>
              <Button
                bsStyle="primary"
                className="register-submit"
                onClick={ this.onRegister }> 
                Register
              </Button> 
            </ButtonToolbar>
            <ButtonToolbar>
              <Button 
                bsStyle="primary" 
                className='login-submit'
                onClick={this.verifyLogin}>
                  Login!
              </Button>
            </ButtonToolbar>
          </form>

      )
  }

  backToHome() {
    this.setState({
      showingRegister: false
    });
  }

  render() {

    if (this.state.showingRegister) {
      return <Register back={this.backToHome}/>
    }

    let navBarRightSide = null;
    let messageForm = null;

    if (!this.state.isLoggedIn) {
      navBarRightSide = this.getLogInOForm();
      messageForm = <span class='blah'>Log In to Chat</span>
    }
    else {
      navBarRightSide = <a href="#" className="navbar-brand" style={{float: "right"}}>Logged in as {this.state.email}</a>
      messageForm = this.getMessageForm();
    }

    return (
      <div className='App'>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href='#'>Battleship!</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
            {navBarRightSide}
          <Navbar.Collapse>
            <Nav />
            <Nav pullRight />
          </Navbar.Collapse>
        </Navbar>

        <div className='container'>
          <div className='battleship-container'>
            <div className='game'>
              <div className='game-cell 00'></div>
              <div className='game-cell 01'></div>
              <div className='game-cell 02'></div>
              <div className='game-cell 03'></div>
              <div className='game-cell 04'></div>
              <div className='game-cell 05'></div>
              <div className='game-cell 06'></div>
              <div className='game-cell 07'></div>
              <div className='game-cell 08'></div>
              <div className='game-cell 09'></div>
              <div className='game-cell 10'></div>
              <div className='game-cell 11'></div>
              <div className='game-cell 12'></div>
              <div className='game-cell 13'></div>
              <div className='game-cell 14'></div>
              <div className='game-cell 15'></div>
              <div className='game-cell 16'></div>
              <div className='game-cell 17'></div>
              <div className='game-cell 18'></div>
              <div className='game-cell 19'></div>
              <div className='game-cell 20'></div>
              <div className='game-cell 21'></div>
              <div className='game-cell 22'></div>
              <div className='game-cell 23'></div>
              <div className='game-cell 24'></div>
              <div className='game-cell 25'></div>
              <div className='game-cell 26'></div>
              <div className='game-cell 27'></div>
              <div className='game-cell 28'></div>
              <div className='game-cell 29'></div>
              <div className='game-cell 30'></div>
              <div className='game-cell 31'></div>
              <div className='game-cell 32'></div>
              <div className='game-cell 33'></div>
              <div className='game-cell 34'></div>
              <div className='game-cell 35'></div>
              <div className='game-cell 36'></div>
              <div className='game-cell 37'></div>
              <div className='game-cell 38'></div>
              <div className='game-cell 39'></div>
              <div className='game-cell 40'></div>
              <div className='game-cell 41'></div>
              <div className='game-cell 42'></div>
              <div className='game-cell 43'></div>
              <div className='game-cell 44'></div>
              <div className='game-cell 45'></div>
              <div className='game-cell 46'></div>
              <div className='game-cell 47'></div>
              <div className='game-cell 48'></div>
              <div className='game-cell 49'></div>
              <div className='game-cell 50'></div>
              <div className='game-cell 51'></div>
              <div className='game-cell 52'></div>
              <div className='game-cell 53'></div>
              <div className='game-cell 54'></div>
              <div className='game-cell 55'></div>
              <div className='game-cell 56'></div>
              <div className='game-cell 57'></div>
              <div className='game-cell 58'></div>
              <div className='game-cell 59'></div>
              <div className='game-cell 60'></div>
              <div className='game-cell 61'></div>
              <div className='game-cell 62'></div>
              <div className='game-cell 63'></div>
              <div className='game-cell 64'></div>
              <div className='game-cell 65'></div>
              <div className='game-cell 66'></div>
              <div className='game-cell 67'></div>
              <div className='game-cell 68'></div>
              <div className='game-cell 69'></div>
              <div className='game-cell 70'></div>
              <div className='game-cell 71'></div>
              <div className='game-cell 72'></div>
              <div className='game-cell 73'></div>
              <div className='game-cell 74'></div>
              <div className='game-cell 75'></div>
              <div className='game-cell 76'></div>
              <div className='game-cell 77'></div>
              <div className='game-cell 78'></div>
              <div className='game-cell 79'></div>
              <div className='game-cell 80'></div>
              <div className='game-cell 81'></div>
              <div className='game-cell 82'></div>
              <div className='game-cell 83'></div>
              <div className='game-cell 84'></div>
              <div className='game-cell 85'></div>
              <div className='game-cell 86'></div>
              <div className='game-cell 87'></div>
              <div className='game-cell 88'></div>
              <div className='game-cell 89'></div>
              <div className='game-cell 90'></div>
              <div className='game-cell 91'></div>
              <div className='game-cell 92'></div>
              <div className='game-cell 93'></div>
              <div className='game-cell 94'></div>
              <div className='game-cell 95'></div>
              <div className='game-cell 96'></div>
              <div className='game-cell 96'></div>
              <div className='game-cell 97'></div>
              <div className='game-cell 98'></div>
            </div>
          </div>
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
    );
  }
}

export default App;
