import React from 'react';

import { Row, Col } from 'react-flex-proto';
import { Page, Panel, Button, Breadcrumbs,Textarea, Input, Switch, Table,Tabs, Tab, TableHead, TableBody, TableRow,EditableText,eventBus } from 'react-blur-admin';
import { Link,browserHistory } from 'react-router';
import { Modal, Select } from 'react-bootstrap';

import axios from 'axios';

//DatePicker
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import DatePicker from 'react-bootstrap-date-picker';

const spanishDayLabels = [ 'Lun', 'Mar', 'Mer', 'Gio', 'Ved', 'Sab','Dom'];
const spanishMonthLabels = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

//FilePond - -Caricamento Documenti
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

import _ from 'lodash';
import star from 'public/star.png';





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
    }else{
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
            }else {
              if(cell== null){
                return <div>Non valutato</div>;
              }
            }
      }
    }
  }
}
}
}


export class BanditoreDettaglioBando extends React.Component {
  constructor(props) {
          super(props)
          this.state = {
              warningModal: false,
              dangerModal: false,
              primaryModal: false,
              vincitoreModal: false,
              data: [{
                ID: 1,
                Nome: 'Elemento di Test',
                IVAForn: '0000',
                Candidatura: 'in attesa',
              }],
              FilesName: [],
              currentFiles: [],
              //bando selezionato
              bandoSel: this.props.location.state.rowSel,
              //modal
              ID: this.props.location.state.rowSel.ID,
              nomeBando: this.props.location.state.rowSel.Nome,
              categoria: this.props.location.state.rowSel.Categoria,
              dataCreazione: this.props.location.state.rowSel.DataCreazione,
              dataApertura: this.props.location.state.rowSel.Apertura,
              dataChiusura: this.props.location.state.rowSel.Chiusura,
              descr: this.props.location.state.rowSel.Descr,
              sogliaMax: this.props.location.state.rowSel.OffertaMassima,
              minRating: this.props.location.state.rowSel.MinRating,
              stato: this.props.location.state.rowSel.Stato,
              Raperto: false,
              Rchiuso: false,
              EsclGara: "",
              GarInvit: "",
              EsclGaradefault: "",  //check
              InvitGaradefault: true, //
              partecipForn: [],
              InvitButt: false,
              MinratInput: "",

              //state per il modal modifica
              nomeBandoUp:"",
              categoriaUp:"",
              dataCreazioneUp:"",
              dataAperturaUp:"",
              dataChiusuraUp:"",
              descrUp:"",
              sogliaMaxUp:"",
              minRatingUp:"",
              statoUp:"",
              RapertoUp: false,
              RchiusoUp: false,

              //mail per inviare gli inviti ai bandi
              MailsForInvito: [],
              FornInviting:[],
          }
          this.handleChangeApertura = this.handleChangeApertura.bind(this);
          this.handleChangeChiusura = this.handleChangeChiusura.bind(this);
          this.options = {
            onRowClick: (row) => {
              //questa funzione gestisce il click nella tabella della lista dei bandi
              //alert(`You click row id: ${row.IdForn}`);
              browserHistory.push({
                  pathname: '/banditore-istruttoria',
                  state:{ rowFornSel: row,
                          dettPartecip: this.state.partecipForn,
                          bando: this.props.location.state.rowSel,
                      }});
            },
            onRowDoubleClick: function(row) {
              alert(`You double click row id: ${row.ID}`);
            }
          };
  }

  

  handleChangeApertura(date) {
    this.setState({
    dataAperturaUp: date
    });
  }
  handleChangeChiusura(date) {
    this.setState({
    dataChiusuraUp: date
    });
  }

  onTextChange(type,e){
    let value = e.target.value;
    if(type == 'descrizione'){
      this.setState({
        descr: value,
      });
    }
  }

  //handle per il modal della modifica
  handleChangeAperturaUp(date) {
    this.setState({
      dataAperturaUp: date
    });
  }
  handleChangeChiusuraUp(date) {
    this.setState({
      dataChiusuraUp: date
    });
  }

  onTextChangeUp(type,e){
    let value = e.target.value;
    if(type == 'descrizione'){
      this.setState({
        descrUp: value,
      });
    }
  }

