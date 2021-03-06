import React from 'react';

import { Row, Col } from 'react-flex-proto';
import { Page, Panel,eventBus, Button, Breadcrumbs, Input, Select, Switch, Tabs, Tab, Table, TableHead,TableBody, TableRow } from 'react-blur-admin';
import { Link } from 'react-router';
import _ from 'lodash';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

const options = {
  onRowClick: function(row) {
    browserHistory.push('/fornitore-dettaglio-bando');
    eventBus.addNotification('primary',`Hai selezionato il Bando con ID: ${row.ID}`);
  },
  onRowDoubleClick: function(row) {
    alert(`You double click row id: ${row.ID}`);
  }
};

function dateFormatter(cell, row) {
  if (typeof cell !== 'object') {
   cell = new Date(cell);
 }
  return `${('0' + cell.getDate()).slice(-2)}/${('0' + (cell.getMonth() + 1)).slice(-2)}/${cell.getFullYear()}`;
}

function priceFormatter(cell, row) {
  return `${cell} &euro;`;
}

function ratingFormatter(cell, row) {
  if(cell == 0){
    return 'LIBERO';
  }
  else{
    if(cell<=19 && cell>=1){
      return (<img src={star}/>);
    }
    else{
      if(cell<=39 && cell>=20){
        return <div><img src={star}/><img src={star}/></div>;
      }
      else{
        if(cell<=59 && cell>=40){
          return <div><img src={star}/><img src={star}/><img src={star}/></div>;
        }
        else{
          if(cell<=79 && cell>=60){
            return <div><img src={star}/><img src={star}/><img src={star}/><img src={star}/></div>;
          }
          else{
            if(cell<=100 && cell>=80){
              return <div><img src={star}/><img src={star}/><img src={star}/><img src={star}/><img src={star}/></div>;
            }
      }
    }
  }
}
}
}
export class ProfiloAzienda extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        data: [],
        dataBando: [],
        warningModal: false,

        switches: _.fill(Array(5), true),
        editableSelect3: 1,
        checkboxChecked: false,
        //password utilizzata per il check
        password2: '',

          //Dati per update profilo fornitore
          Nome: '', //text
          Cognome: '',
          AccessoMail:'',
          Passwd: '',
          Ruolo: '',
          Telefono: '',
          NomeForn: '',
          Categoria : 1,
          Categoria1 : 1,
          Categoria2 : 1,
          Categoria3 : 1,
          Categoria4 : 1,
          Categoria5 : 1,
          SottoCategoria : '',
          IVAForn : '',
          FGiurid : '',
          ATECO: '', //alfanumerico
          ProvinciaCCIAA: '',
          NumeroREA: '',
          SitoWeb: '',
          PEC: '',
          SLStato:'',
          SLRegione:'',
          SLProvincia:'',
          SLIndirizzo:'',
          SLCAP:'',
          SLFAX:'',
          SAmmStato:'',
          SAmmRegione:'',
          SAmmProvincia:'',
          SAmmCAP:'',
          SAmmFAX:'',
          SAmmProvincia:'',
          SAmmIndirizzo:'',

          data : {
            Nome: '', //text
            Cognome: '',
            AccessoMail:'',
            Passwd: '',
            Ruolo: '',
            Telefono: '',
            NomeForn: '',
            Categoria : 1,
            Categoria1 : 1,
            Categoria2 : 1,
            Categoria3 : 1,
            Categoria4 : 1,
            Categoria5 : 1,
            SottoCategoria : '',
            IVAForn : '',
            FGiurid : '',
            ATECO: '', //alfanumerico
            ProvinciaCCIAA: '',
            NumeroREA: '',
            SitoWeb: '',
            PEC: '',
            SLStato:'',
            SLRegione:'',
            SLProvincia:'',
            SLIndirizzo:'',
            SLCAP:'',
            SLFAX:'',
            SAmmStato:'',
            SAmmRegione:'',
            SAmmProvincia:'',
            SAmmCAP:'',
            SAmmFAX:'',
            SAmmProvincia:'',
            SAmmIndirizzo:'',
          },

    }
  }

  componentWillMount(){
    if(localStorage.getItem('userToken') == 'NaN'){
       eventBus.emit('toLogin'); //Se non e' stato effettutato il login reindirizzo alla pagina di login
    }else{
      const MailUser = localStorage.getItem('userMail');
      this.getDataForn(MailUser);       //prendo i dati del fornitore per fare il display sul profilo
      this.getPartecipForn(MailUser);
    }

  }
  onCloseModal(modalName) {
    this.setState({ [modalName]: false });
  }

  onRenderModal(modalName) {
    this.setState({ [modalName]: true });
  }

  handleIsItChecked(){
  this.setState({[checkboxChecked]: true});
  }

  handleLingua(e){
    this.setState({language: e});
  }

  onTextChange(key) {

    this.setState(prevState => ({
      data: {
          ...prevState.data,
          [key] : event.target.value,
      }
    })
    )
  }

  //Validazione dei campi di inserimento per la registrazione
  FieldValidation(key, value) {
    switch(key) {
      case 'firstName':
        if(value.length > 15){
          return 'error';
        }
        break;
      case 'lastName':
        if(value.length > 15){
          return 'error';
        }
        break;
      case 'email':
       if(!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)){
         return 'error';
       }
       break;
       case 'pec':
        if(!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)){
          return 'error';
        }
        break;
       case 'role':
         if(value.length > 15){
          return 'error';
        }
      case 'password':
        if(value.length > 15){
         return 'error';
       }
        break;
      case 'password2':
        if(!value.match('passowrd')){
          return 'error';
        }
        break;
      case 'phoneNumber':
        if(value.length > 10){
          return 'error';
        }
        break;
        case 'telAz':
          if(value.length > 10){
            return 'error';
          }
          break;
      case 'nomeAzienda':
        if(value.length > 50){
          return 'error';
        }
        break;
      case 'subCategoria':
        if(value.length > 30){
          return 'error';
        }
        break;
      case 'piva':
        if(value.length > 11){
          return 'error';
        }
        break;
      case 'ateco':
        if(value.length > 8){
          return 'error';
        }
        break;
      case 'provCCIAA':
        if(value.length > 2){
          return 'error';
        }
        break;
      case 'numREA':
        if(value.length > 6){
          return 'error';
        }
        break;
      case 'sedeLegInd':
        if(value.length > 30){
          return 'error';
        }
        break;
      case 'sedeLegNum':
      if(value.length > 3){
        return 'error';
      }
      break;
      case 'capLeg':
      if(value.length > 5){
        return 'error';
      }
      break;
      case 'sedeLegFax':
      if(value.length > 10){
        return 'error';
      }
      break;
      case 'sedeAmmInd':
        if(value.length > 30){
          return 'error';
        }
        break;
      case 'sedeAmmNum':
      if(value.length > 3){
        return 'error';
      }
      break;
      case 'capAmm':
      if(value.length > 5){
        return 'error';
      }
      break;
      case 'sedeAmmFax':
      if(value.length > 10){
        return 'error';
      }
      break;
    }
  }

  onSelectChange(key, value) {
    (prevState => ({
      data: {
          ...prevState.data,
          [key]: value
      }
    })
    );
  }

  onSwitchChange(index) {
    let switches = this.state.switches;
    switches[index] = !switches[index];
    this.setState({ switches });
  }

  //richiamo l'endpoint con la funzione fetch()
  updateProfilo(Mail) {
    var data = {
      Nome: this.state.Nome, //text
      Cognome: this.state.Cognome,
      AccessoMail:this.state.AccessoMail,
      Passwd: this.state.Passwd,
      Ruolo: this.state.Ruolo,
      Telefono: this.state.Telefono,
      NomeForn: this.state.NomeForn,
      Categoria1: this.state.Categoria,
      Categoria2: this.state.Categoria,
      Categoria3: this.state.Categoria,
      Categoria4: this.state.Categoria,
      Categoria5: this.state.Categoria,
      SottoCategoria : this.state.Categoria,
      IVAForn : this.state.IVAForn,
      FGiurid : this.state.FGiurid,
      ATECO: this.state.ATECO, //alfanumerico
      ProvinciaCCIAA: this.state.ProvinciaCCIAA,
      NumeroREA: this.state.NumeroREA,
      SitoWeb: this.state.SitoWeb,
      PEC: this.state.PEC,
      SLStato:this.state.SLStato,
      SLRegione:this.state.SLRegione,
      SLProvincia:this.state.SLProvincia,
      SLIndirizzo:this.state.SLIndirizzo,
      SLCAP:this.state.SLCAP,
      SLFAX:this.state.SLFAX,
      SAmmStato:this.state.SAmmStato,
      SAmmRegione:this.state.SAmmRegione,
      SAmmProvincia:this.state.SAmmProvincia,
      SAmmIndirizzo:this.state.SAmmIndirizzo,
      SAmmCAP:this.state.SAmmCAP,
      SAmmFAX:this.state.SAmmFAX,
      IdForn: this.state.data.IdForn,
    };
    let self = this;
    axios.post('/api/updateForn', {
      datiFornNew: data,
      Mail: Mail,
    }).then( (response) => {
      //const res = response.clone();
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response;
    }).then(function (result){
      if (result.data.length != 0) {                                                 //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
          //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
          console.log('i dati letti sono: '+result.data);          //controllo che abbia settato il token
          //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
          self.setState({
            data: result.data
          });
          localStorage.setItem('userMail',data.AccessoMail); //setto la mail appena modificata nei cookie
          eventBus.addNotification('success',"Profilo aggiornato con successo!");
      }else {
        eventBus.addNotification('warning',"A quanto pare sembra che tu non sia iscritto a nessuna Gara!");
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  //richiamo l'endpoint con la funzione fetch()
  partecipaBando(Mail) {
    let self = this;
    axios.post('/api/partecipBando', {
      Mail: Mail,
    }).then( (response) => {
      //const res = response.clone();
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response;
    }).then(function (result){
      if (result.data.length != 0) {                                                 //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
          //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
          console.log('i dati letti sono: '+result.data);          //controllo che abbia settato il token
          eventBus.addNotification('success',"Partecipazione registrata con successo!");
          //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
          self.setState({
            data: result.data
          });
      }else {
        eventBus.addNotification('warning',"A quanto pare sembra che tu non sia iscritto a nessuna Gara!");
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  //richiamo l'endpoint con la funzione fetch()
  insertDocumento(Mail) {
    let self = this;
    axios.post('/api/insertDocuForn', {
      Mail: Mail,
    }).then( (response) => {
      //const res = response.clone();
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response;
    }).then(function (result){
      if (result.data.length != 0) {                                                 //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
          //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
          console.log('i dati letti sono: '+result.data);          //controllo che abbia settato il token
          eventBus.addNotification('success',"Partecipazione registrata con successo!");
          //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
          self.setState({
            data: result.data
          });
      }else {
        eventBus.addNotification('warning',"A quanto pare sembra che tu non sia iscritto a nessuna Gara!");
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  //richiamo l'endpoint con la funzione fetch()
  getDataForn(Mail) {
    let self = this;
    axios.post('/api/getForn', {
      Mail: Mail,
    }).then( (response) => {
      //const res = response.clone();
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response;
    }).then(function (result){
      if (result.data.length != 0) {                                                 //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
          //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
          console.log('i dati letti sono: '+result.data);          //controllo che abbia settato il token
          //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
          self.setState({
            data: result.data
          });
      }else {
        eventBus.addNotification('error',"Stiamo riscontrando problemi nella ricezione dei dati del proprio utente, contattare l'assistenza!");
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  //richiamo l'endpoint con la funzione fetch()
  getPartecipForn(Mail) {
    let self = this;
    axios.post('/api/getPartecip', {
      Mail: Mail,
    }).then( (response) => {
      //const res = response.clone();
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response;
    }).then(function (result){
      if (result.data.length != 0) {                                                 //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
          //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
          console.log('i dati letti sono: '+result.data);          //controllo che abbia settato il token
          //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
          self.setState({
            dataBando: result.data
          });
      }else {
        eventBus.addNotification('warning',"A quanto pare sembra che tu non sia iscritto a nessuna Gara!");
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  render() {
    let data = [];
    let Bandi = [];

    if(this.state.data.length != 0 && this.state.data.AccessoMail != ""){
       data = this.state.data[0]; //provvedo ad evitare che la pagina vada in errore perche' al primo render lo state non e' settato
    }
    if(this.state.dataBando.length != 0){
      Bandi = this.state.dataBando; //provvedo ad evitare che la pagina vada in errore perche' al primo render lo state non e' settato
   }

    return (
    //  {this.renderCustomizedModals()}
    <Page title="Profilo Privato Aziendale - Sviluppo">

      <Modal
        show={this.state.warningModal}
        onHide={() => this.onCloseModal('warningModal')}
      >
      <Modal.Header closeButton className="modal-header bg-warning">
          <Modal.Title style={{color:'#ffffff'}}>Modifica del Profilo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {/* <Modal type='warning' title='Modifica della Gara' isOpen={this.state.warningModal} onClose={e => this.onCloseModal('warningModal')}> */}
        <form>
          <Row>
            <Col>
              <div className="RegPanel">

                  <Input
                    type='text'
                    label='Nome utente (Il quale gestirà le informazioni e la partecipazione alle gare)'
                    placeholder='Nome utente'
                    onChange={e => this.onTextChange('firstName', e)}
                    onValidate={e => this.FieldValidation('Nome', e)}
                    value={data.Nome} />

                  <Input
                    type='text'
                    label='Cognome'
                    placeholder='Cognome'
                    onChange={e => this.onTextChange('lastName', e)}
                    onValidate={e => this.FieldValidation('Cognome', e)}
                    value={data.Cognome} />
                  <Input
                    type='email'
                    label='email'
                    placeholder='...'
                    onChange={e => this.onTextChange('email', e)}
                    onValidate={e => this.FieldValidation('AccessoMail', e)}
                    value={data.AccessoMail} />
                    <Row>
                      <Input
                        type='password'
                        onChange={event => this.handlePassword(event)}
                        label='Password'
                        hasFeedbackIcon={false}
                        value={data.Passwd} />
                      <span>&nbsp;&nbsp;</span>
                      <Input
                        type='password'
                        onChange={event => this.handlePassword(event)}
                        label='Ripeti la password'
                        onValidate={e => this.FieldValidation('Passwd', e)}
                        hasFeedbackIcon={false}
                        value={data.password2} />
                    </Row>

                  <Input
                    type='text'
                    label="Ruolo (Che ricopre all'interno dell'azienda)"
                    placeholder='es. Amministratore, Delegato, Consulente..'
                    onChange={e => this.onTextChange('role', e)}
                    onValidate={e => this.FieldValidation('Ruolo', e)}
                    value={data.Ruolo} />
                  <Row>
                    <Col>
                      <Input
                        type='checkbox'
                        onValidate={e => true}
                        label='Italiano'
                        onChange={e => { this.handleLingua(e) }} />
                    </Col>
                    <Col>
                      <Input
                        type='checkbox'
                        onValidate={e => true}
                        label='Inglese'
                        onChange={e => { this.handleLingua(e) }} />
                    </Col>
                    <Col>
                      <Input
                        type='checkbox'
                        onValidate={e => true}
                        label='Tedesco'
                        onChange={e => { this.handleLingua(e) }} />
                    </Col>
                    <Col>
                      <Input
                        type='checkbox'
                        onValidate={e => true}
                        label='Francese'
                        onChange={e => { this.handleLingua(e) }} />
                    </Col>
                    <Col>
                      <Input
                        type='checkbox'
                        onValidate={e => true}
                        label='Spagnolo'
                        onChange={e => { this.handleLingua(e) }} />
                    </Col>
                  </Row>
                  <Input
                    type='text'
                    label='Numero di Telefono'
                    placeholder='0234124554'
                    onChange={e => this.onTextChange('phoneNumber', e)}
                    onValidate={e => this.FieldValidation('Telefono', e)}
                    value={data.Telefono} />
                    <Input
                    type='text'
                    label='Nome utente (Il quale gestirà le informazioni e la partecipazione alle gare)'
                    placeholder='Nome utente'
                    onChange={e => this.onTextChange('firstName', e)}
                    onValidate={e => this.FieldValidation('NomeForn', e)}
                    value={data.Nome} />
                    <Select
                        label="Categoria1"
                        placeholder='Categoria Generica del Fornitore'
                        isSearchable={true}
                        options={[
                          { value: 1, label: 'Canone di noleggio apparecchi bagni' },
                          { value: 2, label: 'Disinfestazione e derattizzazione' },
                          { value: 3, label: 'Fornitura di Beni' },
                          { value: 4, label: 'Impianti Antincendio' },
                          { value: 5, label: 'Impianti Elettrici e Speciali' },
                          { value: 6, label: 'Impianti Idrici e Fognari' },
                          { value: 7, label: 'Impianti Meccanici' },
                          { value: 8, label: 'Impianti di Sicurezza' },
                          { value: 9, label: 'Insegne' },
                          { value: 10, label: 'Lavori Edili' },
                          { value: 11, label: 'Manutenzione verde' },
                          { value: 12, label: 'Marketing' },
                          { value: 13, label: 'Materiale di consumo bagni' },
                          { value: 14, label: 'Materiale di consumo pulizie' },
                          { value: 15, label: 'Noleggio Compattatori' },
                          { value: 16, label: 'Porte Automatiche' },
                          { value: 17, label: 'Recupero e smaltimento rifiuti' },
                          { value: 18, label: 'Scale mobili e Ascensori' },
                          { value: 19, label: 'Segnaletica' },
                          { value: 20, label: 'Servizi (generico)' },
                          { value: 21, label: 'Servizi Autospurgo' },
                          { value: 22, label: 'Servizi di Pulizie' },
                          { value: 23, label: 'Servizi di Vigilanza e Portierato' },
                          { value: 24, label: 'Alimentari' },
                        ]}
                        ref={(input) => this.selectVal = input}
                        onChange={(e) => this.handleChangeSelect('Categoria1', e)} />
                        <Select
                        label="Categoria2"
                        placeholder='Categoria Generica del Fornitore'
                        isSearchable={true}
                        options={[
                          { value: 1, label: 'Canone di noleggio apparecchi bagni' },
                          { value: 2, label: 'Disinfestazione e derattizzazione' },
                          { value: 3, label: 'Fornitura di Beni' },
                          { value: 4, label: 'Impianti Antincendio' },
                          { value: 5, label: 'Impianti Elettrici e Speciali' },
                          { value: 6, label: 'Impianti Idrici e Fognari' },
                          { value: 7, label: 'Impianti Meccanici' },
                          { value: 8, label: 'Impianti di Sicurezza' },
                          { value: 9, label: 'Insegne' },
                          { value: 10, label: 'Lavori Edili' },
                          { value: 11, label: 'Manutenzione verde' },
                          { value: 12, label: 'Marketing' },
                          { value: 13, label: 'Materiale di consumo bagni' },
                          { value: 14, label: 'Materiale di consumo pulizie' },
                          { value: 15, label: 'Noleggio Compattatori' },
                          { value: 16, label: 'Porte Automatiche' },
                          { value: 17, label: 'Recupero e smaltimento rifiuti' },
                          { value: 18, label: 'Scale mobili e Ascensori' },
                          { value: 19, label: 'Segnaletica' },
                          { value: 20, label: 'Servizi (generico)' },
                          { value: 21, label: 'Servizi Autospurgo' },
                          { value: 22, label: 'Servizi di Pulizie' },
                          { value: 23, label: 'Servizi di Vigilanza e Portierato' },
                          { value: 24, label: 'Alimentari' },
                        ]}
                        ref={(input) => this.selectVal = input}
                        onChange={(e) => this.handleChangeSelect('Categoria2', e)} />
                        <Select
                        label="Categoria3"
                        placeholder='Categoria Generica del Fornitore'
                        isSearchable={true}
                        options={[
                          { value: 1, label: 'Canone di noleggio apparecchi bagni' },
                          { value: 2, label: 'Disinfestazione e derattizzazione' },
                          { value: 3, label: 'Fornitura di Beni' },
                          { value: 4, label: 'Impianti Antincendio' },
                          { value: 5, label: 'Impianti Elettrici e Speciali' },
                          { value: 6, label: 'Impianti Idrici e Fognari' },
                          { value: 7, label: 'Impianti Meccanici' },
                          { value: 8, label: 'Impianti di Sicurezza' },
                          { value: 9, label: 'Insegne' },
                          { value: 10, label: 'Lavori Edili' },
                          { value: 11, label: 'Manutenzione verde' },
                          { value: 12, label: 'Marketing' },
                          { value: 13, label: 'Materiale di consumo bagni' },
                          { value: 14, label: 'Materiale di consumo pulizie' },
                          { value: 15, label: 'Noleggio Compattatori' },
                          { value: 16, label: 'Porte Automatiche' },
                          { value: 17, label: 'Recupero e smaltimento rifiuti' },
                          { value: 18, label: 'Scale mobili e Ascensori' },
                          { value: 19, label: 'Segnaletica' },
                          { value: 20, label: 'Servizi (generico)' },
                          { value: 21, label: 'Servizi Autospurgo' },
                          { value: 22, label: 'Servizi di Pulizie' },
                          { value: 23, label: 'Servizi di Vigilanza e Portierato' },
                          { value: 24, label: 'Alimentari' },
                        ]}
                        ref={(input) => this.selectVal = input}
                        onChange={(e) => this.handleChangeSelect('Categoria3', e)} />
                        <Select
                        label="Categoria4"
                        placeholder='Categoria Generica del Fornitore'
                        isSearchable={true}
                        options={[
                          { value: 1, label: 'Canone di noleggio apparecchi bagni' },
                          { value: 2, label: 'Disinfestazione e derattizzazione' },
                          { value: 3, label: 'Fornitura di Beni' },
                          { value: 4, label: 'Impianti Antincendio' },
                          { value: 5, label: 'Impianti Elettrici e Speciali' },
                          { value: 6, label: 'Impianti Idrici e Fognari' },
                          { value: 7, label: 'Impianti Meccanici' },
                          { value: 8, label: 'Impianti di Sicurezza' },
                          { value: 9, label: 'Insegne' },
                          { value: 10, label: 'Lavori Edili' },
                          { value: 11, label: 'Manutenzione verde' },
                          { value: 12, label: 'Marketing' },
                          { value: 13, label: 'Materiale di consumo bagni' },
                          { value: 14, label: 'Materiale di consumo pulizie' },
                          { value: 15, label: 'Noleggio Compattatori' },
                          { value: 16, label: 'Porte Automatiche' },
                          { value: 17, label: 'Recupero e smaltimento rifiuti' },
                          { value: 18, label: 'Scale mobili e Ascensori' },
                          { value: 19, label: 'Segnaletica' },
                          { value: 20, label: 'Servizi (generico)' },
                          { value: 21, label: 'Servizi Autospurgo' },
                          { value: 22, label: 'Servizi di Pulizie' },
                          { value: 23, label: 'Servizi di Vigilanza e Portierato' },
                          { value: 24, label: 'Alimentari' },
                        ]}
                        ref={(input) => this.selectVal = input}
                        onChange={(e) => this.handleChangeSelect('Categoria4', e)} />
                        <Select
                        label="Categoria5"
                        placeholder='Categoria Generica del Fornitore'
                        isSearchable={true}
                        options={[
                          { value: 1, label: 'Canone di noleggio apparecchi bagni' },
                          { value: 2, label: 'Disinfestazione e derattizzazione' },
                          { value: 3, label: 'Fornitura di Beni' },
                          { value: 4, label: 'Impianti Antincendio' },
                          { value: 5, label: 'Impianti Elettrici e Speciali' },
                          { value: 6, label: 'Impianti Idrici e Fognari' },
                          { value: 7, label: 'Impianti Meccanici' },
                          { value: 8, label: 'Impianti di Sicurezza' },
                          { value: 9, label: 'Insegne' },
                          { value: 10, label: 'Lavori Edili' },
                          { value: 11, label: 'Manutenzione verde' },
                          { value: 12, label: 'Marketing' },
                          { value: 13, label: 'Materiale di consumo bagni' },
                          { value: 14, label: 'Materiale di consumo pulizie' },
                          { value: 15, label: 'Noleggio Compattatori' },
                          { value: 16, label: 'Porte Automatiche' },
                          { value: 17, label: 'Recupero e smaltimento rifiuti' },
                          { value: 18, label: 'Scale mobili e Ascensori' },
                          { value: 19, label: 'Segnaletica' },
                          { value: 20, label: 'Servizi (generico)' },
                          { value: 21, label: 'Servizi Autospurgo' },
                          { value: 22, label: 'Servizi di Pulizie' },
                          { value: 23, label: 'Servizi di Vigilanza e Portierato' },
                          { value: 24, label: 'Alimentari' },
                        ]}
                        ref={(input) => this.selectVal = input}
                        onChange={(e) => this.handleChangeSelect('Categoria5', e)} />

                    <Input
                    type='text'
                    label='Sotto Categoria'
                    placeholder='Sotto Categoria'
                    onChange={e => this.onTextChange('SottoCategoria', e)}
                    onValidate={e => this.FieldValidation('SottoCategoria', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Partita Iva'
                    placeholder='P. IVA'
                    onChange={e => this.onTextChange('IVAForn', e)}
                    onValidate={e => this.FieldValidation('IVAForn', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Forma Giuridica'
                    placeholder='FGiurid'
                    onChange={e => this.onTextChange('FGiurid', e)}
                    onValidate={e => this.FieldValidation('FGiurid', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Codice ATECO (xx.xx.xx)'
                    placeholder='ATECO'
                    onChange={e => this.onTextChange('ATECO', e)}
                    onValidate={e => this.FieldValidation('ATECO', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Provincia CCIAA'
                    placeholder='ProvinciaCCIAA'
                    onChange={e => this.onTextChange('ProvinciaCCIAA', e)}
                    onValidate={e => this.FieldValidation('ProvinciaCCIAA', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Numero REA'
                    placeholder='NumeroREA'
                    onChange={e => this.onTextChange('NumeroREA', e)}
                    onValidate={e => this.FieldValidation('NumeroREA', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Sito Web'
                    placeholder='copia qui il link...'
                    onChange={e => this.onTextChange('SitoWeb', e)}
                    onValidate={e => this.FieldValidation('SitoWeb', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='PEC'
                    placeholder='PEC'
                    onChange={e => this.onTextChange('PEC', e)}
                    onValidate={e => this.FieldValidation('PEC', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Sede legale - Stato'
                    placeholder='SLStato'
                    onChange={e => this.onTextChange('SLStato', e)}
                    onValidate={e => this.FieldValidation('SLStato', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Sede Legale - Regione'
                    placeholder='SLRegione'
                    onChange={e => this.onTextChange('SLRegione', e)}
                    onValidate={e => this.FieldValidation('SLRegione', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Sede Legale - Provincia'
                    placeholder='SLProvincia'
                    onChange={e => this.onTextChange('SLProvincia', e)}
                    onValidate={e => this.FieldValidation('SLProvincia', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Sede Legale - Indirizzo'
                    placeholder='SLIndirizzo'
                    onChange={e => this.onTextChange('SLIndirizzo', e)}
                    onValidate={e => this.FieldValidation('SLIndirizzo', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Sede Legale - CAP'
                    placeholder='SLCAP'
                    onChange={e => this.onTextChange('SLCAP', e)}
                    onValidate={e => this.FieldValidation('SLCAP', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Sede Legale - FAX'
                    placeholder='SLFAX'
                    onChange={e => this.onTextChange('SLFAX', e)}
                    onValidate={e => this.FieldValidation('SLFAX', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Sede Amministrativa - Stato'
                    placeholder='SAmmStato'
                    onChange={e => this.onTextChange('SAmmStato', e)}
                    onValidate={e => this.FieldValidation('SAmmStato', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Sede Amministrativa - Regione'
                    placeholder='SAmmRegione'
                    onChange={e => this.onTextChange('SAmmRegione', e)}
                    onValidate={e => this.FieldValidation('SAmmRegione', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Sede Amministrativa - Provincia'
                    placeholder='SAmmProvincia'
                    onChange={e => this.onTextChange('SAmmProvincia', e)}
                    onValidate={e => this.FieldValidation('SAmmProvincia', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Sede Amministrativa - Indirizzo'
                    placeholder='SAmmIndirizzo'
                    onChange={e => this.onTextChange('SAmmIndirizzo', e)}
                    onValidate={e => this.FieldValidation('SAmmIndirizzo', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Sede Amministrativa - CAP'
                    placeholder='SAmmCAP'
                    onChange={e => this.onTextChange('SAmmCAP', e)}
                    onValidate={e => this.FieldValidation('SAmmCAP', e)}
                    value={data.Nome} />
                    <Input
                    type='text'
                    label='Sede Amministrativa - FAX'
                    placeholder='SAmmFAX'
                    onChange={e => this.onTextChange('SAmmFAX', e)}
                    onValidate={e => this.FieldValidation('SAmmFAX', e)}
                    value={data.Nome} />
                </div>
            </Col>
          </Row>
        </form>
      {/* </Modal> */}
      </Modal.Body>
      <Modal.Footer>
          <Button type='warning' title='Salva Modifiche' onClick={e => {this.updateProfilo(e)}}/>
        </Modal.Footer>
        </Modal>
      <Tabs
        align='top'
        startTab={1} >
      <Tab title = "PROFILO PRIVATO AZIENDALE">
        <div style={{float:'right'}}>
              <Button type='add' title="Valuta" disabled = {this.state.ValutaButton} onClick={e => this.onRenderModal('primaryModal',true)} />
        </div>
        <Panel title = "Dati Generali Utente">
          <ul>
            <h5><li>Nome Referente: {data.Nome} </li></h5>

            <h5><li>Cognome Referente: {data.Cognome}</li></h5>
            <h5><li>Ruolo Referente: {data.Ruolo}</li></h5>
            <h5><li>Email(aziendale): {data.Mail}</li></h5>
            <h5><li>Numero di Telefono(aziendale): {data.Telefono}</li></h5>
          </ul>
        </Panel>

      <Row>
        <div>
          <Panel title = "Dati Generici Azienda">
            <ul>
              <h5><li>Nome dell'Azienda: {data.NomeForn}</li></h5>
              <h5><li>Categoria dell'Azienda: {data.NomeCat}</li></h5>
              <h5><li>P.Iva: {data.IVAForn}</li></h5>
              <h5><li>Forma Giuridica: {data.FGiurid}</li></h5>
              <h5><li>PEC: {data.PEC}</li></h5>
              <h5><li>Sito Web: {data.SitoWeb}</li></h5>
            </ul>
          </Panel>
        </div>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <div>
          <Panel title = "Dati Anagrafica Tributaria e CCIAA Azienda">
            <ul>
              <h5><li>ATECO: {data.ATECO}</li></h5>
              <h5><li>Comune CCIAA (ProvinciaCCIIAA ?): {data.ProvinciaCCIAA}</li></h5>
              <h5><li>NUmero CCIAA(Numero REA ?): {data.NumeroREA}</li></h5>
            </ul>
          </Panel>
        </div>
      </Row>
      <Row>
        <Col>
          <div style={{float:'right'}}>
                <Button type='warning' title="Modifica Profilo" onClick={e => this.onRenderModal('warningModal',true)} />
          </div>
        </Col>
      </Row>
      </Tab>
      <Tab title = "PARTECIPAZIONE BANDI">
        <Panel title = "Lista bandi con aderenza">
          <div>
            <BootstrapTable className="bordered" options={ options } hover={ true }  data={ Bandi }>
              <TableHeaderColumn className="black-muted-bg" dataField='ID' editable={false} width='90' isKey={true} dataSort={ true } dataAlign='center'>ID</TableHeaderColumn>
              <TableHeaderColumn className="black-muted-bg" dataField='Nome' filter={ { type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataSort={ true }>NOME</TableHeaderColumn>
              <TableHeaderColumn className="black-muted-bg" dataField='Categoria' filter={ { type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataSort={ true }>CATEGORIA</TableHeaderColumn>
              <TableHeaderColumn className="black-muted-bg" dataField='Apertura' filter={ { type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataFormat={ dateFormatter } dataSort={ true }>APERTO IL</TableHeaderColumn>
              <TableHeaderColumn className="black-muted-bg" dataField='Chiusura' filter={ { type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center'dataFormat={ dateFormatter } dataSort={ true }>CHIUDERA IL</TableHeaderColumn>
              <TableHeaderColumn className="black-muted-bg" dataField='OffertaMassima' filter={ { type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center'dataFormat={ priceFormatter } dataSort={ true }>OFFERTA MAX</TableHeaderColumn>
              <TableHeaderColumn className="black-muted-bg" dataField='MinRating' filter={ { type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center'dataFormat ={ratingFormatter} dataSort={ true }>PUNTEGGIO MIN</TableHeaderColumn>
              <TableHeaderColumn className="black-muted-bg" dataField='Stato' filter={ { type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataSort={ true }>STATO</TableHeaderColumn>
            </BootstrapTable>
          </div>
        </Panel>
      </Tab>
    </Tabs>
    </Page>
    );
  }
}
