import React from 'react';

import { Row, Col } from 'react-flex-proto';
import { Page, Panel, Button, Breadcrumbs, Textarea, Input, Select, Switch, Table, Tabs, Tab, TableHead, TableBody, TableRow, EditableText, eventBus } from 'react-blur-admin';
import { Link, browserHistory } from 'react-router';
import { Modal } from 'react-bootstrap';
import saveAs from 'file-saver';

//Notifiche

import axios from 'axios';

// Import React FilePond
import { FilePond, File, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

/*
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';*/

// Registro i plugin
//registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

//DatePicker
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import DatePicker from 'react-bootstrap-date-picker';

import _ from 'lodash';
import star from 'public/star.png';
const querystring = require('querystring');

const spanishDayLabels = ['Lun', 'Mar', 'Mer', 'Gio', 'Ved', 'Sab', 'Dom'];
const spanishMonthLabels = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];



//VARIABILE STYILING CSS
const ValutaButtStyle = {
  bottom: '10px',
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

const styleTabellaFornVal = {
  padding:'5px',
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
  if (cell == 0) {
    return 'LIBERO';
  }
  else {
    if (cell <= 19 && cell >= 1) {
      return (<img src={star} />);
    }
    else {
      if (cell <= 39 && cell >= 20) {
        return <div><img src={star} /><img src={star} /></div>;
      }
      else {
        if (cell <= 59 && cell >= 40) {
          return <div><img src={star} /><img src={star} /><img src={star} /></div>;
        }
        else {
          if (cell <= 79 && cell >= 60) {
            return <div><img src={star} /><img src={star} /><img src={star} /><img src={star} /></div>;
          }
          else {
            if (cell <= 100 && cell >= 80) {
              return <div><img src={star} /><img src={star} /><img src={star} /><img src={star} /><img src={star} /></div>;
            }
          }
        }
      }
    }
  }
}

function ratingFormatterForn(cell, row) {
  if (cell == 0 || cell == null) {
    return 'NO VALUTAZIONE';
  }
  else {
    if (cell <= 19 && cell >= 1) {
      return (<img src={star} />);
    }
    else {
      if (cell <= 39 && cell >= 20) {
        return <div><img src={star} /><img src={star} /></div>;
      }
      else {
        if (cell <= 59 && cell >= 40) {
          return <div><img src={star} /><img src={star} /><img src={star} /></div>;
        }
        else {
          if (cell <= 79 && cell >= 60) {
            return <div><img src={star} /><img src={star} /><img src={star} /><img src={star} /></div>;
          }
          else {
            if (cell <= 100 && cell >= 80) {
              return <div><img src={star} /><img src={star} /><img src={star} /><img src={star} /><img src={star} /></div>;
            }
          }
        }
      }
    }
  }
}


const options = {
  onRowClick: function (row) {
    browserHistory.push({
      pathname: '/banditore-dettaglio-bando',
      state: { rowSel: row }
    });
  },
  onRowDoubleClick: function (row) {
    //alert(`You double click row id: ${row.ID}`);
  }
};




export class BanditorePannel extends Modal {
  constructor(props) {
    super(props)
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
      valutazioneModal: false,
      //lista proprietà del fornitore da valutare
      FornToVal: [],
      currPage: 1,
      dataValutazione: [{
        firstName: "",
        lastName: "",
        Qualita: 0,
        RispSol: 0,
        Prezzo: 0,
        Profess: 0,
        Consulenz: 0,
        textarea: "",
      }],
      CleanDataValutazione: [{
        firstName: "",
        lastName: "",
        Qualita: 0,
        RispSol: 0,
        Prezzo: 0,
        Profess: 0,
        Consulenz: 0,
        textarea: "",
      }],
      files: null, // array contenente i files per filepond
      data: [],
      bandi: [],
      allBandi: [],
      show: false,
      currentRow: [],
      primaryModal: false,
      condition1: false, //vcheckbox gara con esclusione
      condition2: false,  //checkbox gara con invito
      RatMinEnab: true,

      //modal
      nomeBando: 'Nessun Titolo Disponibile',
      categoria: 1,
      descr: 'Nessuna Descrizione Disponibile',
      dataCreazione: new Date().toISOString(),
      dataApertura: new Date().toISOString(),
      dataChiusura: new Date().toISOString(),
      sogliaMax: 0,
      minRating: 0,
      stato: 'Nascosto',
      garaConEsclusione: false,

    }
    this.handleChangeApertura = this.handleChangeApertura.bind(this);
    this.handleChangeChiusura = this.handleChangeChiusura.bind(this);
    this.insertBando = this.insertBando.bind(this);



  }

  //-------------------------------------------------------------
  //metodi per la gestione del caricamento dei file con FILE POND
  onRemoveFile = file => {
    console.log("onremovefile triggered for ", file);
  };

  onProcessFile = (err, fileItem) => {
    console.log("onprocessfile");
    console.log(fileItem.source);
    this.setState({
      currentFile: {
        source: fileItem.source,
        options: {
          type: "local"
        }
      }
    });
  };

  //Inserisco la valutazione per il fornitore selezionato nella lista
  insertValutazione() {
    //inserisco la valutazione assegnata al fornitore ma controllo prima se è stato selezionato un fornitore
    if(this.state.FornToVal.length != 0){
      let self = this;
      axios.post('/api/valutaForn', {
        data: this.state.dataValutazione,
        IDForn: this.state.FornToVal[0][0].ID,
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
            //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
            console.log('i dati letti sono: ' + result.data);          //controllo che abbia settato il token
            eventBus.addNotification('success', 'Valutazione Inserita correttamente! ');
            //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
            self.setState({
              valutData: result.data
            });
            self.onCloseModal('valutazioneModal');
            self.allFornOfBand(MailUser);
          } else {
            eventBus.addNotification('error', 'Attenzione, la valutazione non è stata inserita,verificare la correttezza dei campi e riprovare! ');
          }
        }).catch(function (error) {
          console.log(error);
        });
      }else{

      }
  }

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

  //handles per il form di valutazione
  //handle per le checkbox della valutazione
  handleStateQualita(e){
    this.setState(prevState => ({
      dataValutazione: {
          ...prevState.dataValutazione,
          Qualita: e
      }
    })
    );
  }

  handleStateRispSol(e){
    this.setState(prevState => ({
      dataValutazione: {
          ...prevState.dataValutazione,
          RispSol: e
      }
    })
    );
  }

  handleStatePrezz(e){
    this.setState(prevState => ({
      dataValutazione: {
          ...prevState.dataValutazione,
          Prezzo: e
      }
    })
    );
  }

  handleStateProfPers(e){
    this.setState(prevState => ({
      dataValutazione: {
          ...prevState.dataValutazione,
          Profess: e
      }
    })
    );
  }

  handleStateCapacitaPers(e){
    this.setState(prevState => ({
      dataValutazione: {
          ...prevState.dataValutazione,
          Consulenz: e
      }
    })
    );
  }

  handleChangeApertura(value, formattedValue) {
    this.setState({
      dataApertura: value,
    });
  }

  //handle dataChiusura
  handleChangeChiusura(value, formattedValue) {
    this.setState({
      dataChiusura: value,
    });
  }

  onCloseModal(modalName) {
    this.setState({ [modalName]: false });
  }

  //handle per gestire la apertura e la chiusura del modal
  onRenderModal(modalName, value) {
    this.setState({ [modalName]: true });
  }

  //handle select categoria
  handleChangeSelect(e) {
    let value = e;
    this.setState({
      categoria: value,
    });
  }


  onTextChange(key, e) {
    //gestisco l'inserimento nell'input e verifico che l'inserimento sia corretto
    this.setState((prevState, e) => ({
      dataValutazione: {
        ...prevState.dataValutazione,
        [key]: event.target.value,
      }
    }))
  }

  //prendo il manage del campo ChangeNome
  logChangeNome(e) {
    this.setState({ nomeBando: e.target.value });
  }
  logTextChange(e) {
    this.setState({ descr: e.target.value });
  }

  handleStateNascosto(e) {
    this.setState({ stato: 'Nascosto' });
  }
  handleStateAperto(e) {
    this.setState({ stato: 'Aperto' });
  }

  handleIsItCheckedEsclusione(e) {
    this.setState({
      condition1: e,
      RatMinEnab: false,
    });

  }

  handleIsItCheckedInvito(e) {
    this.setState({ condition2: e });
  }

  handleStateSogliaMax(e) {
    this.setState({ sogliaMax: e.target.value });
  }

  logChangeDataMinRating(e) {
    this.setState({ minRating: e.target.value });
  }

  componentWillMount() {
    const MailUser = localStorage.getItem('userMail');
    this.setState({ MailUser: MailUser });
    this.allFornOfBand(MailUser);
    this.allBandiBanditore(MailUser);
  }

  //funzione per il salvataggio del bando
  insertBando(event) {

    let self = this;
    const MailUser = self.state.MailUser;
    event.preventDefault(); //non ricarico la pagina una volta fatto il submit
    var data = {
      nome: this.state.nomeBando,
      categoria: this.state.categoria,
      descr: this.state.descr,
      dataCreazione: this.state.dataCreazione.substring(0, this.state.dataCreazione.indexOf('T')),
      dataApertura: this.state.dataApertura.substring(0, this.state.dataApertura.indexOf('T')),
      dataChiusura: this.state.dataChiusura.substring(0, this.state.dataChiusura.indexOf('T')),
      sogliaMax: this.state.sogliaMax,
      minRating: this.state.minRating,
      stato: this.state.stato,
      mailBand: MailUser,
    }
    console.log(data)
    fetch("/api/insBando", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
        //alert("c'è stato un errore nel salvataggio del bando");
      }
      return response.json();
    }).then(function (data) {
      console.log(data);
      if (data.affectedRows == 1) {                               //controllo che la registrazione del bando sia avvenuta con successo se si
        self.allBandiBanditore(MailUser);
        self.onCloseModal('primaryModal', false);              //tolgo il modal una volta che ho aggiornato la lista dei banditori
        self.state.files.map(fileItem =>
          self.saveFiles(fileItem));
        self.setState({ files: [] });                            //azzero il vettore dei files che vengono caricati nel modulo
        eventBus.addNotification('success', 'Bando Inserito Correttamente');
      } else {
        eventBus.addNotification('error', 'Abbiamo riscontrato problemi nella registrazione del bando, riprovare!');
        //eliminazione files
      }
    }).catch(function (err) {
      console.log(err)
    });
  }

  //funzione per la navigazione alla pagina di dettagli del fornitore
  DettagliForn() {
    //comando che mi permette la navigazione alla pagina di dettaglio del fornitore
    //qui fornisco anche l'id del fornitore per effettuare la query che mi permette poi di mostrarlo
    browserHistory.push({
      pathname: '/banditore-istruttoria',
      state: { rowSel: this.state.FornToVal }
    });
  }

  //funzione che mi permette di salvare i file con nome MailBando+IDBando+nomeFile
  saveFiles(files) {
    //inserisco la valutazione assegnata al fornitore
    axios.post('/api/insertDocuAnalisiBando', {
      data: files.name,
      nomeBando: this.state.nomeBando,
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
          //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
          console.log('i dati letti sono: ' + result.data);          //controllo che abbia settato il token
        } else {
          eventBus.addNotification('error', "Attenzione, il caricamento dei documenti non è avvenuto correttamente, contattare l'assistenza! ");
        }
      }).catch(function (error) {
        console.log(error);
      });
  }

  //richiamo l'endpoint che mi restituisce tutti i fornitori che hanno aderito ai bandi del banditore corrente
  allFornOfBand(MailUser) {
    let self = this;
    axios.post('/api/allFornOfBand', {
      Mail: MailUser,
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
          //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
          console.log('i dati letti sono: ' + result.data);          //controllo che abbia settato il token
          //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
          self.setState({
            data: result.data
          });
        } else {
        }
      }).catch(function (error) {
        console.log(error);
      });
  }

  //richiamo l'endpoint che mi restituisce tutti i bandi di un banditore
  allBandiBanditore(MailUser) {
    let self = this;
    axios.post('/api/allBandiBanditore', {
      Mail: MailUser,
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
          //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
          console.log('i dati letti sono: ' + result.data);          //controllo che abbia settato il token
          //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
          self.setState({
            allBandi: result.data
          });
        } else {
          eventBus.addNotification('warning', 'Non hai inserito nessuna Gara!');
        }
      }).catch(function (error) {
        console.log(error);
      });
  }

  //INIZIO METODI PER IL MODAL DELLA VALUTAZIONE

  onRowSelect({ ID }, isSelected) {
    if (isSelected && this.state.FornToVal.length !== 1) {
      this.setState({
        FornToVal: [ ...this.state.FornToVal, this.state.data.filter(ID => ID == ID)].sort(),
        currPage: this.refs.table.state.currPage
      });
    } else {
      if(this.state.FornToVal.ID == ID){
        this.setState({ FornToVal: [] });
      }
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

    //costanti inizializzate per il metodo del modal di valutazione del fornitore
    const selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true,
      onSelect: this.onRowSelect.bind(this),
      onSelectAll: this.onSelectAll,
      selected: this.state.FornToVal
    };

    let dataB = [];
    if (this.state.data.length != 0) {
      dataB = this.state.data; //provvedo ad evitare che la pagina vada in errore perche' al primo render lo state non e' settato
    }
    let AllBandi = [];
    if (this.state.allBandi.length != 0) {
      AllBandi = this.state.allBandi; //provvedo ad evitare che la pagina vada in errore perche' al primo render lo state non e' settato
    }
    let condition = true;
    const LabelISOString = new Date().toISOString();
    return (
      <Page title="Banditore Pannel  Albo Fornitori - Sviluppo">
        <Row>
          <Tabs align='top'
            startTab={1}>
            <Tab title="PANNELLO BANDITORE">
              <Panel title="Pagina dove vengono visualizzate tutte le funzioni relative al Banditore">
                <Modal
                  show={this.state.primaryModal}
                  onHide={() => this.onCloseModal('primaryModal')}
                >
                  <Modal.Header closeButton className="modal-header bg-primary">
                    <Modal.Title style={{ color: '#ffffff' }}>Inserimento della Gara</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {/* <Modal type='warning' title='Modifica della Gara' isOpen={this.state.warningModal} onClose={e => this.onCloseModal('warningModal')}> */}
                    <form>
                      <div className="RegPanel">
                        <div>
                          <h5>Inserire della Gara</h5>
                          <Input
                            type='text'
                            placeholder=''
                            value={this.state.nomeBando}
                            onChange={e => this.logChangeNome(e)} />
                        </div>
                        <div>
                          <h5>Selezionare la Categoria della Gara</h5>
                          <Select
                            label="Categoria"
                            placeholder='Categoria della Gara'
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
                            onChange={(e) => this.handleChangeSelect(e)}
                          />
                        </div>
                        <div>
                          <h5>Selezionare lo stato del bando</h5>
                          <Row>
                            <Input
                              type='radio'
                              name='firstSet'
                              label='Nascosto'
                              onChange={e => { this.handleStateNascosto(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              type='radio'
                              name='firstSet'
                              label='Aperto'
                              onChange={e => { this.handleStateAperto(e) }} />
                          </Row>
                        </div>
                        <div>
                          <Row>
                            <Input
                              type='checkbox'
                              onValidate={e => true}
                              value={this.state.condition1}
                              label='Gara con esclusione tramite Rating'
                              onChange={e => { this.handleIsItCheckedEsclusione(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            {/*Questo input si attiva se la checkbox sopra viene selezionata*/}
                            <Input
                              type='text'
                              disabled={this.state.RatMinEnab}
                              label='Rating minimo'
                              placeholder='1 a 100'
                              value={this.state.minRating}
                              onChange={e => this.logChangeDataMinRating(e)} />
                          </Row>
                          <Row>
                            {/*Questa check fa in modo che il bando sia sotto invito del banditore solo per alcune aziende*/}
                            <Input
                              type='checkbox'
                              value={this.state.condition2}
                              onValidate={e => true}
                              label='Gara con invito'
                              onChange={e => { this.handleIsItCheckedInvito(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            {/*Questo input si attiva se la checkbox sopra viene selezionata*/}

                          </Row>

                        </div>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <div>
                          <h5>Descrizione della Gara - Max 300 Caratteri</h5>
                          <Textarea
                            name='textarea'
                            placeholder='inserisci la descrizione...'
                            onChange={e => this.logTextChange(e)}
                            value={this.state.descr} />
                        </div>
                        <Row>
                          <FormGroup>
                            <ControlLabel>Data Apertura dela Gara</ControlLabel>
                            <DatePicker
                              weekStartsOn={1}
                              dayLabels={spanishDayLabels}
                              monthLabels={spanishMonthLabels}
                              onChange={this.handleChangeApertura}
                              placeholder="..."
                              value={this.state.dataApertura} />
                          </FormGroup>
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          <FormGroup>
                            <ControlLabel>Data Chiusura della Gara</ControlLabel>
                            <DatePicker
                              weekStartsOn={1}
                              dayLabels={spanishDayLabels}
                              monthLabels={spanishMonthLabels}
                              onChange={this.handleChangeChiusura}
                              placeholder="..."
                              value={this.state.dataChiusura} />
                          </FormGroup>
                        </Row>
                        <Input
                          name='sogliaMax'
                          type='text'
                          label='Soglia massima di Proposta'
                          placeholder='...'
                          value={this.state.sogliaMax}
                          onChange={e => this.handleStateSogliaMax(e)} />
                        <div>
                          <h5>Selezionare la documentazione della Gara</h5>
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
                            maxFiles={3}
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

                        </div>
                      </div>
                    </form>
                    {/* </Modal> */}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button type='primary' title='Salva' onClick={e => { this.insertBando(e) }} />
                  </Modal.Footer>
                </Modal>

                <div className="Titolo del bando">
                  <Panel title="Ultimi bandi Aggiunti">
                    <div style={{ float: 'left' }}>
                      <Button type='info' title="Inserisci" onClick={e => this.onRenderModal('primaryModal', true)} />
                    </div>
                    <div>
                      <BootstrapTable className="bordered" options={options} hover={true} data={AllBandi}>
                        <TableHeaderColumn className="black-muted-bg" dataField='ID' hide={true} editable={false} width='30' isKey={true} dataSort={true} dataAlign='center'>ID</TableHeaderColumn>
                        <TableHeaderColumn className="black-muted-bg" dataField='Nome' width='auto' filter={{ type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataSort={true}>NOME</TableHeaderColumn>
                        <TableHeaderColumn className="black-muted-bg" dataField='Categoria' filter={{ type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataSort={true}>CATEGORIA</TableHeaderColumn>
                        <TableHeaderColumn className="black-muted-bg" dataField='DataCreazione' filter={{ type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataFormat={dateFormatter} dataSort={true}>CREATO IL</TableHeaderColumn>
                        <TableHeaderColumn className="black-muted-bg" dataField='Apertura' filter={{ type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataFormat={dateFormatter} dataSort={true}>APERTO IL</TableHeaderColumn>
                        <TableHeaderColumn className="black-muted-bg" dataField='Chiusura' filter={{ type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataFormat={dateFormatter} dataSort={true}>CHIUDERA IL</TableHeaderColumn>
                        <TableHeaderColumn className="black-muted-bg" dataField='OffertaMassima' filter={{ type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataFormat={priceFormatter} dataAlign='center' dataSort={true}>OFFERTA MAX</TableHeaderColumn>
                        <TableHeaderColumn className="black-muted-bg" dataField='MinRating' filter={{ type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataFormat={ratingFormatter} dataSort={true}>PUNTEGGIO MIN</TableHeaderColumn>
                        <TableHeaderColumn className="black-muted-bg" dataField='Stato' filter={{ type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataSort={true}>STATO</TableHeaderColumn>
                      </BootstrapTable>
                    </div>
                  </Panel>
                </div>
              </Panel>
            </Tab>
            <Tab title="ALBO FORNITORI">
              <Panel title='Tabella Fornitori'>

                {/*Modal per la valutazione*/}
                <Modal
                  show={this.state.valutazioneModal}
                  onHide={() => this.onCloseModal('valutazioneModal')}
                >
                  <Modal.Header closeButton className="modal-header bg-primary">
                    <Modal.Title style={{ color: '#ffffff' }}>Inserimento Valutazione</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form>
                      <Row>
                        <div>
                          <h5>Compilatore e Struttura</h5>
                          <Input
                            type='text'
                            label='Nome compilatore del Modulo'
                            placeholder='...'
                            onChange={() => this.onTextChange('firstName')}
                            value={this.state.dataValutazione.firstName} />

                          <Input
                            type='text'
                            label='Struttura di Riferimento'
                            placeholder='...'
                            onChange={(e) => this.onTextChange('lastName')}
                            value={this.state.dataValutazione.lastName} />
                        </div>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      </Row>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <div style={{ alignContent: 'center' }}>
                        <h1>VALUTAZIONE</h1>
                        <div>
                          <h5>Qualità del Servizio</h5>
                          <Row>
                            <Input
                              id='1'
                              type='radio'
                              name='firstSet'
                              label='1'
                              value='1'
                              onChange={e => { this.handleStateQualita(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='2'
                              type='radio'
                              name='firstSet'
                              label='2'
                              value='2'
                              onChange={e => { this.handleStateQualita(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='3'
                              type='radio'
                              name='firstSet'
                              label='3'
                              value='3'
                              onChange={e => { this.handleStateQualita(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='4'
                              type='radio'
                              name='firstSet'
                              label='4'
                              value='4'
                              onChange={e => { this.handleStateQualita(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='5'
                              type='radio'
                              name='firstSet'
                              label='5'
                              value='5'
                              onChange={e => { this.handleStateQualita(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </Row>
                        </div>
                        <div>
                          <h5>Tempi di Risposta e Soluzione</h5>
                          <Row>
                            <Input
                              id='1'
                              type='radio'
                              name='secondSet'
                              label='1'
                              value='1'
                              onChange={e => { this.handleStateRispSol(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='2'
                              type='radio'
                              name='secondSet'
                              label='2'
                              value='2'
                              onChange={e => { this.handleStateRispSol(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='3'
                              type='radio'
                              name='secondSet'
                              label='3'
                              value='3'
                              onChange={e => { this.handleStateRispSol(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='4'
                              type='radio'
                              name='secondSet'
                              label='4'
                              value='4'
                              onChange={e => { this.handleStateRispSol(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='5'
                              type='radio'
                              name='secondSet'
                              label='5'
                              value='5'
                              onChange={e => { this.handleStateRispSol(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </Row>
                        </div>
                        <div>
                          <h5>Prezzo</h5>
                          <Row>
                            <Input
                              id='1'
                              type='radio'
                              name='thirdSet'
                              label='1'
                              value='1'
                              onChange={e => { this.handleStatePrezz(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='2'
                              type='radio'
                              name='thirdSet'
                              label='2'
                              value='2'
                              onChange={e => { this.handleStatePrezz(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='3'
                              type='radio'
                              name='thirdSet'
                              label='3'
                              value='3'
                              onChange={e => { this.handleStatePrezz(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='4'
                              type='radio'
                              name='thirdSet'
                              label='4'
                              value='4'
                              onChange={e => { this.handleStatePrezz(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='5'
                              type='radio'
                              name='thirdSet'
                              label='5'
                              value='5'
                              onChange={e => { this.handleStatePrezz(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </Row>
                        </div>
                        <div>
                          <h5>Professionalità del Personale</h5>
                          <Row>
                            <Input
                              id='1'
                              type='radio'
                              name='fourthSet'
                              label='1'
                              value='1'
                              onChange={e => { this.handleStateProfPers(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='3'
                              type='radio'
                              name='fourthSet'
                              label='2'
                              value='2'
                              onChange={e => { this.handleStateProfPers(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='4'
                              type='radio'
                              name='fourthSet'
                              label='3'
                              value='3'
                              onChange={e => { this.handleStateProfPers(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              type='radio'
                              name='fourthSet'
                              label='4'
                              value='4'
                              onChange={e => { this.handleStateProfPers(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='5'
                              type='radio'
                              name='fourthSet'
                              label='5'
                              value='5'
                              onChange={e => { this.handleStateProfPers(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </Row>
                        </div>
                        <div>
                          <h5>Capacità Consulenziale</h5>
                          <Row>
                            <Input
                              id='1'
                              type='radio'
                              name='fifthSet'
                              label='1'
                              value='1'
                              onChange={e => { this.handleStateCapacitaPers(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='2'
                              type='radio'
                              name='fifthSet'
                              label='2'
                              value='2'
                              onChange={e => { this.handleStateCapacitaPers(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='3'
                              type='radio'
                              name='fifthSet'
                              label='3'
                              value='3'
                              onChange={e => { this.handleStateCapacitaPers(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='4'
                              type='radio'
                              name='fifthSet'
                              label='4'
                              value='4'
                              onChange={e => { this.handleStateCapacitaPers(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              id='5'
                              type='radio'
                              name='fifthSet'
                              label='5'
                              value='5'
                              onChange={e => { this.handleStateCapacitaPers(e) }} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </Row>
                        </div>
                        <div>
                          <h5>NOTE</h5>
                          <Textarea
                            name='textarea'
                            placeholder=''
                            label='Note'
                            onChange={() => this.onTextChange('textarea')}
                            value={this.state.dataValutazione.textarea} />
                        </div>
                      </div>
                    </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button type='primary' title='Salva' onClick={e => { this.insertValutazione(e) }} />
                  </Modal.Footer>
                </Modal>
                {/*FINE modal per la valutazione del fornitore*/}
                <div style={styleTabellaFornVal}>
                  <Button style={ValutaButtStyle} type='danger' title="Valuta" onClick={e => this.onRenderModal('valutazioneModal', true)} />
                  <Button style={ValutaButtStyle} type='warning' title="Dettagli" onClick={() => this.DettagliForn()} />
                  <BootstrapTable ref='table' selectRow={ selectRowProp } pagination={ true } options={ options2 } className="bordered" hover={true} data={dataB}>
                    <TableHeaderColumn className="black-muted-bg" dataField='ID' editable={false} width='90' isKey={true} dataSort={true} dataAlign='center'>ID</TableHeaderColumn>
                    <TableHeaderColumn className="black-muted-bg" dataField='Nome' filter={{ type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataSort={true}>NOME FORNITORE</TableHeaderColumn>
                    <TableHeaderColumn className="black-muted-bg" dataField='IVAForn' filter={{ type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataSort={true}>P.IVA</TableHeaderColumn>
                    <TableHeaderColumn className="black-muted-bg" dataField='NomeBando' filter={{ type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataSort={true}>NOME DEL BANDO</TableHeaderColumn>
                    <TableHeaderColumn className="black-muted-bg" dataField='Candidatura' filter={{ type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataSort={true}>STATO CANDIDATURA</TableHeaderColumn>
                    <TableHeaderColumn className="black-muted-bg" dataField='Rating' filter={{ type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataFormat={ratingFormatterForn} dataSort={true}>RATING MEDIO</TableHeaderColumn>
                  </BootstrapTable>
                </div>
              </Panel>
            </Tab>
          </Tabs>
        </Row>
      </Page>
    );
  }
}