  //handle select categoria
  handleChangeSelectUp(e){
    let value = e;
    this.setState({
      categoriaUp: value,
    });
  }



  //prendo il manage del campo ChangeNome
  logChangeNomeUp(e) {
      this.setState({ nomeBandoUp : e.target.value });
  }
  logTextChangeUp(e){
    this.setState({ descrUp : e.target.value});
  }

  handleStateNascostoUp(e){
    this.setState({ statoUp : 'Nascosto'});
  }
  handleStateApertoUp(e){
    this.setState({ statoUp : 'Aperto'});
  }


  onCloseModal(modalName) {
    this.setState({ [modalName]: false });
  }

  onCloseModal(modalName) {
    this.setState({ [modalName]: false });
  }

  //handle per gestire la apertura e la chiusura del modal
  onRenderModal(modalName,value) {
    this.setState({ [modalName]: true });
  }

  //handle select categoria
  handleChangeSelect(e){
    let value = e;
    this.setState({
      categoria: value,
    });
  }



  //prendo il manage del campo ChangeNome
  logChangeNome(e) {
      this.setState({ nomeBando: e.target.value });
  }
  logTextChange(e){
    this.setState({ descr: e.target.value});
  }

  handleStateNascosto(e){
    this.setState({ stato: 'Nascosto'});
  }
  handleStateAperto(e){
    this.setState({ stato: 'Aperto'});
  }

  //handle per gestire il check del rating
  handleIsItChecked(type,e){
    let self = this;
    if(type == 'rating'){
      if(e){
        self.setState({
          EsclGara: "checked",
          MinratInput: false,
        });
      }else{
        self.setState({
          EsclGara: "",
          MinratInput: true,
        })
      }
    }else{
      if(e){
        self.setState({
          GarInvit: "checked",
        })
      }else{
        self.setState({
          GarInvit: "",
        })
      }
    }
  }



  handleStateSogliaMax(e){
    this.setState({ sogliaMax: e.target.value});
  }

  logChangeDataMinRating(e) {
      this.setState({ minRating: e.target.value });
  }

  componentWillMount(){
    const MailUser = localStorage.getItem('userMail');
    //setto gli state per il modal modifica
    this.setState({
      nomeBandoUp: this.state.nomeBando,
      categoriaUp: this.state.categoria,
      dataCreazioneUp: this.state.dataCreazione,
      dataAperturaUp: this.state.dataApertura,
      dataChiusuraUp: this.state.dataChiusura,
      descrUp: this.state.descr,
      sogliaMaxUp: this.state.sogliaMax,
      minRatingUp: this.state.minRating,
      statoUp: this.state.stato,
      RapertoUp: this.state.Raperto,
      RchiusoUp: this.state.Rchiuso,
    })
    
    //controllo se il rating minimo è diverso da 0 se lo è spunto il check relativo
    if(this.state.minRating != 0){
      this.setState({
        EsclGara : "checked",
        EsclGaraUp : "checked"
      })
    }
    
    this.getFileNames();
    this.getFornForInvito();    //prendo i fornitori papabili che potrei invitare alla gara secondo la categoria del bando
    this.getPartecip(MailUser);
    if(this.state.stato == 'Nascosto'){
      this.setState({
        Rchiuso : true,
        RchiusoUp : true,
      })
    }else{
      this.setState({
        Raperto : true,
        RapertoUp : true,
      })
    }
  }

