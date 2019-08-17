import React from 'react';

import { Row, Col } from 'react-flex-proto';
import { Page, Panel, Modal, Button, Breadcrumbs, Input, Select, Switch, Table,Tabs, Tab, TableHead, TableBody, TableRow,EditableText } from 'react-blur-admin';
import { Link,browserHistory } from 'react-router';


import _ from 'lodash';
import star from 'public/star.png';

export class DettaglioBando extends React.Component {

  state = {
    successModal: false,
    warningModal: false,
    dangerModal: false,
    infoModal: false,
    primaryModal: false,
    switches: [true, false],
  }


  onCloseModal(modalName) {
    this.setState({ [modalName]: false });
  }

  onRenderModal(modalName) {
    this.setState({ [modalName]: true });
  }

  onSwitchChange(index) {
    let switches = _.assign({}, this.state.switches);
    switches[index] = !switches[index];
    this.setState({ switches });
  }

  renderCustomizedModals() {
    return (
      <div>
        <Modal type='info' buttonText='Login' title='Login/Registrati' isOpen={this.state.customizedModal} onClose={e => this.onCloseModal('customizedModal')}>
          <Row>
            <Col align='center'>
              Qui ci va la form di Login e/o di Registrazione
            </Col>
          </Row>

            <Col>

                <Input
                  onChange={e => this.onTextChange('firstName', e)}
                  label='Nome Utente'
                  value={this.state.firstName} />


                <Input
                  onChange={e => this.onTextChange('lastName', e)}
                  label='Password'
                  value={this.state.lastName} />

            </Col>

        </Modal>
        </div>
    );
  }

  render() {
    return (
    //  {this.renderCustomizedModals()}
    <Page title="Dettaglio Offerta: Creazione Infrattruttura Ospedaliera  - Sviluppo">
          <Panel title="Creazione Infrattruttura Ospedaliera">
                  <Table>
                    <TableHead>
                      <th>Titolo</th>
                      <th>Tipologia</th>

                      <th>Data di apertura</th>
                      <th>Data di scadenza</th>
                      <th>Offerta Massima</th>
                      <th>Num. Partecipanti</th>
                      <th>Banditore</th>
                      <th>Rating minimo</th>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <td>Creazione Infrattruttura Ospedaliera</td>
                        <td>Edilizia</td>

                        <td>10/05/2017</td>
                        <td>18/10/2018</td>
                        <td>10.000</td>
                        <td>12</td>
                        <td> s.r.l.</td>
                        <td className='align-right'>2<img src={star}/></td>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Panel title="Descrizione">
                    <ul>
   <li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li>
   <li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li>
   <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li>
   <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li>
</ul>

                    <p>
                      Dicam intellegat duo an. Unum docendi no eos, ea has purto homero epicurei. Doming maiorum ius et, et tantas soluta fabellas vel. Ea modus saperet vix, lucilius perpetua has ut. Ut cibo labore cum. Consul populo mea ei.

Ut etiam facilisis vis, doming tritani mei ea. No sed regione ceteros praesent, id placerat insolens reprimique mei. Vocibus epicuri no quo, vero dignissim scriptorem ut ius. Ut pri tacimates eleifend, his id aeterno recteque. Unum laudem dicunt pro te, euripidis concludaturque id sit.

Tibique corrumpit ex vix, agam vero deseruisse quo ut. Atqui philosophia his in, est ei quidam nonumes sadipscing. No duo adhuc salutatus, mea eu clita necessitatibus. Id pro vero everti fuisset, idque malis no eos, sed an dico reprimique. Ne usu assum congue discere. Summo tamquam intellegebat qui eu, mei facilisis imperdiet eu, eos id possit graeco recusabo. Pro ea stet reque civibus, error maiestatis conclusionemque ad est.

An dolores pertinacia quo, nec ad debet nemore ornatus. Usu et dicant integre, vix eu ferri consectetuer. Viderer moderatius dissentias nam ne. Id dolorum omittantur mea, sit ei graeco aeterno recusabo.

Et has tamquam comprehensam, eos congue ornatus et. Sea tota nonumy eu. Stet vitae an mei, et pri quod ullum. Vix nobis tritani dissentiunt ei, augue iisque placerat an vim, ex eum tollit omittam. Per ei rebum populo, ius an summo ancillae sensibus, duo quot zril appareat in. Sea autem justo dolor ea, detraxit platonem in sit, alia partem inermis has ea. Feugiat laoreet ut per, malis voluptatibus ei ius, vim ut atqui comprehensam.

Ut idque tractatos voluptaria ius, eos commodo accumsan ei. Agam honestatis eam ei, eam minim alienum an, delectus incorrupte id pro. Vim et legere semper, ne vim veri dicam. Ei usu mucius corpora facilisi. An vis veri tritani philosophia, vim ridens vivendum intellegam ei.

Ad everti vocent sensibus vim. Per dicit ancillae ne. Per nonumes constituto ne, et probo forensibus mei. Ne habeo utroque accommodare qui.

Eu solet suscipit expetendis pri, diam illum eam an. Vel praesent contentiones eu, ne usu errem iudico. Albucius accusamus mea ad, vis nominati partiendo et. Ex nisl perfecto est, nam diam reprimique complectitur eu, sit ut dicit delenit. Sea dicant aliquam prodesset eu, agam dolor liberavisse mea ut, vim suas evertitur ne.

Eos ne movet nemore hendrerit, ea eam possit volutpat gloriatur. Consul mentitum in eos, ex sanctus suavitate mei, at facer menandri mandamus mei. His an probatus delicata laboramus, elit antiopam et cum. Id labore mediocrem vis, est id dicat sadipscing. Ei prima affert sea, id his graece corpora. Per viderer denique repudiandae ei, qui iriure mentitum ex, ex quo amet natum minimum.

Amet nostrud sapientem nec id, duo in virtute suscipiantur, diceret copiosae qui ut. Sea ea natum magna graecis, aeque graece lobortis pri et. Cu reque abhorreant sed, ea clita integre offendit vim, iriure consequat vel id. Ut vel dictas cotidieque, tale mediocrem forensibus in cum. Usu utamur labores habemus et.
                    </p>
                  </Panel>
                  <Table>
                    <TableHead>
                      <th>Luogo Intervento</th>
                      <th>Durata Contratto</th>
                      <th>Num. Minimo Lavoratori</th>
                      <th>Doc. allegato per la proposta</th>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <td>Ancona (AN)</td>
                        <td>6 mesi</td>
                        <td>10<i className="fa fa-user"></i></td>
                        <td><Button type='primary' title="Carica Documento"  size='lg'/></td>
                      </TableRow>
                    </TableBody>
                  </Table>
                <div style={{float:'right'}}>
                  <Col grow={false}>
                    <div style={{float:'right'}}>
                        <Link to="/form-proposta"><Button type='primary' title="Partecipa"  size='mm'/></Link>
                    </div>
                  </Col>
                </div>
          </Panel>
    </Page>
    );
  }
}
