import React, { Component } from 'react';

import { Row, Col } from 'react-flex-proto';
import { Page, Panel, Button, Breadcrumbs,eventBus, Input, Select, Switch, Table, Tabs, Tab, TableHead, TableBody, TableRow, EditableText } from 'react-blur-admin';
import { Link, browserHistory } from 'react-router';
import { Modal } from 'react-bootstrap';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import 'node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import axios from 'axios';


import _ from 'lodash';
import star from 'public/star.png';

export class AdminPannel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      banditori: [],
      categorie: [],
      selectedUser: [],
      primaryModal: false,
      warningModal: false, //associare la query di update
      dangerModal: false, //associare la query di delete
      currPage: 1,
      //dati lavorazione banditore
      dataReg: {
        ID: '',
        NomeBand: '', //text
        MailBand: '',
        PasswdAcc: '',
        PasswdAcc1: '',
        TelBand: '',
        Ruolo: '',
      },
      UserToUpd: {
        NomeBand: '', //text
        MailBand: '',
        PasswdAcc: '',
        PasswdAcc1: '',
        TelBand: '',
        Ruolo: '',
      },
      UserToDelete: {
        NomeBand: '', //text
        MailBand: '',
        PasswdAcc: '',
        PasswdAcc1: '',
        TelBand: '',
        Ruolo: '',
      },
      //dati lavorazione categoria
      dataRegCat: {
        ID: '',
        NomeCat: '', //text
      },
      CatToDel: {
        ID: '',
        NomeCat: '', //text
      },
      primaryModal2: false,
      warningModal2: false, //associare la query di update
      dangerModal2: false, //associare la query di delete
    }

    this.onRowSelect = this.onRowSelect.bind(this);
  }

  //validazione dei campi di inseriemnto
  FieldValidation(key, value) {
    switch (key) {
      case 'PasswdAcc':
        if (value.length > 15) {
          return 'error';
        }
        break;
      case 'PasswdAcc1':
        if (!value.match(this.state.dataReg.PasswdAcc)) {
          return 'error';
        } else {
          return true;
        }
        break;
    }
  }
    
  onTextChange(key, e) {
    //gestisco l'inserimento nell'input e verifico che l'inserimento sia corretto
    this.setState((prevState, e) => ({
      dataReg: {
        ...prevState.dataReg,
        [key]: event.target.value,
      }
    }))
  }

  onTextChangeMod(key, e) {
    //gestisco l'inserimento nell'input e verifico che l'inserimento sia corretto
    this.setState((prevState, e) => ({
      UserToUpd: {
        ...prevState.UserToUpd,
        [key]: event.target.value,
      }
    }))
  }

  onTextChangeCat(key, e) {
    //gestisco l'inserimento nell'input e verifico che l'inserimento sia corretto
    this.setState((prevState, e) => ({
      dataRegCat: {
        ...prevState.dataRegCat,
        [key]: event.target.value,
      }
    }))
  }

  onTextChangeModCat(key, e) {
    //gestisco l'inserimento nell'input e verifico che l'inserimento sia corretto
    this.setState((prevState, e) => ({
      CatToDel: {
        ...prevState.CatToDel,
        [key]: event.target.value,
      }
    }))
  }

  //handle select categoria
  handleChangeSelect(key, e) {
    let value = e;
    this.setState((prevState, e) => ({
      dataReg: {
        ...prevState.dataReg,
        [key]: value,
      }
    }))
  }

  //handle select categoria
  handleChangeSelectUpd(key, e) {
    let value = e;
    this.setState((prevState, e) => ({
      dataReg: {
        ...prevState.dataReg,
        [key]: value,
      }
    }))
  }

  getCategorie(){
    //prendo tutte le categorie
    let self = this;
    axios.get('/api/visCategorie')
      .then((response) => {
        //const res = response.clone();
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response;
      }).then(function (result) {
        if (result.data.length != 0) {                                                 //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
          //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
          console.log('i dati letti sono: ' + result.data);          //controllo che abbia settato il token
          //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
          self.setState({
            categorie: result.data
          });
        } else {
          alert("Non ci sono informazioni relative a questo utente o ci sono errori del server");
        }
      }).catch(function (error) {
        console.log(error);
      });
  }

  getBanditori(){
    //prendo tutti i banditori
    let self = this;
    axios.get('/api/visBanditori')
      .then((response) => {
        //const res = response.clone();
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response;
      }).then(function (result) {
        if (result.data.length != 0) {                                                 //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
          //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
          console.log('i dati letti sono: ' + result.data);          //controllo che abbia settato il token
          //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
          self.setState({
            banditori: result.data
          });
        } else {
          alert("Non ci sono informazioni relative a questo utente o ci sono errori del server");
        }
      }).catch(function (error) {
        console.log(error);
      });
  }


  componentDidMount() {
    this.getBanditori();
    this.getCategorie();
  }

  //handle dell'eliminazione
  insertBanditore() {
    //inserimento banditore
    var data = this.state.dataReg;
    let self = this;
    axios.post('/api/insBanditore', {
      datiBandNew: data,
    }).then((response) => {
      //const res = response.clone();
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response;
    }).then(function (result) {
      if (result.data.length != 0) {                                                 //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
        //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
        console.log('i dati letti sono: ' + result.data);          //controllo che abbia settato il token
        //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
        
        localStorage.setItem('userMail', data.AccessoMail); //setto la mail appena modificata nei cookie
        eventBus.addNotification('success', "Profilo inserito con successo!");
        self.onCloseModal('primaryModal'); //chiudo il modal a registrazione del banditore effettuata correttamente
        this.getBanditori();
      } else {
        eventBus.addNotification('warning', "A quanto pare sembra che ci siano dei problemi con l'inserimento!");
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  //handle dell'eliminazione
  insertCategoria() {
    //inserimento banditore
    var data = this.state.dataRegCat;
    let self = this;
    axios.post('/api/insCategoria', {
      datiCat: data,
    }).then((response) => {
      //const res = response.clone();
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response;
    }).then(function (result) {
      if (result.data.length != 0) {                                                 //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
        //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
        console.log('i dati letti sono: ' + result.data);          //controllo che abbia settato il token
        //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
        
        localStorage.setItem('userMail', data.AccessoMail); //setto la mail appena modificata nei cookie
        eventBus.addNotification('success', "Profilo inserito con successo!");
        self.onCloseModal('primaryModal'); //chiudo il modal a registrazione del banditore effettuata correttamente
        this.getBanditori();
      } else {
        eventBus.addNotification('warning', "A quanto pare sembra che ci siano dei problemi con l'inserimento!");
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  deleteBanditore() {
    //inserimento banditore
    var data = this.state.UserToUpd;
    let self = this;
    axios.post('/api/deleteUser', {
      datiFornDel: data,
    }).then((response) => {
      //const res = response.clone();
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response;
    }).then(function (result) {
      if (result.data.length != 0) {                                                 //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
        //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
        console.log('i dati letti sono: ' + result.data);          //controllo che abbia settato il token
        //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
        self.setState({
          data: result.data
        });
        localStorage.setItem('userMail', data.AccessoMail); //setto la mail appena modificata nei cookie
        eventBus.addNotification('success', "Profilo eliminato con successo!");
        self.onCloseModal('primaryModal'); //chiudo il modal a registrazione del banditore effettuata correttamente
        self.getCategorie();
      } else {
        eventBus.addNotification('error', "A quanto pare sembra che ci siano deo problemi con l'eliminazione della gara!");
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  deleteCategoria() {
    //inserimento banditore
    var data = this.state.CatToDel;
    let self = this;
    axios.post('/api/deleteCat', {
      datiCatDel: data,
    }).then((response) => {
      //const res = response.clone();
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response;
    }).then(function (result) {
      if (result.data.length != 0) {                                                 //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
        //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
        console.log('i dati letti sono: ' + result.data);          //controllo che abbia settato il token
        //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
        self.setState({
          data: result.data
        });
        localStorage.setItem('userMail', data.AccessoMail); //setto la mail appena modificata nei cookie
        eventBus.addNotification('success', "Profilo eliminato con successo!");
        self.onCloseModal('primaryModal'); //chiudo il modal a registrazione del banditore effettuata correttamente
        self.getCategorie();
      } else {
        eventBus.addNotification('error', "A quanto pare sembra che ci siano deo problemi con l'eliminazione della gara!");
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  updateBanditore() {
    //inserimento banditore
    let self = this;
    axios.post('/api/updateUserband', {
      datiBandNew: self.state.UserToUpd,
    }).then((response) => {
      //const res = response.clone();
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response;
    }).then(function (result) {
      if (result.data.length != 0) {                                                 //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
        //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
        console.log('i dati letti sono: ' + result.data);          //controllo che abbia settato il token
        //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
        self.setState({
          data: result.data
        });
        localStorage.setItem('userMail', data.AccessoMail); //setto la mail appena modificata nei cookie
        eventBus.addNotification('success', "Profilo aggiornato con successo!");
        self.onCloseModal('primaryModal'); //chiudo il modal a registrazione del banditore effettuata correttamente
      } else {
        eventBus.addNotification('warning', "A quanto pare non siamo riusciti ad aggiornare il profilo!");
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  //Handle role Banditore
  logChangeRole(e) {
    this.setState({ Ruolo: 'Banditore' });

  }

  onCloseModal(modalName) {
    this.setState({ [modalName]: false });
  }

  //handle per gestire la apertura e la chiusura del modal
  onRenderModal(modalName, value) {
    this.setState({ [modalName]: value });
  }

  //INIZIO METODI PER IL MODAL DELLA VALUTAZIONE
  //Row selection per la tabella delle categorie
  onRowSelect(row, isSelected) {
    let self = this;
    if (isSelected && self.state.UserToUpd.length !== 1) {
      self.setState({
        UserToUpd: {
          ID: row.ID,
          NomeBand: row.Nome, //text
          MailBand: row.email,
          PasswdAcc: row.PasswdAcc,
          PasswdAcc1: row.PasswdAcc1,
          TelBand: row.TelBand,
          Ruolo: row.Ruolo,
        },
        currPage: self.refs.tableUser.state.currPage,
        selectedUser: [ ...this.state.selectedUser, row.ID ].sort()
      });
    } else {
      this.setState({ selectedUser: this.state.selectedUser.filter(it => it !== row.ID) });
      this.setState({ UserToUpd: this.state.UserToUpd.filter(ID => ID !== row.ID) });
    }
  }

  //Row selection  per la tabella delle categorie
  onRowSelectCateg(row, isSelected) {
    let self = this;
    if (isSelected && self.state.UserToUpd.length !== 1) {
      self.setState({
        UserToUpd: {
          ID: row.ID,
          NomeBand: row.Nome, //text
          MailBand: row.email,
          PasswdAcc: row.PasswdAcc,
          PasswdAcc1: row.PasswdAcc1,
          TelBand: row.TelBand,
          Ruolo: row.Ruolo,
        },
        currPage: self.refs.tableCateg.state.currPage,
        selectedUser: [ ...this.state.selectedUser, row.ID ].sort()
      });
    } else {
      this.setState({ selectedUser: this.state.selectedUser.filter(it => it !== row.ID) });
      this.setState({ UserToUpd: this.state.UserToUpd.filter(ID => ID !== row.ID) });
    }
  }

  //FINE

  render() {

    //opzioni per la tabella di valutazione del fornitore
    const options2 = {
      //imposto la parte grafica della tabella
      sizePerPageList: [ 5, 10, 15, 20 ],
      sizePerPage: 10,
      page: this.state.currPage,
    };

    //opzioni per la tabella di valutazione del fornitore
    const options2Categ = {
      //imposto la parte grafica della tabella
      sizePerPageList: [ 5, 10, 15, 20 ],
      sizePerPage: 10,
      page: this.state.currPage,
    };

    //costanti inizializzate per il metodo del modal di valutazione del fornitore
    const selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true,
      onSelect: this.onRowSelect,
      onSelectAll: this.onSelectAll,
      selected: this.state.selectedUser
    };

    //costanti inizializzate per il metodo del modal di valutazione del fornitore
    const selectRowPropCateg = {
      mode: 'checkbox',
      clickToSelect: true,
      onSelect: this.onRowSelect,
      onSelectAll: this.onSelectAll,
      selected: this.state.selectedUser
    };

    let banditori = [];
    let categorie = [];

    if (this.state.banditori.length != 0) {
      banditori = this.state.banditori; //provvedo ad evitare che la pagina vada in errore perche' al primo render lo state non e' settato
    }
    if (this.state.categorie.length != 0) {
      categorie = this.state.categorie; //provvedo ad evitare che la pagina vada in errore perche' al primo render lo state non e' settato
    }
    return (
      <Page title="Admin Pannel  Albo Fornitori - Sviluppo">
        <Modal
          show={this.state.dangerModal}
          onHide={() => this.onCloseModal('dangerModal')}
        >
          <Modal.Header closeButton className="modal-header bg-danger">
            <Modal.Title style={{ color: '#ffffff' }}>Elimina il Banditore</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h5>Inserire ID da modificare</h5>
              <Input
                type='text'
                placeholder=''
                value={this.state.ID}
                onChange={e => this.logChangeNome(e)} />
            </div>
            Sei sicuro di voler eliminare in maniera definitiva il Banditore ?
          </Modal.Body>
          <Modal.Footer>
            <Button type='danger' onClick={this.submit} title='Elinima' onClick={() => this.deleteBando()} />
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.primaryModal}
          onHide={() => this.onCloseModal('primaryModal')}
        >
          <Modal.Header closeButton className="modal-header bg-primary">
            <Modal.Title style={{ color: '#ffffff' }}>Inserimento nuovo Banditore</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <Modal type='warning' title='Modifica della Gara' isOpen={this.state.warningModal} onClose={e => this.onCloseModal('warningModal')}> */}
            <form>
              <div className="RegPanel">
                <div>
                  <h5>Inserire nome del banditore</h5>
                  <Input
                    type='text'
                    placeholder='Nome utente'
                    value={this.state.dataReg.NomeBand}
                    onChange={(e) => this.onTextChange('NomeBand')} />
                </div>
                <div>
                  <h5>Inserire l'email</h5>
                  <Input
                    type='text'
                    placeholder='Mail di accesso'
                    value={this.state.dataReg.MailBand}
                    onChange={(e) => this.onTextChange('MailBand')} />
                </div>
                <div>
                  <h5>Inserire telefono banditore</h5>
                  <Input
                    type='text'
                    placeholder='Password di accesso'
                    onValidate={e => this.FieldValidation('PasswdAcc', e)}
                    value={this.state.dataReg.PasswdAcc}
                    onChange={(e) => this.onTextChange('PasswdAcc')} />
                </div>
              </div>
              <div>
                <h5>Inserire telefono banditore</h5>
                <Input
                  type='text'
                  placeholder='Ripeti Password'
                  onValidate={e => this.FieldValidation('PasswdAcc1', e)}
                  value={this.state.dataReg.PasswdAcc1}
                  onChange={(e) => this.onTextChange('PasswdAcc1')} />
              </div>
              <div>
                <h5>Inserire telefono banditore</h5>
                <Input
                  type='text'
                  placeholder='Telefono'
                  value={this.state.dataReg.TelBand}
                  onChange={(e) => this.onTextChange('TelBand')} />
                <div>
                  <Select
                    label="Ruolo"
                    placeholder='Ruolo nella piattaforma'
                    options={[
                      { value: 'Banditore', label: 'Banditore' },
                      { value: 'Supervisore', label: 'Supervisore' },
                    ]}
                    ref={(input) => this.selectVal = input}
                    onChange={(e) => this.handleChangeSelect('Ruolo', e)} />
                </div>
              </div>
            </form>
            {/* </Modal> */}
          </Modal.Body>
          <Modal.Footer>
            <Button type='primary' title='Salva' onClick={e => { this.insertBanditore(e) }} />
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.warningModal}
          onHide={() => this.onCloseModal('warningModal')}
        >
          <Modal.Header closeButton className="modal-header bg-warning">
            <Modal.Title style={{ color: '#ffffff' }}>Modifica utente selezionato</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <Modal type='warning' title='Modifica della Gara' isOpen={this.state.warningModal} onClose={e => this.onCloseModal('warningModal')}> */}
            <form>
              <div className="RegPanel">
                <div>
                  <h5>Inserire nome </h5>
                  <Input
                    type='text'
                    placeholder='Nome utente'
                    value={this.state.UserToUpd.NomeBand}
                    onChange={(e) => this.onTextChangeMod('NomeBand')} />
                </div>
                <div>
                  <h5>Inserire l'email di accesso</h5>
                  <Input
                    type='text'
                    placeholder='Mail di accesso'
                    value={this.state.UserToUpd.MailBand}
                    onChange={(e) => this.onTextChangeMod('MailBand')} />
                </div>
                <div>
                  <h5>Inserire telefono banditore</h5>
                  <Input
                    type='password'
                    placeholder='Password di accesso'
                    onValidate={e => this.FieldValidation('PasswdAcc', e)}
                    value={this.state.UserToUpd.PasswdAcc}
                    onChange={(e) => this.onTextChangeMod('PasswdAcc')} />
                </div>
              </div>
              <div>
                <h5>Inserire telefono banditore</h5>
                <Input
                  type='password'
                  placeholder='Ripeti Password'
                  onValidate={e => this.FieldValidation('PasswdAcc1', e)}
                  value={this.state.UserToUpd.PasswdAcc1}
                  onChange={(e) => this.onTextChangeMod('PasswdAcc1')} />
              </div>
              <div>
                <h5>Inserire telefono banditore</h5>
                <Input
                  type='text'
                  placeholder='Telefono'
                  value={this.state.UserToUpd.TelBand}
                  onChange={(e) => this.onTextChangeMod('TelBand')} />
                <div>
                  <Select
                    label="Ruolo"
                    placeholder='Ruolo nella piattaforma'
                    options={[
                      { value: 'Banditore', label: 'Banditore' },
                      { value: 'Supervisore', label: 'Supervisore' },
                    ]}
                    ref={(input) => this.selectVal = input}
                    onChange={(e) => this.handleChangeSelectUpd('Ruolo', e)} />
                </div>
              </div>
            </form>
            {/* </Modal> */}
          </Modal.Body>
          <Modal.Footer>
            <Button type='warning' title='Modifica' onClick={e => { this.updateBanditore(e) }} />
          </Modal.Footer>

        </Modal>
        
        {/*Eliminazione banditore*/}
        <Modal
          show={this.state.dangerModal}
          onHide={() => this.onCloseModal('dangerModal')}
        >
          <Modal.Header closeButton className="modal-header bg-danger">
            <Modal.Title style={{ color: '#ffffff' }}>Elimina il Banditore</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Sei sicuro di voler eliminare in maniera definitiva il Banditore ?
              </Modal.Body>
          <Modal.Footer>
            <Button type='danger' onClick={this.submit} title='Elinima' onClick={() => this.deleteBanditore()} />
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.dangerModal2}
          onHide={() => this.onCloseModal('dangerModal2')}
        >
          <Modal.Header closeButton className="modal-header bg-danger">
            <Modal.Title style={{ color: '#ffffff' }}>Elimina la categoria</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Sei sicuro di voler eliminare in maniera definitiva il Banditore ?
          </Modal.Body>
          <Modal.Footer>
            <Button type='danger' onClick={this.submit} title='Elinima' onClick={() => this.deleteCategorie()} />
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.primaryModal2}
          onHide={() => this.onCloseModal('primaryModal2')}
        >
          <Modal.Header closeButton className="modal-header bg-primary">
            <Modal.Title style={{ color: '#ffffff' }}>Inserimento nuovo Categoria</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <Modal type='warning' title='Modifica della Gara' isOpen={this.state.warningModal} onClose={e => this.onCloseModal('warningModal')}> */}
            <form>
              <div className="RegPanel">
                <div>
                  <h5>Inserire nome della Categoria</h5>
                  <Input
                    type='text'
                    placeholder=''
                    value={this.state.dataRegCat.NomeCat}
                    onChange={(e) => this.onTextChangeCat('NomeCat')} />
                </div>
              </div>
            </form>
            {/* </Modal> */}
          </Modal.Body>
          <Modal.Footer>
            <Button type='info' title='Salva' onClick={e => { this.insertCategoria(e) }} />
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.warningModal2}
          onHide={() => this.onCloseModal('warningModal2')}
        >
          <Modal.Header closeButton className="modal-header bg-warning">
            <Modal.Title style={{ color: '#ffffff' }}>Modifica Categoria</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <Modal type='warning' title='Modifica della Gara' isOpen={this.state.warningModal} onClose={e => this.onCloseModal('warningModal')}> */}
            <form>
              <div className="RegPanel">
                <div>
                  <h5>Inserire ID da modificare</h5>
                  <Input
                    type='text'
                    placeholder=''
                    value={this.state.ID}
                    onChange={e => this.logChangeNome(e)} />
                </div>
                <div>
                  <h5>Inserire nome della Categoria</h5>
                  <Input
                    type='text'
                    placeholder=''
                    value={this.state.nome}
                    onChange={e => this.logChangeNome(e)} />
                </div>
              </div>
            </form>
            {/* </Modal> */}
          </Modal.Body>
          <Modal.Footer>
            <Button type='warning' title='Modifica' onClick={e => { this.updateCategoria(e) }} />
          </Modal.Footer>
        </Modal>
        <Row>
          <Tabs align='top'
            startTab={1}>
            <Tab title="INSERIMENTO BANDITORI">
              <Panel title="Pagina dove vengono visualizzate tutte le funzioni relative all'admin">
                <div className="Titolo del bando">
                  <Panel title="Lista Banditori">
                    <div style={{ float: 'right' }}>
                      <Button type='danger' title="Elimina" onClick={e => this.onRenderModal('dangerModal', true)} />
                    </div>
                    <div style={{ float: 'right' }}>
                      <Button type='warning' title="Modifica" onClick={e => this.onRenderModal('warningModal', true)} />
                    </div><div style={{ float: 'left' }}>
                      <Button type='info' title="Inserisci" onClick={e => this.onRenderModal('primaryModal', true)} />
                    </div>
                    <BootstrapTable ref='tableUser' className="bordered" selectRow={ selectRowProp } pagination={ true } options={ options2 }  data={banditori}>
                      <TableHeaderColumn className="black-muted-bg" dataField='ID' editable={false} width='90' isKey={true} dataSort={true} dataAlign='center'>ID</TableHeaderColumn>
                      <TableHeaderColumn className="black-muted-bg" dataField='Nome' filter={{ type: 'TextFilter', delay: 1000 }} dataAlign='center' dataSort={true}>NOME</TableHeaderColumn>
                      <TableHeaderColumn className="black-muted-bg" dataField='email' filter={{ type: 'TextFilter', delay: 1000 }} dataAlign='center' dataSort={true}>E-MAIL</TableHeaderColumn>
                      <TableHeaderColumn className="black-muted-bg" dataField='Ruolo' filter={{ type: 'TextFilter', delay: 1000 }} dataAlign='center' dataSort={true}>RUOLO</TableHeaderColumn>
                    </BootstrapTable>
                  </Panel>
                </div>
              </Panel>
            </Tab>
            <Tab title="INSERIMENTO CATEGORIE">
              <Panel title="Lista Categorie">
                <div style={{ float: 'left' }}>
                  <Button type='info' title="Inserisci" onClick={e => this.onRenderModal('primaryModal2', true)} />
                </div>
                {/*<div style={{ float: 'right' }}>
                  <Button type='warning' title="Modifica" onClick={e => this.onRenderModal('warningModal2', true)} />
                </div>*/}
                <div style={{ float: 'right' }}>
                  <Button type='danger' title="Elimina" onClick={e => this.onRenderModal('dangerModal2', true)} />
                  </div>
                <BootstrapTable ref='tableCateg' className="bordered" selectRow={ selectRowPropCateg } options={ options2Categ } data={categorie}>
                  <TableHeaderColumn className="black-muted-bg" dataField='ID' width='90' isKey={true} dataSort={true} dataAlign='center'>ID</TableHeaderColumn>
                  <TableHeaderColumn className="black-muted-bg" dataField='Nome' filter={{ type: 'TextFilter', delay: 1000 }} dataAlign='center' dataSort={true}>NOME DELLA CATEGORIA</TableHeaderColumn>
                </BootstrapTable>
              </Panel>
            </Tab>
          </Tabs>
        </Row>
      </Page>
    );
  }
}