  //funzione che mi permette di prelevareare i file con il proprio nome e scaricarli come file per l'utente che li deve visionare
  getFileNames(){
    console.log(this.state.ID);
    let self = this;
    //inserisco la valutazione assegnata al fornitore
    axios.post('/api/getDocuAnalisiBando', {
      IdBando: this.state.ID,
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
          self.setState({
            FilesName: result.data
          })
        } else {
          eventBus.addNotification('warning', "Attenzione, il caricamento dei documenti non è avvenuto correttamente o non ci sono documenti per questo bando! ");
          return false;
        }
      }).catch(function (error) {
        console.log(error);
      });
  }

  async downloadFiles(fileName){
    var FileSaver = require('file-saver');
    await axios({
      url: 'http://10.60.11.31:8080/public/uploadsDoc/' + fileName,
      method: 'GET',
      responseType: 'arraybuffer', // important
      timeout: '30000',
    }).then((response) => {
      //controllo se l'errore è dovuto al server e in caso affermativo lo segnalo in console
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      //qui controllo se ho ricevuto dati
      if (response.data.length != 0) {   //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
        console.log('i dati del file letto sono: ' + response.data);
        FileSaver.saveAs(new Blob([response.data]));
      } else {
        eventBus.addNotification('error', "Attenzione, il caricamento dei documenti non è avvenuto correttamente, contattare l'assistenza! ");
        return false;
      }
    });
  }

  //funzione che mi permette di salvare i file con nome MailBando+IDBando+nomeFile
  deleteFiles(files){
    //inserisco la valutazione assegnata al fornitore
    let self = this;
    axios.post('/api/gesDoc', {
      data: files,
      Mail: self.state.MailUser,  //passo anche la mail così nella funzione finale che viene eseguita nell'api posso creare il nome del file unendo i due parametri
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
          console.log('i files del banditore sono salvati: ' + result.data);          //controllo che abbia salvato i files
        } else {
          console.log('i files del banditore non sono salvati: ' + result.data);          //controllo che abbia salvato i files
          return false;
        }
      }).catch(function (error) {
        console.log(error);
      });
  }

  //funzione per prendere i dettagli del bando e metterlo nella lista sopra ai bottoni modifica e elimina
  getPartecip(MailUser){
    let self = this;
    axios.post('/api/getPartecip', {
      Mail: MailUser,
      IdBando: self.props.location.state.rowSel.ID,
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
          console.log('i dati letti sono: '+result.data);          //controllo che abbia settato il token
          //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
          self.setState({
            partecipForn: result.data
          });
      }else {
        eventBus.addNotification('warning',"Non ci sono Fornitori iscritti a questo bando!")
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  //funzione per prendere i dettagli del bando e metterlo nella lista sopra ai bottoni modifica e elimina
  getBandoInfo(){
    let self = this;
    event.preventDefault(); //non ricarico la pagina una volta fatto il submit
    fetch("/api/updateBando", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(this.state.ID)
    }).then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
          //alert("c'è stato un errore nel salvataggio del bando");
        }
        return response.json();
    }).then(function(data) {
        console.log(data)
        if(data.affectedRows == 1){                               //controllo che la query del bando sia avvenuta con successo
            //inserisco i campi inseriti da andrea per il display del bando
        }else{
           eventBus.addNotification('error','Abbiamo riscontrato problemi nella modifica del bando, riprovare!');
        }
    }).catch(function(err) {
        console.log(err)
    });
  }

  //aggiorna i dati contenuti nel modal con quelli che sono stati presi dal server in caso venga effettuato un update con il button dedicato
  updateBandoFun(){
    const MailUser = localStorage.getItem('userMail');
    this.updateBando();
    //setto gli state per il modal modifica dopo che ho fatto l'aggiornamento del record
    this.setState({
      nomeBando: this.state.nomeBandoUp,
      categoria: this.state.categoriaUp,
      dataCreazione: this.state.dataCreazioneUp,
      dataApertura: this.state.dataAperturaUp,
      dataChiusura: this.state.dataChiusuraUp,
      descr: this.state.descrUp,
      sogliaMax: this.state.sogliaMaxUp,
      minRating: this.state.minRatingUp,
      stato: this.state.statoUp,
      Raperto: this.state.RapertoUp,
      Rchiuso: this.state.RchiusoUp,
    })
    this.onCloseModal('warningModal');
  }

