import React from 'react';

import { Row, Col } from 'react-flex-proto';
import { Page, Panel, Modal, Button, Breadcrumbs, Input, Select, Switch, Tabs, Tab, Table, TableHead,TableBody, TableRow } from 'react-blur-admin';
import { Link } from 'react-router';
import _ from 'lodash';

export class ProfiloAzienda extends React.Component {

  render() {
    return (
    //  {this.renderCustomizedModals()}
    <Page title="Profilo Privato Aziendale - Sviluppo">
      <Tabs
        align='top'
        startTab={2} >
      <Tab title = "PROFILO PRIVATO AZIENDALE">
        <Panel title = "Dati Generali Utente">
          <ul>
            <h5><li>Nome Referente: </li></h5>
            <h5><li>Cognome Referente: </li></h5>
            <h5><li>Ruolo Referente: </li></h5>
            <h5><li>Email(aziendale): </li></h5>
            <h5><li>Numero di Telefono(aziendale): </li></h5>
          </ul>
        </Panel>

      <Row>
        <div>
          <Panel title = "Dati Generici Azienda">
            <ul>
              <h5><li>Nome dell'Azienda: </li></h5>
              <h5><li>P.Iva: </li></h5>
              <h5><li>Forma Giuridica: </li></h5>
              <h5><li>PEC: </li></h5>
              <h5><li>Sito Web:</li></h5>
            </ul>
          </Panel>
        </div>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <div>
          <Panel title = "Dati Anagrafica Tributaria e CCIAA Azienda">
            <ul>
              <h5><li>ATECO: </li></h5>
              <h5><li>Comune CCIAA: </li></h5>
              <h5><li>NUmero CCIAA: </li></h5>
            </ul>
          </Panel>
        </div>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <Panel title = "Dati Generici Azienda">
          <ul>
            <h5><li>Nome dell'Azienda: </li></h5>
            <h5><li>P.Iva: </li></h5>
            <h5><li>Forma Giuridica: </li></h5>
            <h5><li>PEC: </li></h5>
            <h5><li>Sito Web:</li></h5>
          </ul>
        </Panel>
        <Panel title = "Dati Anagrafica Tributaria e CCIAA Azienda">
          <ul>
            <li>ATECO: </li>
            <li>Comune CCIAA: </li>
            <li>NUmero CCIAA: </li>
          </ul>
        </Panel>
      </Row>
      <Row>

      </Row>
      </Tab>
      <Tab title = "PARTECIPAZIONE BANDI">
        <Panel title = "Lista bandi con aderenza">
          <Table>
            <TableHead>
              <th>Titolo</th>
              <th>Tipologia</th>
              <th>Breve descrizione</th>
              <th>Data di apertura</th>
              <th>Data di scadenza</th>
              <th>Offerta Massima</th>
              <th>Num. Partecipanti</th>
              <th>Banditore</th>
              <th>Esito</th>
            </TableHead>
            <TableBody>
              <TableRow >
                <td>Creazione Infrattruttura Ospedaliera</td>
                <td>Edilizia</td>
                <th>Costruzione nuovo impianto Ospedaliero nei pressi della riviera Anconetana</th>
                <td>10/05/2017</td>
                <td>18/10/2018</td>
                <td>10.000</td>
                <td>12</td>
                <td> s.r.l.</td>
                <td>APPROVATO</td>
              </TableRow>
            </TableBody>
          </Table>
        </Panel>
      </Tab>
    </Tabs>
    </Page>
    );
  }
}
