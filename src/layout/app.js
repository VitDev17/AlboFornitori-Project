/* eslint-disable space-before-blocks */
/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
import React from 'react';
import { withRouter, router, StaticRouter, browserHistory } from 'react-router';

// Components
import { Sidebar, PageTop } from 'src/layout/components';
import { Notifications } from 'react-blur-admin';

// Lib
import eventBus from 'src/lib/event-bus';
//import { isRegExp } from 'util';

class AppLayout extends React.Component {

  state = {
    idToken: null, // Token indicating user is logged in
    user: null, // Full user for that logged in user, if exists
    //prendo la pagina corrente per confrontarla con la successiva in cui navigare e capire se devo o meno cancellare i dati dell'utente capendo che si sta tentando di chiudere la pagina
    currentPage: '',
  }

  

  //la navigazione attraverso le pagine va fatta esclusivamente da cui

  // eslint-disable-next-line consistent-return
  componentWillMount() {
    //aggiungo il listener per quando qualcuno andrà a chiudere la finestra in modo da gestire il check "Ricordami" nel login
    // eslint-disable-next-line no-unused-vars
    let flag;
    let PageToRedir;
    if (localStorage.getItem('userToken') == 'NaN'){
      //console.log(localStorage.getItem('userToken'));
      if (this.props.location.pathname != '/'){
        flag = true;
      }
    } else {
      if (this.props.location.pathname == '/auth'){
        switch (localStorage.getItem('userRole')) {
        case 'Fornitore':
            // reindirizzo alla home page
          flag = false;
          PageToRedir = '/profilo-fornitore';
          break;
        case 'Banditore':
            // reindirizzo alla home page
          flag = false;
          PageToRedir = '/banditore-pannel';
          break;
        case 'Supervisore':
            // reindirizzo alla home page
          flag = false;
          PageToRedir = '/admin-pannel';
          break;
        default:
          break;
        }
      }
    }
    //effettuo il reindirizzamento al login o alle altre pagine
    if (flag == true){
      browserHistory.push('/auth');
    } else {
      browserHistory.push(PageToRedir);
    }
    return true;
  }

  /*componentWillUnmount(){
    //window.removeEventListener('beforeunload', this.handlePageClose());
    /*if(localStorage.getItem('userToken')=='NaN' && localStorage.getItem('Ricordami')=='false'){
      localStorage.setItem('userToken','NaN');
      localStorage.setItem('userRole','NaN');
    }
  }

  componentDidMount() {
      //window.addEventListener('beforeunload', this.handlePageClose());
      /*if(localStorage.getItem('userToken') == 'NaN'){
        //console.log(localStorage.getItem('userToken'));
        if(this.props.location.pathname != '/'){
          this.redirectToLogin();
        }
      }else{
        //return this.setUser();
        //vedo se provengo dal login e in caso positivo reindirizzo alle corrispettive pagine after login
        if(this.props.location.pathname == '/auth'){
          if(localStorage.getItem('userRole') == "Fornitore"){
            return browserHistory.push('/profilo-fornitore');                                // reindirizzo alla home page
          }
          if(localStorage.getItem('userRole') == "Banditore"){
            return browserHistory.push('/banditore-pannel');                                // reindirizzo alla home page
          }
          if(localStorage.getItem('userRole') == "Supervisore"){
            return browserHistory.push('/admin-pannel');                                // reindirizzo alla home page
          }
        }
      }
  }*/

  onLogout() {
    localStorage.setItem('userToken', 'NaN');
    localStorage.setItem('userRole', 'NaN');
    localStorage.setItem('userMail', 'NaN');
    this.setState({ idToken: null, user: null });
    this.redirectToLogin();
  }

  handlePageClose(){
    if (localStorage.getItem('Ricordami') && window.location.pathname != '/auth'){
      localStorage.setItem('userToken', 'NaN');
      localStorage.setItem('userRole', 'NaN');
    }
  }

  redirectToLogin() {
    browserHistory.push('/auth');
  }


  setUser() {
    if (! this.state.idToken) {
      return null;
    }

    return this.lock.getProfile(this.state.idToken, (err, user) => {
      return err ? this.onLogout() : this.setState({user});
    });
  }

  getIdToken() {
    let idToken = localStorage.getItem('userToken');
    const authHash = this.lock.parseHash(window.location.hash);
    if (!idToken && authHash) {
      if (authHash.id_token) {
        idToken = authHash.id_token;
        localStorage.setItem('userToken', authHash.id_token);
      }
      if (authHash.error) {
        return this.onLogout();
      }
    }
    return idToken;
  }

  render() {
    // @todo main - menu-collapsed
    return (
      <div>
        <main className=''>
          <Sidebar {...this.props} />
          <PageTop location={this.props.location} user={this.state.user} />

          <div className="al-main">
            <div className="al-content">
              {React.cloneElement(this.props.children, _.assign({}, this.props, { user: this.state.user }))}
            </div>
          </div>
          <back-top></back-top>
        </main>
        <Notifications />
      </div>
    );
  }
}

export default withRouter(AppLayout);