//aggiorno il bando dopo aver dato conferma nel modal. aggiornamento fisico con conseguente modifica dei dati nel db
updateBando(){
  let self = this;
    const MailUser = self.state.MailUser;
    event.preventDefault(); //non ricarico la pagina una volta fatto il submit
    var data = {
      ID: this.props.location.state.rowSel.ID,
      nome: this.state.nomeBandoUp,
      categoria: this.state.categoriaUp,
      descr: this.state.descrUp,
      dataApertura: this.state.dataAperturaUp.substring(0, this.state.dataAperturaUp.indexOf('T')),
      dataChiusura: this.state.dataChiusuraUp.substring(0, this.state.dataChiusuraUp.indexOf('T')),
      sogliaMax: this.state.sogliaMaxUp,
      minRating: this.state.minRatingUp,
      stato: this.state.statoUp,
      mailBand: MailUser,
    }
    console.log(data)
    fetch("/api/updateBando", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
          //alert("c'è stato un errore nel salvataggio del bando");
        }
        return response.json();
    }).then(function(data) {
        console.log(data)
        if(data.affectedRows == 1){                               //controllo che la registrazione del bando sia avvenuta con successo se si
          eventBus.addNotification('success', 'Bando modificato Correttamente')
        }else{
           eventBus.addNotification('error','Abbiamo riscontrato problemi nella modifica del bando, riprovare!');
        }
    }).catch(function(err) {
        console.log(err)
    });
}

//cancellazione del bando
deleteBando(){
  let self = this;
    axios.post('/api/deleteBando', {
      ID: self.props.location.state.rowSel.ID,
    })
    .then( (response) => {
      //const res = response.clone();
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response;
    }).then(function (result){
      //elimino il bando e torno indietro di una pagina
      //console.log("risultato" + result);
      if (result.data.length != 0) {
        eventBus.addNotification('success','Bando eliminato definitivamente!');
        browserHistory.push('/banditore-pannel');
      }else {
        eventBus.addNotification('error','Non sono riuscito ad eliminare il bando!');
      }
      //torno indietro di una pagina
    }).catch(function (error) {
      console.log(error);
    });
}

//selezione del viincitore
selectVincitore(){
  let self = this;
  axios.post('/api/selectVincitore', {
    IdBando: self.props.location.state.rowSel.ID,
    IdForn: self.props.location.state.rowSel.ID,
  })
  .then( (response) => {
    //const res = response.clone();
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response;
  }).then(function (result){
    //elimino il bando e torno indietro di una pagina
    //console.log("risultato" + result);
    if (result.data.length != 0) {
      eventBus.addNotification('success','vincitore selezionato!');

    }else {
      eventBus.addNotification('error','Non sono riuscito a selezionare il vincitore!');
    }
    //torno indietro di una pagina
  }).catch(function (error) {
    console.log(error);
  });
}

//selezione del viincitore
getFornForInvito(){
  let self = this;
  axios.post('/api/getFornForInvito', {
    IdBando: self.props.location.state.rowSel.ID,
  })
  .then( (response) => {
    //const res = response.clone();
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response;
  }).then(function (result){
    //elimino il bando e torno indietro di una pagina
    //console.log("risultato" + result);
    if (result.data.length != 0) {
      self.setState({
        FornInviting: result.data
      });
    }else {
      eventBus.addNotification('error','Non sono riuscito a selezionare il vincitore!');
    }
    //torno indietro di una pagina
  }).catch(function (error) {
    console.log(error);
  });
}

//richiamo l'endpoint che mi restituisce tutti i fornitori che hanno aderito ai bandi del banditore corrente
sendMail(MailUser) {
  let self = this;
  //mappare per utente
  axios.post('/api/sendMail', {
    Mail: MailUser,
  })
  .then( (response) => {
    //const res = response.clone();
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response;
  }).then(function (result){
    //console.log("risultato" + result);
    if (result.data) {                                                 //diverso da null se ricevo una risposta altrimenti do un alert di reinserimento dati
       //omettiamo il controllo del valore della variabile userToken andando a resettarla per assicurarci che sia il primo accesso
        console.log('Mail di notifica inviate con successo: '+result.data);          //controllo che abbia settato il token
        eventBus.addNotification('success', 'Mail di norifica inviate correttamente');
        //inserisco i valori del fornitore in un array che utilizzero poi nei campi di visualizzazione del medesimo
        self.setState({
          data: result.data
        });
    }else {
      eventBus.addNotification('alert', 'Mail di norifica non inviate correttamente');
    }
  }).catch(function (error) {
    console.log(error);
  });
}

