'use strict';

import React, { Component } from 'react';
import 'src/css/auth-lock.css';

import { Row, Col } from 'react-flex-proto';
import { Page, Panel, Input, Select, Button, Textarea, Switch, Breadcrumbs, EditableSelect, eventBus } from 'react-blur-admin';
//plugin che mi permette di cercare regioni e comuni nel select

import { Link } from 'react-router';

import axios from 'axios';
import { isRegExp } from 'util';

// Import React FilePond
import { FilePond, File, registerPlugin } from 'react-filepond';

// Import FilePond styles
import filepondstyle from 'filepond/dist/filepond.min.css';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';

export class Register extends Component {

  constructor(props) {
    super(props);
    //settings per il file pond
    this.server = {
      timeout: 99999,
      process: "http://10.60.110.31:8080/api/uploadDoc",
      revert: "http://10.60.110.31:8080/api/revertUpload",
      load: null,
      restore: "http://10.60.110.31:8080/api/revertUpload",
      fetch: null,
    };
    this.state = {
      files: null, // array contenente i files per filepond
      switches: _.fill(Array(5), true),
      CheckedUgualeSedLeg: false, //check che monitora se è checckata l'opzione di mettere SAmm = SL
      categorie: [], //array che contiene le categorie della piattaforma
      country: '',
      region: '',
      CountryRegion: '',
      editableSelect3: 1,
      checkboxChecked: false,
      //chekcs per l'accettazione di termini e condizioni
      CodEtic: false,
      Privacy: false,
      Policy: false,
      TermCond: false,
      condLinguaI: false,
      condLinguaIng: false,
      condLinguaT: false,
      condLinguaF: false,
      condLinguaS: false,
      firstName: '', //text
      lastName: '',
      dataDocs: {
        NomeDocumento1: '',
        DataDiRilascio1: '',
        NDoc1: '',
        NomeDocumento2: '',
        DataDiRilascio2: '',
        NDoc2: '',
        NomeDocumento3: '',
        DataDiRilascio3: '',
        NDoc3: '',
        NomeDocumento4: '',
        DataDiRilascio4: '',
        NDoc4: '',
      },
      data: {
        //Dati per update profilo fornitore
        Nome: '', //text
        Cognome: '',
        AccessoMail: '',
        Passwd: '',
        Ruolo: '',
        Lingua: '',
        Telefono: '',
        NomeForn: '',
        Categoria1: 1,
        Categoria2: 1,
        Categoria3: 1,
        Categoria4: 1,
        Categoria5: 1,
        SottoCategoria: '',
        IvaForn: '',
        TelefonoAziendale: '',
        FGiurid: '',
        ATECO: '', //alfanumerico
        AnnoCCIAA: '', //da implementare
        ProvinciaCCIAA: '',
        NumeroREA: '',
        SitoWeb: '',
        PEC: '',
        AreaServizio: '',//da implementare
        SubAreaServizio: '',//da implementare
        SLStato: '',
        SLRegione: '',
        SLProvincia: '',
        SLCitta: '',
        SLIndirizzo: '',
        SLCAP: '',
        SLFAX: '',
        SAmmStato: '',
        SAmmRegione: '',
        SAmmProvincia: '',
        SAmmCitta: '',
        SAmmCAP: '',
        SAmmFAX: '',
        SAmmProvincia: '',
        SAmmIndirizzo: '',
        FattAnnuo1: '',         //da implementare
        FattAnnuo2: '',         //da implementare
        FattAnnuo3: '',         //da implementare
        OrgMedio1: '',          //da implementare
        OrgMedio2: '',          //da implementare
        OrgMedio3: '',          //da implementare
        TipoCCNL: '',           //da implementare
        PosINPS: '',           //da implementare
        PosINAIL: '',         //da implementare
        CapSociale: '',      //da implementare
        NDipendenti: '',    //da implementare
        NStabilimenti: '', //da implementare
      },
    };
  }

  //otengo tutte le cateogorie della piattaforma
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

