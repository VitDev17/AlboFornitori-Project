import React from 'react';
import _ from 'lodash';
import 'src/css/auth-lock.css';

import { Page, Panel, Input,Button, Select, Textarea, Switch, Breadcrumbs, EditableSelect,eventBus } from 'react-blur-admin';
import {Form} from 'react-bootstrap';
import { Link,browserHistory,withRouter } from 'react-router';
import axios from 'axios';

//importo libreria per la gestione degli eventi


import {Row, Col} from 'react-flex-proto';

export class Auth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: '',
        isLoaded: false,
        items: '',
        role: '',
        percentage:0,
        Remember: 'checked',
    }
  }

  handleKeyPress(event){
    
    if (event.key == 'Enter') {
      this.authSvDB(event);
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPress.bind(this));
    //tolgo l'event listener per l'enter
    //window.removeEventListener("keydown", this.handleKeyPress);
  }

  componentWillMount() {
  }

  renderBreadcrumbs() {
    return (
      <Breadcrumbs>
        <Link to='/welcome'>
          Home
        </Link>
          Progress Bars
      </Breadcrumbs>
    );
  }

  //richiamo l'endpoint con la funzione fetch()
  authSvDB(e) {
    let self = this;
    e.preventDefault();
    axios.post('/api/login', {
      mail: this.state.username,
      pass: this.state.password
    })
    .then( (response) => {
      //const res = response.clone();
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response;
    }).then(function (result){

      //console.log("risultato" + result);
      if (result.data.length != 0) {                                                 //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
          //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
          localStorage.setItem('userToken', NaN); //resettiamo
          localStorage.setItem('userToken', result.data[0].Mail + result.data[0].ID); //setto il token di accesso per l'utente ottenendolo dalla somma di id e mail
          localStorage.setItem('userMail', result.data[0].Mail); //salvo anche l'email corrente dell'utente in modo che possa utilizzarla nelle varie query
          
          console.log(localStorage.getItem('userToken'));          //controllo che abbia settato il token
          if(result.data[0].Ruolo == 'Banditore'){
            localStorage.setItem('userRole', result.data[0].Ruolo); //setto il token del ruolo dell'utente
            eventBus.addNotification('success', 'Benvenuto Banditore! ' );
          }else{
            if(result.data[0].Ruolo == 'Supervisore'){
              localStorage.setItem('userRole', result.data[0].Ruolo); //setto il token del ruolo dell'utente
              eventBus.addNotification('success', 'Benvenuto Supervisore! ' );
            }else{
              localStorage.setItem('userRole', 'Fornitore'); //setto il token del ruolo dell'utente
              eventBus.addNotification('success', 'Benvenuto Fornitore! ' );
            }
          }
          window.location.reload();
      }else {
        eventBus.addNotification('error', 'Account o password non validi!');
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  //faccio un push della directory per reinderizzare
  redirRegister(){
    localStorage.setItem('userToken', 'NaN');
    localStorage.setItem('userRole', 'NaN');
    browserHistory.push('register');
  }

  redirNewHome(){
    localStorage.setItem('userToken', 'NaN');
    localStorage.setItem('userRole', 'NaN');
    browserHistory.push('/');
  }

  handleUsername(event) {
    this.setState({username: event.target.value});
  }

  handlePassword(event) {
    this.setState({password: event.target.value});
  }

  handleIsItChecked(e) {
    if(e){
      this.setState({Remember: "checked"});
      localStorage.setItem('Ricordami', true);
    }else{
      this.setState({Remember: ""});
      localStorage.setItem('Ricordami', false);
    }
  }

  render() {
    return (
        <Page>
          <div ref="login" className="lock" >
            <form>
            <Row>
              <Col>
                <div className="authPanel">
                <Panel title="Accedi o Registrati!">
                  <Row height="wrap-component">
                    <Input
                      onChange={event => this.handleUsername(event)}
                      hasFeedbackIcon={false}
                      label='Nome Utente o E-mail'
                      value={this.state.username}/>
                  </Row>
                  <Row>
                    <Input
                      type='password'
                      onChange={event => this.handlePassword(event)}
                      label='Password'
                      hasFeedbackIcon={false}
                      value={this.state.password} />
                  </Row>
                  <Row>
                    <Input
                      type='checkbox'
                      onValidate={e => true}
                      label='Ricordami'
                      value={this.state.Remember}
                      onChange={e => { this.handleIsItChecked(e) }}/>
                  </Row>
                  <Row>
                    <Link style={{color: 'white'}} activeStyle={{color: 'red'}} onClick={() => {this.redirRegister()}}>Non sei Registrato?Clicca qui</Link>
                  </Row>
                  <div style={{float:'left'}}>
                    <Link  onClick={() => {this.redirNewHome()}}><Button icon={<i className="fa fa-chevron-circle-left"></i>}  type='default' size='md' title='Indietro'/></Link>
                  </div>
                      <div style={{float:'right'}}>
                      <Button type='success' size='md' title='Login' onClick={e => {this.authSvDB(e)}}/>
                      </div>
                </Panel>
                </div>
              </Col>
            </Row>
          </form>
          </div>
        </Page>
    );
  }
}