//richiamo l'endpoint che mi restituisce tutti i fornitori che hanno aderito ai bandi del banditore corrente
sendMailInvito() {
  let self = this;

  //Invio le mail a tutte le persone selezionate
  this.state.MailsForInvito.map((p, i) => {
    self.sendMail(p);
  })
  
  this.onCloseModal('primaryModal'); //chiudo il modal per l'invito che ho aperto con il button invita
}

  renderBreadcrumbs() {
    return (
      <Breadcrumbs>
        <Link to='/banditore-pannel'>
          Pannello Banditore
        </Link>
          Dettaglio del Bando
      </Breadcrumbs>
    );
  }

  onRowSelect(row, isSelected, e) {
    //questa funzione gestisce il select nella tabella
    //controllo se la riga è già nel vettore che contiene le mail a cui inviare la notifica
    if(this.state.MailsForInvito.indexOf(row["Mail"])!=-1){
      //rimuovo l'elemento
      this.state.MailsForInvito.splice(this.state.MailsForInvito.indexOf(row["Mail"]),1); 
    }else{
      //aggiungo un elemento
      this.setState({
        MailsForInvito: [...this.state.MailsForInvito, row["Mail"]]
      })
    }
    /*let rowStr = '';
    for (const prop in row) {
      rowStr += prop + ': "' + row[prop] + '"';
    }
    console.log(e);
    alert(`is selected: ${isSelected}, ${rowStr}`);*/
  }
  
  onSelectAll(isSelected, rows) {
    alert(`is select all: ${isSelected}`);
    if (isSelected) {
      alert('Current display and selected data: ');
    } else {
      alert('unselect rows: ');
    }
    for (let i = 0; i < rows.length; i++) {
      alert(rows[i].id);
    }
  }
  
  //-----------------------------------CORPO DELLA PAGINA ( FRONT-END )-----------------------
  render() {

    const LabelISOString = new Date().toISOString();

    let dataB = [];
    if(this.state.data.length != 0){
       dataB = this.state.partecipForn; //provvedo ad evitare che la pagina vada in errore perche' al primo render lo state non e' settato
    }
    let FornInviting = [];
    if(this.state.data.length != 0){
       FornInviting = this.state.FornInviting; //provvedo ad evitare che la pagina vada in errore perche' al primo render lo state non e' settato
    }

    const selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true,
      bgColor: 'rgb(238, 193, 213)',
      onSelect: this.onRowSelect.bind(this)
    }

    return (
    <Page actionBar={this.renderBreadcrumbs()} title="Dettaglio Offerta:">
          <Panel>
            {/*Modal per la chiusura e nomina vincitore*/}
            <Modal
             show={this.state.vincitoreModal}
             onHide={() => this.onCloseModal('vincitoreModal')}
            >
              <Modal.Header closeButton className="modal-header bg-primary">
                  <Modal.Title style={{color:'#ffffff'}}>Nomina vincitore</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <FormGroup>
                  <ControlLabel>Seleziona il Vincitore</ControlLabel>
                  {this.state.partecipForn.map((p, i) => {
                    if(p.Candidatura == 'Approvata'){
                      <FormControl componentClass="select">
                        <option>{p[i].Mail}</option> //Scrivici un commento - Per Vittorio
                      </FormControl>
                    }
                  })}
                </FormGroup>
              </Modal.Body>
              <Modal.Footer>
                  <Button type='info' onClick={this.submit} title='Nomina' onClick={() => this.selectVincitore()}/>
                </Modal.Footer>
            </Modal>
            {/*Modal per Invitare i fornitori ad una Gara*/}
            <Modal
             show={this.state.primaryModal}
             onHide={() => this.onCloseModal('primaryModal')}
            >
              <Modal.Header closeButton className="modal-header bg-primary">
                  <Modal.Title style={{color:'#ffffff'}}>Gara con Invito</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/*<FormGroup>
                  <ControlLabel>Invita</ControlLabel>
                  <FormControl componentClass="select" multiple>
                    {this.state.MailsForInvito.map((p, i) => {
                        <FormControl componentClass="select">
                          <option>Nome: {p[i].NomeForn} - Mail: {p[i].Mail}</option>
                        </FormControl>
                    })}
                  </FormControl>
                </FormGroup>*/}
                <div>
                  <BootstrapTable className="bordered" data={ FornInviting } selectRow={ selectRowProp }>
                    <TableHeaderColumn className="" dataField='IdForn' hide={true} editable={false} width='0' isKey={true} dataSort={ true } dataAlign='center'>ID</TableHeaderColumn>
                    <TableHeaderColumn className="" dataField='NomeForn' width='auto' filter={ { type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataSort={ true }>Nome Fornitore</TableHeaderColumn>
                    <TableHeaderColumn className="" dataField='Mail' filter={ { type: 'TextFilter', delay: 1000, placeholder: 'Cerca...'  }} dataAlign='center' dataSort={ true }>Mail</TableHeaderColumn>
                    <TableHeaderColumn className="" dataField='AreaServizio' filter={ { type: 'TextFilter', delay: 1000, placeholder: 'Cerca...'  }} dataAlign='center'  dataSort={ true }>Zona Servizio</TableHeaderColumn>
                    <TableHeaderColumn className="" dataField='SubAreaServizio' filter={ { type: 'TextFilter', delay: 1000, placeholder: 'Cerca...'  }} dataAlign='center'   dataSort={ true }>Sub Area Servizio</TableHeaderColumn>
                    <TableHeaderColumn className="" dataField='Rating' filter={ { type: 'TextFilter', delay: 1000, placeholder: 'Cerca...'  }} dataAlign='center'  dataFormat ={ratingFormatter}  dataSort={ true }>Valutazione</TableHeaderColumn>
                  </BootstrapTable>
                </div>
              </Modal.Body>
              <Modal.Footer>
                  <Button type='primary' title='Conferma & Invia' onClick={() => this.sendMailInvito()}/>
                </Modal.Footer>
            </Modal>
            {/*Modal per l'eliminazione della gara Gara*/}
            <Modal
             show={this.state.dangerModal}
             onHide={() => this.onCloseModal('dangerModal')}
            >
              <Modal.Header closeButton className="modal-header bg-danger">
                  <Modal.Title style={{color:'#ffffff'}}>Elimina la gara</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              Sei sicuro di voler eliminare in maniera definitiva il bando: {this.state.nomeBando} ?
              </Modal.Body>
              <Modal.Footer>
                  <Button type='danger' onClick={this.submit} title='Elinima' onClick={() => this.deleteBando()}/>
                </Modal.Footer>
            </Modal>
            <Modal
              show={this.state.warningModal}
              onHide={() => this.onCloseModal('warningModal')}
            >
            <Modal.Header closeButton className="modal-header bg-warning">
                <Modal.Title style={{color:'#ffffff'}}>Modifica della Gara</Modal.Title>
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
                          value={this.state.nomeBandoUp}
                          onChange={e => this.logChangeNomeUp(e)}/>
                    </div>
                        <div>
                        <h5>Selezionare lo stato del bando</h5>
                          <Row>
                            <Input
                              type='radio'
                              name='firstSet'
                              label='Nascosto'
                              onChange={e => {handleStateNascostoUp(e)}}
                              defaultChecked = {this.state.RchiusoUp}
                              valueSelected = {this.state.RchiusoUp} />
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <Input
                              type='radio'
                              name='firstSet'
                              label='Aperto'
                              onChange={e => {handleStateApertoUp(e)}}
                              defaultChecked = {this.state.RapertoUp}
                              valueSelected = {this.state.RapertoUp} />
                          </Row>
                          </div>
                          <div>
                            <Row>
                              <Input
                                name='garaEsclu'
                                type='checkbox'
                                label='Gara con esclusione'
                                onChange={e => {this.handleIsItCheckedUp('rating',e)}}
                                checked={this.state.EsclGaraUp}
                                value={this.state.EsclGaraUp}
                                defaultChecked={this.state.EsclGaraUp}
                              />
                              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                              {/*Questo input si attiva se la checkbox sopra viene selezionata*/}
                              <Input
                                type='text'
                                disabled={this.state.MinratInputUp}
                                label='Rating minimo'
                                placeholder='1 a 100'
                                value={this.state.minRatingUp}
                                onChange={e => this.logChangeDataMinRatingUp(e)} />
                            </Row>
                          </div>
                          <div>
                            <h5>Descrizione della Gara - Max 300 Caratteri</h5>
                            <Textarea
                              name='textarea'
                              placeholder='inserisci la descrizione...'
                              onChange={e => this.onTextChangeUp('descrizione', e)}
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
                                  value={this.state.dataAperturaUp} />
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
                                value={this.state.dataChiusuraUp} />
                            </FormGroup>
                          </Row>
                          <Input
                            type='text'
                            label='Soglia massima di Proposta'
                            placeholder='...'
                            value={this.state.sogliaMaxUp}
                            onChange={e => this.logChangeSogliaMaxUp(e)}/>
                          <div>
                            <h5>Selezionare la documentazione della Gara</h5>
                            <FilePond
                              allowMultiple={true}/>
                          </div>
                  </div>
            </form>
            {/* </Modal> */}
            </Modal.Body>
            <Modal.Footer>
                <Button type='warning' onClick={this.submit} title='Salva' onClick={() => this.updateBandoFun()}/>
              </Modal.Footer>
              </Modal>
      <Panel title="Informazioni generali">
      <Row>
        <Col>
          <Panel title="Info - Base">
            <ul>
              <li><h3><i>Nome della Gara:</i> {this.state.nomeBando}</h3></li>
              <li><h3><i>Creato da: "Utente Loggato", il:</i> {this.state.dataCreazione.substring(0, this.state.dataCreazione.indexOf('T'))}</h3></li>
            </ul>
            <div style={{float:'right'}}>
              <Button type='info' title="Nomina Vincitore" onClick={e => this.onRenderModal('vincitoreModal',true)} />
            </div>
          </Panel>
          <Panel title="Info - Date">
            <ul>
              <li><h3><i>Data di Apertura:</i> {this.state.dataApertura.substring(0, this.state.dataCreazione.indexOf('T'))}</h3></li>
              <li><h3><i>Data di Chiusura:</i> {this.state.dataChiusura.substring(0, this.state.dataCreazione.indexOf('T'))}</h3></li>
              <li><h3><i>Stato della Gara:</i> {this.state.stato}</h3></li>
            </ul>
          </Panel>
        </Col>
      </Row>
      <div>
        <Panel title="Descrizione:">
          <h3>{this.state.descr}</h3>
        </Panel>
      </div>
      <div>
        <Panel title="Documentazione allegata:">
          <ul>
          {this.state.FilesName.map((p, i) => {
                  return <h3><li>Nome del file {i}: <Link onClick={() => this.downloadFiles(p.Titolo)}>{p.Titolo}</Link></li></h3>;
          })}
          </ul>
        </Panel>
      </div>
        <div style={{float:'right'}}>
          <Button type='info' title="Invita" disabled = {this.state.InvitButt} onClick={e => this.onRenderModal('primaryModal',true)} />
        </div>
        <div style={{float:'right'}}>
          <Button type='warning' title="Modifica" onClick={e => this.onRenderModal('warningModal',true)} />
        </div>
        <div style={{float:'right'}}>
          <Button type='danger' title="Elimina" onClick={e => this.onRenderModal('dangerModal',true)} />
        </div>
      </Panel>
    <div>
      <Panel title ="Riepilogo Fornitori aderenti al bando">
        <div>
          <BootstrapTable className="bordered" options={ this.options } hover={ true }  data={ dataB }>
            <TableHeaderColumn className="black-muted-bg" dataField='IdForn' editable={false} width='50' isKey={true} dataSort={ true } dataAlign='center'>ID</TableHeaderColumn>
            <TableHeaderColumn className="black-muted-bg" dataField='NomeForn' filter={ { type: 'TextFilter', delay: 1000,placeholder: 'Cerca...' }}  dataAlign='center' dataSort={ true }>NOME FORNITORE</TableHeaderColumn>
            <TableHeaderColumn className="black-muted-bg" dataField='IVAForn' filter={ { type: 'TextFilter', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataSort={ true }>P.IVA</TableHeaderColumn>
            <TableHeaderColumn className="black-muted-bg" dataField='Candidatura' filter={ { type: 'TextFilter', filterText: 'Cerca', delay: 1000, placeholder: 'Cerca...' }} dataAlign='center' dataSort={ true }>STATO CANDIDATURA</TableHeaderColumn>
          </BootstrapTable>
        </div>
      </Panel>
    </div>
          </Panel>
    </Page>
    );
  }
}