  //caricamento dei File per i documenti inseriti nei campi che verificano l'identità del fornitore
  processHandler(fieldName, file, metadata, load, error, progress, abort) {

    // set data
    const formData = new FormData();
    //formData.append('file', file, file.name);

    // related to aborting the request
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    // the request itself
    axios({
      method: 'post',
      url: 'api/uploadsDoc',
      data: formData,
      cancelToken: source.token,
      onUploadProgress: (e) => {
        // updating progress indicator
        progress(e.lengthComputable, e.loaded, e.total);
      }
    }).then(response => {
      // passing the file id to FilePond
      load(response.data.data.id)
    }).catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
      } else {
        // handle error
      }
    });

    // Setup abort interface
    return {
      abort: () => {
        source.cancel('Operation canceled by the user.');
      }
    };
  };

  //function handler per il caricamento dei file
  processHandler(fieldName, file, metadata, load, error, progress, abort) {

    // set data
    const formData = new FormData();
    //formData.append('file', file, file.name);

    // related to aborting the request
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    // the request itself
    axios({
      method: 'post',
      url: 'api/uploadsDoc',
      data: formData,
      cancelToken: source.token,
      onUploadProgress: (e) => {
        // updating progress indicator
        progress(e.lengthComputable, e.loaded, e.total);
      }
    }).then(response => {
      // passing the file id to FilePond
      load(response.data.data.id)
    }).catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
      } else {
        // handle error
      }
    });

    // Setup abort interface
    return {
      abort: () => {
        source.cancel('Operation canceled by the user.');
      }
    };
  };

  selectLocation(val, key) {
    this.setState({
      [key]: val,
    });
  }

  //handle select categoria
  handleChangeSelect(key, e) {
    let value = e;
    this.setState({
      [key]: value,
    });
  }

  onCloseModal(modalName) {
    this.setState({ [modalName]: false });
  }

  onRenderModal(modalName) {
    this.setState({ [modalName]: true });
  }

  handleIsItChecked(key,value) {
    if (this.state[key] != true & this.state.Lingua == '') {
      this.setState({
        [key]: true,
        Lingua: [value]
      });
    } else {
      this.setState({
        [key]: false,
        Lingua: ''
      });
    }
  }

  handleIsItCheckedAccett(key) {
    if (this.state[key] != true) {
      this.setState({
        [key]: true
      });
    } else {
      this.setState({
        [key]: false,
      });
    }
  }

  onTextChange(key, e) {
    //gestisco l'inserimento nell'input e verifico che l'inserimento sia corretto
    this.setState((prevState, e) => ({
      data: {
        ...prevState.data,
        [key]: event.target.value,
      }
    }))
  }

  //funzione per manage del testo per l'inserimento dei documenti
  onTextChangeDoc(key, e) {
    //gestisco l'inserimento nell'input e verifico che l'inserimento sia corretto
    this.setState((prevState, e) => ({
      dataDocs: {
        ...prevState.dataDocs,
        [key]: event.target.value,
      }
    }))
  }

  //Validazione dei campi di inserimento per la registrazione
  FieldValidation(key, value) {
    switch (key) {
      case 'firstName':
        if (value.length > 15) {
          return 'error';
        }
        break;
      case 'lastName':
        if (value.length > 15) {
          return 'error';
        }
        break;
      case 'email':
        if (!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
          return 'error';
        }
        break;
      case 'pec':
        if (value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
          return 'error';
        }
        break;
      case 'role':
        if (value.length > 15) {
          return 'error';
        }
      case 'Passwd':
        if (value.length > 15) {
          return 'error';
        }
        break;
      case 'password2':
        if (!value.match(this.state.Passwd)) {
          return 'error';
        } else {
          return true;
        }
        break;
      case 'phoneNumber':
        if (value.length > 10) {
          return 'error';
        }
        break;
      case 'telAz':
        if (value.length > 10) {
          return 'error';
        }
        break;
      case 'nomeAzienda':
        if (value.length > 50) {
          return 'error';
        }
        break;
      case 'subCategoria':
        if (value.length > 30) {
          return 'error';
        }
        break;
      case 'piva':
        if (value.length > 11) {
          return 'error';
        }
        break;
      case 'ateco':
        if (value.length > 8) {
          return 'error';
        }
        break;
      case 'provCCIAA':
        if (value.length > 2) {
          return 'error';
        }
        break;
      case 'numREA':
        if (value.length > 6) {
          return 'error';
        }
        break;
      case 'sedeLegInd':
        if (value.length > 30) {
          return 'error';
        }
        break;
      case 'sedeLegNum':
        if (value.length > 3) {
          return 'error';
        }
        break;
      case 'capLeg':
        if (value.length > 5) {
          return 'error';
        }
        break;
      case 'sedeLegFax':
        if (value.length > 10) {
          return 'error';
        }
        break;
      case 'sedeAmmInd':
        if (value.length > 30) {
          return 'error';
        }
        break;
      case 'sedeAmmNum':
        if (value.length > 3) {
          return 'error';
        }
        break;
      case 'capAmm':
        if (value.length > 5) {
          return 'error';
        }
        break;
      case 'sedeAmmFax':
        if (value.length > 10) {
          return 'error';
        }
        break;
    }
  }

  async componentWillMount(){
    await this.getCategorie();
    let options = [];
    this.state.categorie.map(item =>
      options.push({ value: item.ID, label: item.value }),
    )
    this.setState({
      categorie: options,
    })
  }

  handleIsItCheckedUgualeSedLeg(e){
    if (this.state.CheckedUgualeSedLeg != true) {
      this.setState({
        CheckedUgualeSedLeg: true,
        SAmmCAP: this.state.SLCAP,
        SAmmCitta: this.state.SLCitta,
        SAmmFAX:  this.state.SLFAX,
        SAmmIndirizzo:  this.state.SLIndirizzo,
        SAmmProvincia: this.state.SLProvincia,
        SAmmRegione: this.state.SLRegione,
        SAmmStato:  this.state.SLStato,
      })
    } else {
      this.setState({
        CheckedUgualeSedLeg: false,
        SAmmCAP: '',
        SAmmCitta: '',
        SAmmFAX:  '',
        SAmmIndirizzo:  '',
        SAmmProvincia: '',
        SAmmRegione: '',
        SAmmStato:  '',
      })
    }

  }

  onSelectChange(key, value) {
    this.setState({ [key]: value });
  }

  onSwitchChange(index) {
    let switches = this.state.switches;
    switches[index] = !switches[index];
    this.setState({ switches });
  }
  redirNewHome() {
    localStorage.setItem('userToken', 'NaN');
    localStorage.setItem('userRole', 'NaN');
    browserHistory.push('/auth');
  }

  //richiamo l'endpoint con la funzione axios
  //eseguo la registrazione di un nuovo utente con il valore corrente degli state
  //e poi rimandero' l'utente di nuovo al login
  registerUser(e) {
    let self = this;
    e.preventDefault();
    var data = {
      //Dati per update profilo fornitore
      Nome: '', //text
      Cognome: '',
      AccessoMail: '',
      Passwd: '',
      Ruolo: '',
      Lingua: '',
      Telefono: '',
      NomeForn: '',
      Categoria: 1,
      SottoCategoria: '',
      IvaForn: '',
      TelefonoAziendale: '',
      FGiurid: '',
      ATECO: '', //alfanumerico
      AnnoCCIAA: '', //da implementare
      ProvinciaCCIAA: '',
      NumeroREA: '',
      SitoWeb: '',
      PEC: '',
      AreaServizio: '',//da implementare
      SubAreaServizio: '',//da implementare
      SLStato: '',
      SLRegione: '',
      SLProvincia: '',
      SLIndirizzo: '',
      SLCAP: '',
      SLFAX: '',
      SAmmStato: '',
      SAmmRegione: '',
      SAmmProvincia: '',
      SAmmCAP: '',
      SAmmFAX: '',
      SAmmProvincia: '',
      SAmmIndirizzo: '',
      FattAnnuo1: '',//da implementare
      FattAnnuo2: '',//da implementare
      FattAnnuo3: '',//da implementare
      OrgMedio1: '',//da implementare
      OrgMedio2: '',//da implementare
      OrgMedio3: '',//da implementare
      TipoCCNL: '',//da implementare
      PosINPS: '',//da implementare
      PosINAIL: '',//da implementare
      CapSociale: '', //da implementare
      NDipendenti: '',//da implementare
      NStabilimenti: '',//da implementare
    }

    //controllo che siano stati accettati tutti i termini
    if (this.state.Policy & this.state.Privacy & this.state.TermCond & this.state.CodEtic) {
      axios.post('/api/register', {
        data: this.state.data
      })
        .then((response) => {
          //const res = response.clone();
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response;
        }).then(function (result) {

          //console.log("risultato" + result);
          if (result.data.length != 0) {                                                 //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
            eventBus.addNotification('success', "Utente reigstrato con successo!");
            window.location.reload()
          } else {
            eventBus.addNotification('error', 'Registrazione non risucita, controllare la correttezza dei campi!');
          }
        }).catch(function (error) {
          console.log(error);
        });
    }else{
      eventBus.addNotification('error', 'Devi accettare tutte le condizioni prima di registrarti!');
    }
  }

  render() {
    return (
      <div className="lockRegister">
        <Page title='Registrati per poter utilizzare la piattaforma'>
          <div style={{ float: 'right' }}>
            <Link to={'/auth'}><Button icon={<i className="fa fa-chevron-circle-left"></i>} type='default' size='md' title='Indietro' /></Link>
          </div>
          <form>
            <Row>
              <Col>
                <div className="RegPanel">
                  <Panel title='Anagrafica Utente'>
                    <Input
                      type='text'
                      label='Nome utente (Il quale gestirà le informazioni e la partecipazione alle gare)'
                      placeholder='Nome utente'
                      onChange={e => this.onTextChange('Nome', e)}
                      onValidate={e => this.FieldValidation('firstName', e)}
                      value={this.state.data.Nome} />

                    <Input
                      type='text'
                      label='Cognome'
                      placeholder='Cognome'
                      onChange={e => this.onTextChange('Cognome', e)}
                      onValidate={e => this.FieldValidation('lastName', e)}
                      value={this.state.data.Cognome} />
                    <Input
                      type='email'
                      label='email'
                      placeholder='lamiaemail@mail.it'
                      onChange={e => this.onTextChange('AccessoMail', e)}
                      onValidate={e => this.FieldValidation('email', e)}
                      value={this.state.data.AccessoMail} />
                    <Row>
                      <Input
                        type='password'
                        onChange={e => this.onTextChange('Passwd', e)}
                        label='Password'
                        onValidate={e => this.FieldValidation('password2', e)}
                        hasFeedbackIcon={false}
                        value={this.state.data.Passwd} />
                      <span>&nbsp;&nbsp;</span>
                      <Input
                        type='password'
                        onChange={e => this.onTextChange('password2', e)}
                        label='Ripeti la password'
                        onValidate={e => this.FieldValidation('password2', e)}
                        hasFeedbackIcon={false}
                        value={this.state.data.password2} />
                    </Row>

                    <Input
                      type='text'
                      label="Ruolo (Che ricopre all'interno dell'azienda)"
                      placeholder='es. Amministratore, Delegato, Consulente..'
                      onChange={e => this.onTextChange('Ruolo', e)}
                      onValidate={e => this.FieldValidation('role', e)}
                      value={this.state.data.Ruolo} />
                    <Row>
                      <Col>
                        <Input
                          name='checkLing'
                          type='checkbox'
                          onValidate={e => true}
                          value={this.state.condLinguaI}
                          label='Italiano'
                          onChange={e => this.handleIsItChecked('condLinguaI','Italiano')} />
                      </Col>
                      <Col>
                        <Input
                          name='checkLing'
                          type='checkbox'
                          onValidate={e => true}
                          value={this.state.condLinguaIng}
                          label='Inglese'
                          onChange={e => this.handleIsItChecked('condLinguaIng','Inglese')} />
                      </Col>
                      <Col>
                        <Input
                          name='checkLing'
                          type='checkbox'
                          onValidate={e => true}
                          value={this.state.condLinguaT}
                          label='Tedesco'
                          onChange={e => this.handleIsItChecked('condLinguaT','Tedesco')} />
                      </Col>
                      <Col>
                        <Input
                          name='checkLing'
                          type='checkbox'
                          onValidate={e => true}
                          value={this.state.condLinguaF}
                          label='Francese'
                          key='Francese'
                          onChange={e => this.handleIsItChecked('condLinguaF','Francese')} />
                      </Col>
                      <Col>
                        <Input
                          type='checkbox'
                          onValidate={e => true}
                          checked={this.state.condLinguaS}
                          label='Spagnolo'
                          onChange={e => this.handleIsItChecked('condLinguaS','Spagnolo')} />
                      </Col>
                    </Row>
                    <Input
                      type='text'
                      label='Numero di Telefono'
                      placeholder=' es. 1234567890'
                      onChange={e => this.onTextChange('Telefono', e)}
                      onValidate={e => this.FieldValidation('phoneNumber', e)}
                      value={this.state.data.Telefono} />
                  </Panel>
                  <Panel title="Dati Finanziari">
                    <div>
                      <Input
                        type='text'
                        label='Fatturato 1° Anno'
                        placeholder='es. 10.000'
                        onChange={e => this.onTextChange('FattAnnuo1', e)}
                        onValidate={e => this.FieldValidation('FattAnnuo1', e)}
                        value={this.state.data.FattAnnuo1} />
                      <Input
                        type='text'
                        label='Fatturato 2° Anno'
                        placeholder='es. 10.000'
                        onChange={e => this.onTextChange('FattAnnuo2', e)}
                        onValidate={e => this.FieldValidation('FattAnnuo2', e)}
                        value={this.state.data.FattAnnuo2} />
                      <Input
                        type='text'
                        label='Fatturato 3° Anno'
                        placeholder='es. 10.000'
                        onChange={e => this.onTextChange('FattAnnuo3', e)}
                        onValidate={e => this.FieldValidation('FattAnnuo3', e)}
                        value={this.state.data.FattAnnuo3} />
                      <span>&nbsp;&nbsp;</span>
                      <Input
                        type='text'
                        label='Organico Medio 1° Anno'
                        placeholder='es. 10'
                        onChange={e => this.onTextChange('OrgMedio1', e)}
                        onValidate={e => this.FieldValidation('OrgMedio1', e)}
                        value={this.state.data.OrgMedio1} />
                      <Input
                        type='text'
                        label='Organico Medio 2° Anno'
                        placeholder='es. 10'
                        onChange={e => this.onTextChange('OrgMedio2', e)}
                        onValidate={e => this.FieldValidation('OrgMedio2', e)}
                        value={this.state.data.OrgMedio2} />
                      <Input
                        type='text'
                        label='Organico Medio 3° Anno'
                        placeholder='es. 10'
                        onChange={e => this.onTextChange('OrgMedio3', e)}
                        onValidate={e => this.FieldValidation('OrgMedio3', e)}
                        value={this.state.data.OrgMedio3} />
                      <span>&nbsp;&nbsp;</span>
                      <Input
                        type='text'
                        label='Capitale Sociale'
                        placeholder='es. ...'
                        onChange={e => this.onTextChange('CapSociale', e)}
                        onValidate={e => this.FieldValidation('CapSociale', e)}
                        value={this.state.data.CapSociale} />
                      <Input
                        type='text'
                        label='Numero di Dipendenti (alla data attuale)'
                        placeholder='es. ...'
                        onChange={e => this.onTextChange('NDipendenti', e)}
                        onValidate={e => this.FieldValidation('NDipendenti', e)}
                        value={this.state.data.NDipendenti} />
                      <Input
                        type='text'
                        label='Numero di Stabilimenti (alla data attuale)'
                        placeholder='es. ...'
                        onChange={e => this.onTextChange('NStabilimenti', e)}
                        onValidate={e => this.FieldValidation('NStabilimenti', e)}
                        value={this.state.data.NStabilimenti} />
                    </div>
                  </Panel>
                </div>
              </Col>
              <Col>
                <Panel title='Inseriemnto documenti utente'>

                  {/*POSSIBILE NECESSITA' DI UN DIV*/}
                  <Input
                    type='text'
                    label='Tipo di documento'
                    placeholder='Tipo di documento'
                    onChange={e => this.onTextChangeDoc('NomeDocumento1', e)}
                    onValidate={e => this.FieldValidation('firstName', e)}
                    value={this.state.dataDocs.NomeDocumento1} />
                  {/*POSSIBILE NECESSITA' DI UN DIV*/}
                  <Input
                    type='text'
                    label='Data di rilascio/scadenza'
                    placeholder='Data di rilascio/scadenza'
                    onChange={e => this.onTextChangeDoc('DataDiRilascio1', e)}
                    onValidate={e => this.FieldValidation('firstName', e)}
                    value={this.state.dataDocs.DataDiRilascio1} />
                  {/*POSSIBILE NECESSITA' DI UN DIV*/}
                  <Input
                    type='text'
                    label='Numero documento'
                    placeholder='Numero documento'
                    onChange={e => this.onTextChangeDoc('NDoc1', e)}
                    onValidate={e => this.FieldValidation('firstName', e)}
                    value={this.state.dataDocs.NDoc1} />

                  <FilePond
                    //ref={ref => this.pond = ref}
                    labelIdle="Trascina il tuo file o <span class='filepond--label-action'> caricalo </span>"
                    name={"file"}
                    server={this.server}
                    /*server={{
                      url: '/api/uploadDocBand',
                      timeout: 99999,
                      process: this.processHandler(),
                      revert: null,
                      load:null,
                      restore:null,
                      fetch:null,
                    }}*/
                    //onremovefile={this.onRemoveFile}
                    //onprocessfile={this.processHandler()}
                    allowMultiple={true}
                    maxFiles={1}
                    onupdatefiles={(fileItems) => {
                      // Set current file objects to this.state
                      this.setState({
                        files: fileItems.map(fileItem => fileItem.file)
                      });
                    }}
                    allowProcess={true}
                  /*oninit={() => {
                    console.log('FilePond instance has initialised', this.pond);
                  } }*/
                  />

                  {/*POSSIBILE NECESSITA' DI UN DIV*/}
                  {/*POSSIBILE NECESSITA' DI UN DIV*/}
                  <Input
                    type='text'
                    label='Tipo di documento'
                    placeholder='Tipo di documento'
                    onChange={e => this.onTextChangeDoc('NomeDocumento2', e)}
                    onValidate={e => this.FieldValidation('firstName', e)}
                    value={this.state.dataDocs.NomeDocumento2} />
                  {/*POSSIBILE NECESSITA' DI UN DIV*/}
                  <Input
                    type='text'
                    label='Data di rilascio/scadenza'
                    placeholder='Data di rilascio/scadenza'
                    onChange={e => this.onTextChangeDoc('DataDiRilascio2', e)}
                    onValidate={e => this.FieldValidation('firstName', e)}
                    value={this.state.dataDocs.DataDiRilascio2} />
                  {/*POSSIBILE NECESSITA' DI UN DIV*/}
                  <Input
                    type='text'
                    label='Numero documento'
                    placeholder='Numero documento'
                    onChange={e => this.onTextChangeDoc('NDoc2', e)}
                    onValidate={e => this.FieldValidation('firstName', e)}
                    value={this.state.dataDocs.NDoc2} />

                  <FilePond
                    //ref={ref => this.pond = ref}
                    labelIdle="Trascina il tuo file o <span class='filepond--label-action'> caricalo </span>"
                    name={"file"}
                    server={this.server}
                    /*server={{
                      url: '/api/uploadDocBand',
                      timeout: 99999,
                      process: this.processHandler(),
                      revert: null,
                      load:null,
                      restore:null,
                      fetch:null,
                    }}*/
                    //onremovefile={this.onRemoveFile}
                    //onprocessfile={this.processHandler()}
                    allowMultiple={true}
                    maxFiles={1}
                    onupdatefiles={(fileItems) => {
                      // Set current file objects to this.state
                      this.setState({
                        files: fileItems.map(fileItem => fileItem.file)
                      });
                    }}
                    allowProcess={true}
                  /*oninit={() => {
                    console.log('FilePond instance has initialised', this.pond);
                  } }*/
                  />

                  {/*POSSIBILE NECESSITA' DI UN DIV*/}
                  {/*POSSIBILE NECESSITA' DI UN DIV*/}
                  <Input
                    type='text'
                    label='Tipo di documento'
                    placeholder='Tipo di documento'
                    onChange={e => this.onTextChangeDoc('NomeDocumento3', e)}
                    onValidate={e => this.FieldValidation('firstName', e)}
                    value={this.state.dataDocs.NomeDocumento3} />
                  {/*POSSIBILE NECESSITA' DI UN DIV*/}
                  <Input
                    type='text'
                    label='Data di rilascio/scadenza'
                    placeholder='Data di rilascio/scadenza'
                    onChange={e => this.onTextChangeDoc('DataDiRilascio3', e)}
                    onValidate={e => this.FieldValidation('firstName', e)}
                    value={this.state.dataDocs.DataDiRilascio3} />
                  {/*POSSIBILE NECESSITA' DI UN DIV*/}
                  <Input
                    type='text'
                    label='Numero documento'
                    placeholder='Numero documento'
                    onChange={e => this.onTextChangeDoc('NDoc3', e)}
                    onValidate={e => this.FieldValidation('firstName', e)}
                    value={this.state.dataDocs.NDoc3} />

                  <FilePond
                    //ref={ref => this.pond = ref}
                    labelIdle="Trascina il tuo file o <span class='filepond--label-action'> caricalo </span>"
                    name={"file"}
                    server={this.server}
                    /*server={{
                      url: '/api/uploadDocBand',
                      timeout: 99999,
                      process: this.processHandler(),
                      revert: null,
                      load:null,
                      restore:null,
                      fetch:null,
                    }}*/
                    //onremovefile={this.onRemoveFile}
                    //onprocessfile={this.processHandler()}
                    allowMultiple={true}
                    maxFiles={1}
                    onupdatefiles={(fileItems) => {
                      // Set current file objects to this.state
                      this.setState({
                        files: fileItems.map(fileItem => fileItem.file)
                      });
                    }}
                    allowProcess={true}
                  /*oninit={() => {
                    console.log('FilePond instance has initialised', this.pond);
                  } }*/
                  />


                  {/*POSSIBILE NECESSITA' DI UN DIV*/}
                  {/*POSSIBILE NECESSITA' DI UN DIV*/}
                  <Input
                    type='text'
                    label='Tipo di documento'
                    placeholder='Tipo di documento'
                    onChange={e => this.onTextChangeDoc('NomeDocumento4', e)}
                    onValidate={e => this.FieldValidation('firstName', e)}
                    value={this.state.dataDocs.NomeDocumento4} />
                  {/*POSSIBILE NECESSITA' DI UN DIV*/}
                  <Input
                    type='text'
                    label='Data di rilascio/scadenza'
                    placeholder='Data di rilascio/scadenza'
                    onChange={e => this.onTextChangeDoc('DataDiRilascio4', e)}
                    onValidate={e => this.FieldValidation('firstName', e)}
                    value={this.state.dataDocs.DataDiRilascio4} />
                  {/*POSSIBILE NECESSITA' DI UN DIV*/}
                  <Input
                    type='text'
                    label='Numero documento'
                    placeholder='Numero documento'
                    onChange={e => this.onTextChangeDoc('NDoc4', e)}
                    onValidate={e => this.FieldValidation('firstName', e)}
                    value={this.state.dataDocs.NDoc4} />

                  <FilePond
                    //ref={ref => this.pond = ref}
                    labelIdle="Trascina il tuo file o <span class='filepond--label-action'> caricalo </span>"
                    name={"file"}
                    server={this.server}
                    /*server={{
                      url: '/api/uploadDocBand',
                      timeout: 99999,
                      process: this.processHandler(),
                      revert: null,
                      load:null,
                      restore:null,
                      fetch:null,
                    }}*/
                    //onremovefile={this.onRemoveFile}
                    //onprocessfile={this.processHandler()}
                    allowMultiple={true}
                    maxFiles={1}
                    onupdatefiles={(fileItems) => {
                      // Set current file objects to this.state
                      this.setState({
                        files: fileItems.map(fileItem => fileItem.file)
                      });
                    }}
                    allowProcess={true}
                  /*oninit={() => {
                    console.log('FilePond instance has initialised', this.pond);
                  } }*/
                  />
                </Panel>
              </Col>
              <Col>
                <div className="RegPanel">
                  <Panel title='Anagrafica Azienda'>
                    <Input
                      type='text'
                      label="Nome dell'Azienda"
                      placeholder='nome azienda'
                      onChange={e => this.onTextChange('nomeAzienda', e)}
                      onValidate={e => this.FieldValidation('nomeAzienda', e)}
                      value={this.state.data.nomeAzienda} />
                    <div>

                      <h6>Categorie Generica del Fornitore</h6>

                      <Select

                        label="Categoria 1"

                        placeholder='Categoria Generica del Fornitore - 1'

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

                        label="Categoria 2"

                        placeholder='Categoria Generica del Fornitore - 2'

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

                        label="Categoria 3"

                        placeholder='Categoria Generica del Fornitore - 3'

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
                        label="Categoria"
                        placeholder='Categoria Generica del Fornitore - 4'
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

                        {/*quinta categoria*/}
                        <Select
                        label="Categoria"
                        placeholder='Categoria Generica del Fornitore - 5'
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
                        label="Sotto Categoria"
                        placeholder='inserire per ampliare Categoria'
                        onChange={e => this.onTextChange('SottoCategoria', e)}
                        onValidate={e => this.FieldValidation('subCategoria', e)}
                        value={this.state.data.SottoCategoria} />
                      <Input
                        type='text'
                        label='Area/Copertura dei Servizi'
                        placeholder='es. Regione'
                        onChange={e => this.onTextChange('AreaServizio', e)}
                        onValidate={e => this.FieldValidation('AreaServizio', e)}
                        value={this.state.data.AreaServizio} />
                      <Input
                        type='text'
                        label='Sotto Area/Copertura dei Servizi'
                        placeholder='es. Provincia'
                        onChange={e => this.onTextChange('SubAreaServizio', e)}
                        onValidate={e => this.FieldValidation('SubAreaServizio', e)}
                        value={this.state.data.SubAreaServizio} />
                    </div>
                    <Input
                      type='text'
                      label='P.Iva'
                      placeholder='000000000000'
                      onChange={e => this.onTextChange('IvaForn', e)}
                      onValidate={e => this.FieldValidation('piva', e)}
                      value={this.state.data.IvaForn} />

                    <Input
                      type='text'
                      label='Telefono Aziendale'
                      placeholder='0123456789'
                      onChange={e => this.onTextChange('TelefonoAziendale', e)}
                      onValidate={e => this.FieldValidation('telAz', e)}
                      value={this.state.data.TelefonoAziendale} />
                    <div>
                      <h6>Forma Giuridica dell'impresa</h6>
                      <Select
                        placeholder='forma giuridica'
                        options={[
                          { value: 'Ditta Individuale', label: 'Ditta Individuale' },
                          { value: 'S.s.', label: 'Società Semplice' },
                          { value: 'S.n.c.', label: 'Società in nome collettivo' },
                          { value: 'S.a.s.', label: 'Società in accomandita semplice' },
                          { value: 'S.r.l.', label: 'Società a responsabilità limitata' },
                          { value: 'S.r.l.s.', label: 'Società a responsabilità limitata semplice' },
                          { value: 'S.p.a.', label: 'Società per azioni' },
                          { value: 'S.a.p.a.', label: 'Società in accomandita per azioni' },
                        ]}
                        ref={(input) => this.selectVal = input}
                        onChange={(e) => this.handleChangeSelect('FGiurid', e)} />
                    </div>
                    <Row>
                      <Col>
                        <Input
                          type='text'
                          label='Codice della Camera di Commercio (ATECO)'
                          placeholder=''
                          onChange={e => this.onTextChange('ATECO', e)}
                          onValidate={e => this.FieldValidation('ateco', e)}
                          value={this.state.data.ATECO} />
                        <a target="_blank" rel="noopener noreferrer" style={{ float: 'right' }} href="http://ateco.infocamere.it/ateq/home.action"> Non sai il codice?</a>
                      </Col>
                    </Row>
                    <Input
                      type='text'
                      label='Anno iscrizione CCIAA'
                      placeholder='es. 2000'
                      onChange={e => this.onTextChange('AnnoCCIAA', e)}
                      onValidate={e => this.FieldValidation('AnnoCCIAA', e)}
                      value={this.state.data.AnnoCCIAA} />
                    <Input
                      type='text'
                      label='Provincia CCIAA'
                      placeholder='es. AN'
                      onChange={e => this.onTextChange('ProvinciaCCIAA', e)}
                      onValidate={e => this.FieldValidation('provCCIAA', e)}
                      value={this.state.data.ProvinciaCCIAA} />
                    <Input
                      type='text'
                      label='Numero REA'
                      placeholder='es. 0000'
                      onChange={e => this.onTextChange('NumeroREA', e)}
                      onValidate={e => this.FieldValidation('numREA', e)}
                      value={this.state.data.NumeroREA} />
                    <Input
                      type='text'
                      label='Sito Web'
                      placeholder='copia il link del sito'
                      onChange={e => this.onTextChange('SitoWeb', e)}
                      value={this.state.data.SitoWeb} />
                    <Input
                      type='text'
                      label='PEC'
                      placeholder='esempio@lamiaPEC.it'
                      onChange={e => this.onTextChange('PEC', e)}
                      onValidate={e => this.FieldValidation('pec', e)}
                      value={this.state.data.PEC} />
                  </Panel>
                  <Panel title="Dati Finanziari - Dimensione Impresa">
                    <div>
                      <Input
                        type='text'
                        label='Posizione INPS'
                        placeholder='es. ...'
                        onChange={e => this.onTextChange('PosINPS', e)}
                        onValidate={e => this.FieldValidation('PosINPS', e)}
                        value={this.state.data.PosINPS} />
                      <Input
                        type='text'
                        label='Posizione INAIL'
                        placeholder='es. ...'
                        onChange={e => this.onTextChange('PosINAIL', e)}
                        onValidate={e => this.FieldValidation('PosINAIL', e)}
                        value={this.state.data.PosINAIL} />
                      <Input
                        type='text'
                        label='Tipo di contratto CCNL'
                        placeholder='es. ...'
                        onChange={e => this.onTextChange('TipoCCNL', e)}
                        onValidate={e => this.FieldValidation('TipoCCNL', e)}
                        value={this.state.data.TipoCCNL} />
                    </div>
                  </Panel>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Panel title='Anagrafica Azienda - Sede Legale'>
                  {  /*per Vittorio. Qui ci andrebbero una serie di Select
                  con ricerca per poter trovare: Stato,Regione,Provincia */}
                  <Input
                    type='text'
                    label="Stato"
                    placeholder='es. Italia'
                    onChange={e => this.onTextChange('SLStato', e)}
                    value={this.state.data.SLStato} />

                  <Input
                    type='text'
                    label="Regione"
                    placeholder='es. Marche'
                    onChange={e => this.onTextChange('SLRegione', e)}
                    value={this.state.data.SLRegione} />

                  <Input
                    type='text'
                    label="Provincia"
                    placeholder='es. MC(Macerata)'
                    onChange={e => this.onTextChange('SLProvincia', e)}
                    value={this.state.data.SLProvincia} />

                  <Input
                    type='text'
                    label="Città"
                    placeholder='es. Roma'
                    onChange={e => this.onTextChange('SLCitta', e)}
                    value={this.state.data.SLCitta} />
                  <Row>
                    <Input
                      type='text'
                      label='Indirizzo'
                      placeholder='via, viale, piazza... Umberto 1'
                      onChange={e => this.onTextChange('SLIndirizzo', e)}
                      onValidate={e => this.FieldValidation('sedeLegInd', e)}
                      value={this.state.data.SLIndirizzo} />
                    <span>&nbsp;&nbsp;</span>
                    {/*<Input
                      type='text'
                      label='Numero'
                      placeholder='00'
                      onChange={e => this.onTextChange('sedeLegNum', e)}
                      onValidate={e => this.FieldValidation('sedeLegNum', e)}
                      value={this.state.data.sedeLegNum} />
                    <span>&nbsp;&nbsp;</span>*/}
                    <Input
                      type='text'
                      label='CAP'
                      placeholder='cap es.60030'
                      onChange={e => this.onTextChange('SLCAP', e)}
                      onValidate={e => this.FieldValidation('capLeg', e)}
                      value={this.state.data.SLCAP} />
                  </Row>
                  <Input
                    type='text'
                    label='FAX'
                    placeholder=''
                    onChange={e => this.onTextChange('SLFAX', e)}
                    onValidate={e => this.FieldValidation('sedeLegFax', e)}
                    value={this.state.data.SLFAX} />
                </Panel>
              </Col>
              <Col>
                <Panel title='Anagrafica Azienda - Sede Amministrativa'>
                  {  /*per Vittorio. Qui ci andrebbero una serie di Select
                  con ricerca per poter trovare: Stato,Regione,Provincia */}
                  <Input
                    type='checkbox'
                    onValidate={e => true}
                    label='Uguale a Sede Legale'
                    value={this.state.CheckedUgualeSedLeg}
                    onChange={e => { this.handleIsItCheckedUgualeSedLeg()}} />
                  <Input
                    type='text'
                    label="Stato"
                    placeholder='es. Italia'
                    onChange={e => this.onTextChange('SAmmStato', e)}
                    onValidate={e => this.FieldValidation('statoAmm', e)}
                    value={this.state.data.SAmmStato} />
                  <Input
                    type='text'
                    label="Regione"
                    placeholder='es. Marche'
                    onChange={e => this.onTextChange('SAmmRegione', e)}
                    onValidate={e => this.FieldValidation('statoAmm', e)}
                    value={this.state.data.SAmmRegione} />
                  <Input
                    type='text'
                    label="Provincia"
                    placeholder='es. MC(Macerata)'
                    onChange={e => this.onTextChange('SAmmProvincia', e)}
                    onValidate={e => this.FieldValidation('statoAmm', e)}
                    value={this.state.data.SAmmProvincia} />
                  <Input
                    type='text'
                    label="Città"
                    placeholder='es. Roma'
                    onChange={e => this.onTextChange('SAmmCitta', e)}
                    onValidate={e => this.FieldValidation('statoAmm', e)}
                    value={this.state.data.SAmmCitta} />
                  <Row>
                    <Input
                      type='text'
                      label='Indirizzo'
                      placeholder='via Roma,3'
                      onChange={e => this.onTextChange('SAmmIndirizzo', e)}
                      onValidate={e => this.FieldValidation('sedeAmmInd', e)}
                      value={this.state.data.SAmmIndirizzo} />
                    <span>&nbsp;&nbsp;</span>
                    {/*<Input
                      type='text'
                      label='Numero'
                      placeholder='00'
                      onChange={e => this.onTextChange('sedeAmmNum', e)}
                      onValidate={e => this.FieldValidation('sedeAmmNum', e)}
                      value={this.state.data.sedeAmmNum} />
                    <span>&nbsp;&nbsp;</span>*/}
                    <Input
                      type='text'
                      label='CAP'
                      placeholder='cap'
                      onChange={e => this.onTextChange('SAmmCAP', e)}
                      onValidate={e => this.FieldValidation('capAmm', e)}
                      value={this.state.data.SAmmCAP} />
                  </Row>
                  <Input
                    type='text'
                    label='FAX'
                    placeholder=''
                    onChange={e => this.onTextChange('SAmmFAX', e)}
                    onValidate={e => this.FieldValidation('sedeAmmFax', e)}
                    value={this.state.data.SAmmFAX} />
                </Panel>
              </Col>
            </Row>
            <Panel title='Accettazione condizioni'>
              {  /*per Vittorio. Qui ci andrebbero una serie di Select
                  con ricerca per poter trovare: Stato,Regione,Provincia */}
              <Input
                type='checkbox'
                onValidate={e => true}
                value={this.state.CodEtic}
                label='Accettazione Codice Etico'
                onChange={e => { this.handleIsItCheckedAccett('CodEtic') }} />
              <Input
                type='checkbox'
                onValidate={e => true}
                value={this.state.Policy}
                label='Accettazione policy della piattaforma'
                onChange={e => { this.handleIsItCheckedAccett('Policy') }} />
              <Input
                type='checkbox'
                onValidate={e => true}
                value={this.state.TermCond}
                label='Accettazione Termini e Condizioni della piattaforma'
                onChange={e => { this.handleIsItCheckedAccett('TermCond') }} />
              <Input
                type='checkbox'
                onValidate={e => true}
                value={this.state.Privacy}
                label='Accettazione privacy'
                onChange={e => { this.handleIsItCheckedAccett('Privacy') }} />
            </Panel>
            <div style={{ float: 'right' }}>
              <Button type='add' size='lg' title='Registrati' disable={!this.state.formValid} onClick={e => { this.registerUser(e) }} />
            </div>
          </form>
        </Page>
      </div>
    );
  }
}
