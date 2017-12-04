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
            <table className='game'>
              <tr>
                <td className='00'></td>
                <td className='01'></td>
                <td className='02'></td>
                <td className='03'></td>
                <td className='04'></td>
                <td className='05'></td>
                <td className='06'></td>
                <td className='07'></td>
                <td className='08'></td>
                <td className='09'></td>
              </tr>
              <tr>
                <td className='10'></td>
                <td className='11'></td>
                <td className='12'></td>
                <td className='13'></td>
                <td className='14'></td>
                <td className='15'></td>
                <td className='16'></td>
                <td className='17'></td>
                <td className='18'></td>
                <td className='19'></td>
              </tr>
              <tr>
                <td className='20'></td>
                <td className='21'></td>
                <td className='22'></td>
                <td className='23'></td>
                <td className='24'></td>
                <td className='25'></td>
                <td className='26'></td>
                <td className='27'></td>
                <td className='28'></td>
                <td className='29'></td>
              </tr>
              <tr>
                <td className='30'></td>
                <td className='31'></td>
                <td className='32'></td>
                <td className='33'></td>
                <td className='34'></td>
                <td className='35'></td>
                <td className='36'></td>
                <td className='37'></td>
                <td className='38'></td>
                <td className='39'></td>
              </tr>
              <tr>
                <td className='40'></td>
                <td className='41'></td>
                <td className='42'></td>
                <td className='43'></td>
                <td className='44'></td>
                <td className='45'></td>
                <td className='46'></td>
                <td className='47'></td>
                <td className='48'></td>
                <td className='49'></td>
              </tr>
              <tr>
                <td className='50'></td>
                <td className='51'></td>
                <td className='52'></td>
                <td className='53'></td>
                <td className='54'></td>
                <td className='55'></td>
                <td className='56'></td>
                <td className='57'></td>
                <td className='58'></td>
                <td className='59'></td>
              </tr>
              <tr>
                <td className='60'></td>
                <td className='61'></td>
                <td className='62'></td>
                <td className='63'></td>
                <td className='64'></td>
                <td className='65'></td>
                <td className='66'></td>
                <td className='67'></td>
                <td className='68'></td>
                <td className='69'></td>
              </tr>
              <tr>
                <td className='70'></td>
                <td className='71'></td>
                <td className='72'></td>
                <td className='73'></td>
                <td className='74'></td>
                <td className='75'></td>
                <td className='76'></td>
                <td className='77'></td>
                <td className='78'></td>
                <td className='79'></td>
              </tr>
              <tr>
                <td className='80'></td>
                <td className='81'></td>
                <td className='82'></td>
                <td className='83'></td>
                <td className='84'></td>
                <td className='85'></td>
                <td className='86'></td>
                <td className='87'></td>
                <td className='88'></td>
                <td className='89'></td>
              </tr>
              <tr>
                <td className='90'></td>
                <td className='91'></td>
                <td className='92'></td>
                <td className='93'></td>
                <td className='94'></td>
                <td className='95'></td>
                <td className='96'></td>
                <td className='96'></td>
                <td className='97'></td>
                <td className='98'></td>
              </tr>
            </table>
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
