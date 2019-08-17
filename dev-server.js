/* eslint-disable strict */
'use strict';

const _ = require('lodash');
const path = require('path');
const express = require('express'); //componenti necessari per per la connessione al db
const fileUpload = require('express-fileupload'); //package per l'upload dei files
var mysql = require('mysql');//componenti necessari per per la connessione al db
const webpack = require('webpack');
const config = require('./webpack.config.dev');
var cors = require('cors');
var bodyParser = require('body-parser');
const CircularJSON = require('circular-json');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var app = express();

app.use(bodyParser.json({ type: 'application/json' }));
app.use(cors());

const compiler = webpack(config);
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
});

var pool = mysql.createPool({
  connectionLimit : 1000, //important
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'albo'
});

//richiamo l'endpoint per il login quando viene utilizzato questo url
app.post("/api/login",(req,res) => {
pool.getConnection(function(err,connection){
  if (err) {
    //connection.release();
    console.log(connection);
    return res.json({"code" : 100, "status" : "Error in connection database"});;
  }

  console.log('connected as id ' + connection.threadId);
  console.log('paramters ' + req.param('mail') + req.param('pass'));
  connection.query("(SELECT Mail, Passwd as Password,ID,Token, Token AS Ruolo FROM AccessoForn  WHERE Mail = '"+req.param('mail')+"' AND Passwd = '"+req.param('pass')+"') UNION (SELECT Mail, Passwd as Password,ID, Token,Ruolo FROM AccessoAzienda WHERE Mail = '"+req.param('mail')+"' AND Passwd = '"+req.param('pass')+"')",function(err,rows){
    if(!err) {
      return res.send(JSON.stringify(rows));
    }else{
      console.log('error'+err);
    }
  });

  connection.on('error', function(err) {
        res.json({"code" : 100, "status" : "Error in connection database"});
        res.send({ error: true, data: err });
  });
  connection.release();
});
});

//richiamo l'endpoint per il admin-pannel quando viene utilizzato questo url
app.post("/api/admin-pannel",(req,res) => {
pool.getConnection(function(err,connection){
  if (err) {
    //connection.release();
    console.log(connection);
    return res.json({"code" : 100, "status" : "Error in connection database"});;
  }

  console.log('connected as id ' + connection.threadId);
  console.log('paramters ' + req.param('bandi'));
  connection.query("(SELECT Bando.IdBando AS ID, Bando.NomeBando AS Nome, Bando.Categoria AS Categoria, Bando.DataCreazione AS DataCreazione, Bando.DataApertura AS DataApertura, Bando.DataChiusura AS DataChiusura, Bando.SogliaMax AS SogliaMax, Bando.MinRating AS MinRating, Azienda.NomeAzienda AS Banditore, Bando.Stato AS Stato FROM Bando, Gestione, Azienda, AccessoAzienda  WHERE Bando.IdBando = Gestione.RefBando AND Gestione.RefAzienda = Azienda.IdAzienda AND Azienda.IdAzienda = AccessoAzienda.ID AND Mail = 'admin@lucegas.it')",function(err,rows){
      //connection.release();
      //console.log(err);
      if(!err) {
          console.log('Inizio risposta da server mysql')
          //res = JSON.stringify(res, censor(res));
          console.log('Inizio risposta '+res.res+' oppure '+rows);
          /*if(res['Ruolo']==null){
             res['Ruolo'] = 'Fornitore'; //Setto il ruolo del fornitore a
          }*/
      }
      res.send(JSON.stringify(rows));
  });

  connection.on('error', function(err) {
        res.json({"code" : 100, "status" : "Error in connection database"});
        return res.send({ error: true, data: err });
  });
  connection.release();
});
});

//richiamo l'endpoint per l'inserimento di un bando una volta cliccato su Salva nel modal di inserimento
app.post("/api/insBando",(req,res) => {
pool.getConnection(function(err,connection){
  if (err) {
    //connection.release();
    console.log(connection);
    return res.json({"code" : 100, "status" : "Error in connection database"});
  }

  console.log('connected as id ' + connection.threadId);
  console.log('paramters ' + req.param('nome'));

  //query per inserire il nuovo bando nella tabella dei bandi con i suoi vari dati esso verrà poi collegato all'autore tramite un record presente nella tabella gestione

  connection.query("INSERT INTO Bando (IdBando, NomeBando, Categoria, Descr, DataCreazione, DataApertura, DataChiusura, SogliaMax, MinRating,Stato) VALUES (null,'"+req.param('nome')+"','"+req.param('categoria')+"','"+req.param('descr')+"','"+req.param('dataCreazione')+"', '"+req.param('dataApertura')+"', '"+req.param('dataChiusura')+"', '"+req.param('sogliaMax')+"', '"+req.param('minRating')+"','"+req.param('stato')+"')",function(err,rows){
      //connection.release();
      console.log(err);
      if(!err) {
          console.log('Inizio risposta da server mysql1')
          //res = JSON.stringify(res, censor(res));
          console.log('Inizio risposta '+res.res+' oppure '+rows);
          //query per completare l'inserimento di un nuovo bando con la creazione di un nuovo record in gestione

          connection.query("INSERT INTO Gestione (RefBando, RefAzienda) VALUES ((SELECT IdBando FROM Bando WHERE NomeBando = '"+req.param('nome')+"' AND Categoria = '"+req.param('categoria')+"' AND Descr = '"+req.param('descr')+"' AND DataCreazione = '"+req.param('dataCreazione')+"' AND DataApertura = '"+req.param('dataApertura')+"' AND DataChiusura = '"+req.param('dataChiusura')+"' AND SogliaMax = '"+req.param('sogliaMax')+"' LIMIT 1), (SELECT Azienda.IdAzienda AS RefAzienda FROM Azienda, AccessoAzienda WHERE Azienda.IdAzienda = AccessoAzienda.ID AND Mail = '"+req.param('mailBand')+"'))",function(err,rows){
            //connection.release();
            console.log(err);
            if(!err) {
                console.log('Inizio risposta da server mysql2')
                //res = JSON.stringify(res, censor(res));
                console.log('Inizio risposta '+res.res+' oppure '+rows);
            }
            res.send(JSON.stringify(rows));
          });

          connection.on('error', function(err) {
                res.json({"code" : 100, "status" : "Error in connection database"});
                return res.send({ error: true, data: err });
          });
      }
  });

  connection.on('error', function(err) {
        res.json({"code" : 100, "status" : "Error in connection database"});
        return res.send({ error: true, data: err });
  });

  connection.release();
});
});

//richiamo l'endpoint per l'inserimento di un bando una volta cliccato su Salva nel modal di inserimento
app.post("/api/insCategoria",(req,res) => {
  pool.getConnection(function(err,connection){
    if (err) {
      //connection.release();
      console.log(connection);
      return res.json({"code" : 100, "status" : "Error in connection database"});
    }

    console.log('connected as id ' + connection.threadId);
    console.log('paramters ' + req.param('nome'));

    //query per inserire il nuovo bando nella tabella dei bandi con i suoi vari dati esso verrà poi collegato all'autore tramite un record presente nella tabella gestione

    connection.query("INSERT INTO Categoria (IdCat, NomeCat) VALUES (null,'"+req.param('datiBandNew').NomeCat+"')",function(err,rows){
        //connection.release();
        console.log(err);
        if(!err) {
            console.log('Inizio risposta da server mysql1')
            //res = JSON.stringify(res, censor(res));
            console.log('Inizio risposta '+res.res+' oppure '+rows);
            //query per completare l'inserimento di un nuovo bando con la creazione di un nuovo record in gestione
        }
    });

    connection.on('error', function(err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return res.send({ error: true, data: err });
    });

    connection.release();
  });
  });

//richiamo l'endpoint per l'inserimento di un nuovo banditore da parte dell'admin
app.post("/api/insBanditore",(req,res) => {
  pool.getConnection(function(err,connection){
    if (err) {
      //connection.release();
      console.log(connection);
      return res.json({"code" : 100, "status" : "Error in connection database"});
    }

    console.log('connected as id ' + connection.threadId);
    console.log('paramters ' + req.datiBandNew);
    console.log('paramters ' + req.param('datiBandNew').NomeBand);
    console.log('paramters ' + req.datiBandNew);

    //query per inserire il nuovo bando nella tabella dei bandi con i suoi vari dati esso verrà poi collegato all'autore tramite un record presente nella tabella gestione
    connection.query("INSERT INTO Azienda (NomeAzienda, MailBando, Telefono) VALUES ('"+req.param('datiBandNew').NomeBand+"','"+req.param('datiBandNew').MailBand+"','"+req.param('datiBandNew').TelBand+"');",function(err,rows){
        //connection.release();
        console.log(err);
        if(!err) {
            console.log('Inizio risposta da server mysql1')
            //res = JSON.stringify(res, censor(res));
            console.log('Inizio risposta '+res.res+' oppure '+rows);
            //query per completare l'inserimento di un nuovo bando con la creazione di un nuovo record in gestione

            connection.query("INSERT INTO AccessoAzienda (Mail, Passwd, ID, Token, Ruolo) VALUES ('"+req.param('datiBandNew').MailBand+"','"+req.param('datiBandNew').PasswdAcc+"',(SELECT IdAzienda AS RefAzienda FROM Azienda WHERE Azienda.Telefono = '"+req.param('datiBandNew').TelBand+"'),null,'"+req.param('datiBandNew').Ruolo+"');",function(err,rows){
              //connection.release();
              console.log(err);
              if(!err) {
                  console.log('Inizio risposta da server mysql2')
                  //res = JSON.stringify(res, censor(res));
                  console.log('Inizio risposta '+res.res+' oppure '+rows);
              }
              res.send(JSON.stringify(rows));
            });

            connection.on('error', function(err) {
                  res.json({"code" : 100, "status" : "Error in connection database"});
                  return res.send({ error: true, data: err });
            });
        }
    });

    connection.on('error', function(err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return res.send({ error: true, data: err });
    });

    connection.release();
  });
  });

//richiamo l'endpoint per l'inserimento di un bando una volta cliccato su Salva nel modal di inserimento
app.post("/api/insPartecip",(req,res) => {
  pool.getConnection(function(err,connection){
    if (err) {
      //connection.release();
      console.log(connection);
      return res.json({"code" : 100, "status" : "Error in connection database"});
    }

    console.log('connected as id ' + connection.threadId);
    console.log('paramters ' + req.param('nome'));

    //query per inserire il nuovo bando nella tabella dei bandi con i suoi vari dati esso verrà poi collegato all'autore tramite un record presente nella tabella gestione

    connection.query("INSERT INTO Partecipazione (RefBando, RefForn, DataIscr, Titolo, Descrizione, Offerta) VALUES ((SELECT IdBando AS RefBando FROM Bando WHERE NomeBando = '"+req.param('NomeBando')+"' AND Categoria = (SELECT IdCat FROM Categoria WHERE NomeCat = '"+req.param('Categoria')+"') AND DataCreazione = '"+req.param('DataCreazione')+"' AND DataApertura = '"+req.param('DataApertura')+"' AND DataChiusura = '"+req.param('DataChiusura')+"' AND SogliaMax = '"+req.param('SogliaMax')+"'),(SELECT Fornitore.IdForn AS RefForn FROM AccessoForn, Fornitore WHERE AccessoForn.ID = Fornitore.IdForn AND AccessoForn.Mail = '"+req.param('MailBand')+"'),(SELECT CURDATE()), '"+req.param('Titolo')+"', '"+req.param('Descrizione')+"','"+req.param('Offerta')+"');",function(err,rows){
        //connection.release();
        console.log(err);
        if(!err) {
            console.log('Inizio risposta da server mysql1')
            //res = JSON.stringify(res, censor(res));
            console.log('Inizio risposta '+res.res+' oppure '+rows);
            //query per completare l'inserimento di un nuovo bando con la creazione di un nuovo record in gestione
        }
        res.send(JSON.stringify(rows));
    });

    connection.on('error', function(err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return res.send({ error: true, data: err });
    });

    connection.release();
  });
  });

app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'))

  //richiamo l'endpoint per l'inserimento di un bando una volta cliccato su Salva nel modal di inserimento
app.post("/api/uploadDoc", function(req, res, next) {
  // req.files is array of `photos` files
  console.log(req);
  console.log(req.param());
  console.log(req.body.filename);
  //console.log(__dirname+"/public/uploadsDoc/"+fileName);
  // req.body will contain the text fields, if there were any
  var i=0;

    try{
        let uploadFile = req.files.file;
        const fileName = req.files.file.name;
        console.log(uploadFile);
        uploadFile.mv(
          `${__dirname}/public/uploadsDoc/${fileName}`,
          function (err) {
            if (err) {
              console.log(err);
              return res.status(500).send(err);
            }

            res.json({
              file: `public/${req.files.file.name}`,
            })
          },
        )
      }catch(error){
        res.send(error);
        console.log(error);
      }

});

 //richiamo l'endpoint per l'inserimento di un bando una volta cliccato su Salva nel modal di inserimento
 app.get("/api/revertUpload", function(req, res, next) {
  // req.files is array of `photos` files
  console.log(req);
  console.log(req.param());
  console.log(req.body.filename);
  //console.log(__dirname+"/public/uploadsDoc/"+fileName);
  // req.body will contain the text fields, if there were any
  var i=0;

    /*try{
        let uploadFile = req.files.file;
        const fileName = req.files.file.name;
        console.log(uploadFile);
        uploadFile.mv(
          `${__dirname}/public/uploadsDoc/${fileName}`,
          function (err) {
            if (err) {
              console.log(err);
              return res.status(500).send(err);
            }

            res.json({
              file: `public/${req.files.file.name}`,
            })
          },
        )
      }catch(error){
        res.send(error);
        console.log(error);
      }*/

});

app.post("/api/sendMail",(req,res) => {
  //questo endpoint permette di inviare le mail di notifica
  console.log(nodemailer);
  // creo un oggetto del package nodemailer il quale possa essere riutilizzato per update futuri
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // uso l'SSL ma le impostazioni vanno prese dal proprio dominio di posta
    auth: {
      user: 'mailprova16@gmail.com',   //inserire qui la mail con la quale si vogliono inviare le notifiche
      pass: 'prova19!',   //inserire qui la password con la quale si vogliono inviare le notifiche
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: 'albofornitori@.com', // indirizzo dell'inviante
    to: req.param('Mail'), // lista dei destinatari
    subject: 'Invito al bando, piattaforma ', // Inserire qui l'oggetto della mail
    text: 'Proposta', //
    html: '<b>PROPOSTAA</b>' // corpo della mail dove è possibile inserire dell'html
  };

  // invio la mail con l'oggetto definito sopra
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.send(false);  //se ci sono errori invio false al metodo di provenienza
      return console.log(error);
    }else{
      res.send(true); //se non ci sono errori invio true al metodo di provenienza
    }
    console.log('Messagio inviato: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Anteprima URL: %s', nodemailer.getTestMessageUrl(info));

  });

});

//richiamo l'endpoint per il formBando l quando viene utilizzato questo url
app.post("/api/register",(req,res) => {
  pool.getConnection(function(err,connection){
    if (err) {
      //connection.release();
      console.log(connection);
      return res.json({"code" : 100, "status" : "Error in connection database"});
    }

    console.log('connected as id ' + connection.threadId);
    console.log('paramters ' + req.param('nome') + req.param('categoria'));
    connection.query("INSERT INTO Fornitore (IdForn, NomeForn, IVAForn, FGiurid, ATECO, AnnoCCIAA, ProvinciaCCIAA, NumeroREA, SitoWeb, PEC, AreaServizio, SubAreaServizio,SLStato, SLRegione, SLProvincia, SLCAP, SLIndirizzo, SLTel, SLFAX, SAmmStato, SAmmRegione, SAmmProvincia, SAmmCAP, SAmmIndirizzo, SAmmTel, SAmmFAX, SAmmEmail, Categoria1, Categoria2, Categoria3, Cateogoria4, Categoria5, Descrizione, FattAnnuo1, FattAnnuo2, FattAnnuo3, OrgMedio1, OrgMedio2, OrgMedio3,TipoCCNL, PosINPS, PosINAIL, CapSociale, NDipendenti, NStabilimenti, Nome, Cognome, Ruolo, Lingua, Telefono, GenCert, Storico) VALUES ('"+req.param('NomeForn')+"','"+req.param('IVAForn')+"','"+req.param('FGiurid')+"','"+req.param('ATECO')+"','"+req.param('AnnoCCIAA')+"','"+req.param('ProvinciaCCIA')+"','"+req.param('NumeroREA')+"','"+req.param('SitoWeb')+"','"+req.param('PEC')+"','"+req.param('AreaServizio')+"','"+req.param('SubAreaServizio')+"','"+req.param('SLStato')+"','"+req.param('SLRegione')+"','"+req.param('SLProvincia')+"','"+req.param('SLCAP')+"','"+req.param('SLIndirizzo')+"','"+req.param('SLFAX')+"', '"+req.param('SAmmStato')+"', '"+req.param('SAmmRegione')+"', '"+req.param('SAmmProvincia')+"', '"+req.param('SAmmCAP')+"', '"+req.param('SAmmIndirizzo')+"', '"+req.param('SAmmTel')+"', '"+req.param('SAmmFAX')+"', '"+req.param('SAmmEmail')+"','"+req.param('Categoria1')+"','"+req.param('Categoria2')+"','"+req.param('Categoria3')+"','"+req.param('Categoria4')+"','"+req.param('Categoria5')+"','"+req.param('SottoCategoria')+"',null, '"+req.param('OrgMedio1')+"', '"+req.param('OrgMedio2')+"', '"+req.param('OrgMedio3')+"', '"+req.param('TipoCCNL')+"', '"+req.param('PosINPS')+"', '"+req.param('PosINAIL')+"','"+req.param('CapSociale')+"','"+req.param('NDipendenti')+"','"+req.param('NStabilimenti')+"','"+req.param('Nome')+"','"+req.param('Cognome')+"','"+req.param('Ruolo')+"','"+req.param('Lingua')+"','"+req.param('Telefono')+"');",function(err,rows){
        //connection.release();
        console.log(err);
        if(!err) {
            console.log('Inizio risposta da server mysql')
            //res = JSON.stringify(res, censor(res));
            console.log('Inizio risposta '+res.res+' oppure '+rows);
            /*if(res['Ruolo']==null){
               res['Ruolo'] = 'Fornitore'; //Setto il ruolo del fornitore a
            }*/
        }
        res.send(JSON.stringify(rows));
    });

    connection.on('error', function(err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return res.send({ error: true, data: err });
    });
    connection.release();
  });
  });

  //richiamo l'endpoint per prendere i dettagli del fornitore
  app.post("/api/getForn",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});;
      }

      console.log('connected as id ' + connection.threadId);
      console.log('paramters ' + req.param('mail') + req.param('pass'));
      connection.query("SELECT  Fornitore.IdForn, Fornitore.Nome, Fornitore.Cognome, Fornitore.Ruolo, AccessoForn.Mail, Fornitore.Telefono, Fornitore.NomeForn,(SELECT Categoria.NomeCat FROM Fornitore, AccessoForn, Categoria  WHERE Fornitore.Categoria2 = Categoria.IdCat AND Fornitore.IdForn = AccessoForn.ID AND AccessoForn.Mail = '"+req.param('Mail')+"') AS Categoria1,(SELECT Categoria.NomeCat FROM Fornitore, AccessoForn, Categoria WHERE Fornitore.Categoria2 = Categoria.IdCat AND Fornitore.IdForn = AccessoForn.ID AND AccessoForn.Mail = '"+req.param('Mail')+"') AS Categoria2,(SELECT Categoria.NomeCat FROM Fornitore, AccessoForn, Categoria WHERE Fornitore.Categoria3 = Categoria.IdCat AND Fornitore.IdForn = AccessoForn.ID AND AccessoForn.Mail = '"+req.param('Mail')+"') AS Categoria3, (SELECT Categoria.NomeCat FROM Fornitore, AccessoForn, Categoria WHERE Fornitore.Categoria4 = Categoria.IdCat AND Fornitore.IdForn = AccessoForn.ID AND AccessoForn.Mail = '"+req.param('Mail')+"') AS Categoria4,(SELECT Categoria.NomeCat FROM Fornitore, AccessoForn, Categoria WHERE Fornitore.Categoria5 = Categoria.IdCat AND Fornitore.IdForn = AccessoForn.ID AND AccessoForn.Mail = '"+req.param('Mail')+"') AS Categoria5, Fornitore.IVAForn, Fornitore.FGiurid, Fornitore.PEC, Fornitore.SitoWeb, Fornitore.ATECO, Fornitore.ProvinciaCCIAA, Fornitore.NumeroREA FROM Fornitore, AccessoForn, Categoria WHERE Fornitore.IdForn = AccessoForn.ID AND AccessoForn.Mail = '"+req.param('Mail')+"';",function(err,rows){        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli del fornitore
  app.post("/api/getFornIstr",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});;
      }

      console.log('connected as id ' + connection.threadId);
      console.log('paramters ' + req.param('mail') + req.param('pass'));
      connection.query("SELECT  Fornitore.IdForn, Fornitore.Nome, Fornitore.Cognome, Fornitore.Ruolo, AccessoForn.Mail, Fornitore.Telefono, Fornitore.NomeForn,(SELECT Categoria.NomeCat FROM Fornitore, AccessoForn, Categoria  WHERE Fornitore.Categoria2 = Categoria.IdCat AND Fornitore.IdForn = AccessoForn.ID AND AccessoForn.ID = '"+req.param('ID')+"') AS Categoria1,(SELECT Categoria.NomeCat FROM Fornitore, AccessoForn, Categoria WHERE Fornitore.Categoria2 = Categoria.IdCat AND Fornitore.IdForn = AccessoForn.ID AND AccessoForn.Mail = '"+req.param('Mail')+"') AS Categoria2,(SELECT Categoria.NomeCat FROM Fornitore, AccessoForn, Categoria WHERE Fornitore.Categoria3 = Categoria.IdCat AND Fornitore.IdForn = AccessoForn.ID AND AccessoForn.Mail = '"+req.param('Mail')+"') AS Categoria3, (SELECT Categoria.NomeCat FROM Fornitore, AccessoForn, Categoria WHERE Fornitore.Categoria4 = Categoria.IdCat AND Fornitore.IdForn = AccessoForn.ID AND AccessoForn.ID = '"+req.param('ID')+"') AS Categoria4,(SELECT Categoria.NomeCat FROM Fornitore, AccessoForn, Categoria WHERE Fornitore.Categoria5 = Categoria.IdCat AND Fornitore.IdForn = AccessoForn.ID AND AccessoForn.ID = '"+req.param('ID')+"') AS Categoria5, Fornitore.IVAForn, Fornitore.FGiurid, Fornitore.PEC, Fornitore.SitoWeb, Fornitore.ATECO, Fornitore.ProvinciaCCIAA, Fornitore.NumeroREA FROM Fornitore, AccessoForn, Categoria WHERE Fornitore.IdForn = AccessoForn.ID AND AccessoForn.ID = '"+req.param('ID')+"';",function(err,rows){        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli del fornitore
  app.post("/api/getPartecip",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});
      }

      console.log('connected as id ' + connection.threadId);
      console.log('paramters ' + req.param('Mail') + req.param('pass'));
      connection.query("SELECT Fornitore.IdForn, Fornitore.NomeForn, Fornitore.IVAForn, Fornitore.FGiurid, Fornitore.SitoWeb, Fornitore.PEC, Partecipazione.Candidatura FROM Fornitore, Partecipazione, Bando, Gestione, Azienda, AccessoAzienda WHERE Fornitore.IdForn = Partecipazione.RefForn AND Partecipazione.RefBando = Bando.IdBando AND Bando.IdBando = Gestione.RefBando AND Gestione.RefAzienda = Azienda.IdAzienda AND Azienda.IdAzienda = AccessoAzienda.ID AND AccessoAzienda.Mail = '"+req.param('Mail')+"' AND Partecipazione.RefBando = '"+req.param('IdBando')+"' ;",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli del fornitore
  app.post("/api/partecipBando",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});;
      }

      console.log('connected as id ' + connection.threadId);
      console.log('paramters ' + req.param('email') + req.param('pass'));

      connection.query("INSERT INTO Partecipazione (RefBando, RefForn, DataIscr, Titolo, Descrizione, Offerta) VALUES ((SELECT IdBando AS RefBando FROM Bando WHERE NomeBando = 'Appalto Mensa interna 2019' AND Categoria = 3 AND DataCreazione = '2018-09-01' AND DataApertura = '2018-09-18' AND DataChiusura = '2018-09-30' AND SogliaMax = 10000),(SELECT Fornitore.IdForn AS RefForn FROM AccessoForn, Fornitore WHERE AccessoForn.ID = Fornitore.IdForn AND AccessoForn.Mail = 'franco.rossi@rossiristorazione.it'),(SELECT CURDATE()), 'Candidatura per bando', 'Carabinieri NAS sotto copertura',1000);",function(err,rows){
        if(!err) {
          console.log('modifica mail necessaria');
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli del fornitore
  app.post("/api/insertDocuAnalisiBando",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});;
      }

      console.log('connected as id ' + connection.threadId);
      console.log('paramters ' + req.param('data').name + req.param('nomeBando'));
      console.log('paramters ' + req.param('data'));

      connection.query("INSERT INTO DocBando (Codice, Titolo, DataUp) VALUES ('"+req.param('data')+req.param('nomeBando')+"', '"+req.param('data')+"', (SELECT CURDATE()))",function(err,rows){
        if(!err) {
          console.log('modifica mail necessaria');
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.query("INSERT INTO Descrizione (IdDocB, RefBando) VALUES ('"+req.param('data')+req.param('nomeBando')+"', (SELECT IdBando AS RefBando FROM Bando WHERE NomeBando='"+req.param('nomeBando')+"'))",function(err,rows){
        if(!err) {
          console.log('modifica mail necessaria');
          //return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });

      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli del fornitore
  app.post("/api/getDocuAnalisiBando",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});;
      }

      console.log('connected as id ' + connection.threadId);
      connection.query("SELECT IdDocB FROM Descrizione WHERE RefBando = '"+req.param('IdBando')+"'",function(err,rows){
        var result = JSON.stringify(rows);
        console.log(rows.length);
        if(!err && rows.length != 0) {
          console.log('modifica mail necessaria333');
          //return res.send(JSON.stringify(rows));
          console.log(rows[0].IdDocB);
          var result = JSON.stringify(rows);
          console.log(result.IdDocB);
          console.log(result[0].IdDocB);
          console.log(result);
          //funzione per altra query
          connection.query("SELECT Titolo FROM DocBando WHERE Codice = '"+rows[0].IdDocB+"'",function(err,rows){
            if(!err) {
              console.log('modifica mail necessaria:'+rows);
              return res.send(JSON.stringify(rows));
            }else{
              console.log('error'+err);
            }
          });
        }else{
          console.log('error'+err);
          return res.send(JSON.stringify(rows));
        }
      });
      /*
      connection.query("SELECT Titolo FROM DocBando WHERE Codice = '"+rowsSel.IdDocB+"'",function(err,rows){
        if(!err) {
          console.log('modifica mail necessaria');
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });*/

      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli del fornitore
  app.post("/api/insertDocuForn",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});;
      }

      console.log('connected as id ' + connection.threadId);
      console.log('paramters ' + req.param('email') + req.param('pass'));

      connection.query("INSERT INTO Documento (Codice, Tipo, Data, Scadenza) VALUES ('"+req.param('pass')+"','"+req.param('pass')+"', '"+req.param('pass')+"','"+req.param('pass')+"');",function(err,rows){
        if(!err) {
          console.log('modifica mail necessaria');
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.query("INSERT INTO ReqDoc (RefForn, IdDoc) VALUES ((SELECT Fornitore.IdForn AS RefForn FROM AccessoForn, Fornitore WHERE AccessoForn.ID = Fornitore.IdForn AND AccessoForn.Mail = 'franco.rossi@rossiristorazione.it'),'AX123456');",function(err,rows){
        if(!err) {
          console.log('modifica mail necessaria');
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });

      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli del fornitore
  app.post("/api/insertDocuBand",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});;
      }

      console.log('connected as id ' + connection.threadId);
      console.log('paramters ' + req.param('email') + req.param('pass'));

      connection.query("INSERT INTO Documento (Codice, Tipo, Data, Scadenza) VALUES ('"+req.param('pass')+"','"+req.param('pass')+"', '"+req.param('pass')+"','"+req.param('pass')+"');",function(err,rows){
        if(!err) {
          console.log('modifica mail necessaria');
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });


      connection.query("INSERT INTO ReqDoc (RefForn, IdDoc) VALUES ((SELECT Fornitore.IdForn AS RefForn FROM AccessoForn, Fornitore WHERE AccessoForn.ID = Fornitore.IdForn AND AccessoForn.Mail = 'franco.rossi@rossiristorazione.it'),'AX123456');",function(err,rows){
        if(!err) {
          console.log('modifica mail necessaria');
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });

      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli del fornitore
  app.post("/api/getFornForInvito",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});;
      }

      console.log('connected as id ' + connection.threadId);
      console.log('paramters ' + req.param('email') + req.param('pass'));

      connection.query("SELECT Fornitore.IdForn, Fornitore.NomeForn, AccessoForn.Mail, Fornitore.AreaServizio, Fornitore.SubAreaServizio, Fornitore.Rating FROM Fornitore, AccessoForn, Bando WHERE Fornitore.IdForn = AccessoForn.ID AND Fornitore.Categoria1 = Bando.Categoria OR Fornitore.Categoria2 = Bando.Categoria OR Fornitore.Categoria3 = Bando.Categoria OR Fornitore.Categoria4 = Bando.Categoria OR Fornitore.Categoria5 = Bando.Categoria;",function(err,rows){
        if(!err) {
          console.log('modifica mail necessaria');
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli del fornitore
  app.post("/api/updateUserband",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});;
      }

      console.log('connected as id ' + connection.threadId);
      console.log('paramters ' + req.param('email') + req.param('pass'));

      connection.query("UPDATE AccessoAzienda SET Mail = '"+req.param('datiBandNew').MailBand+"',Passwd = '"+req.param('datiBandNew').PasswdAcc+"',Token = null,Ruolo = '"+req.param('datiBandNew').Ruolo+"' WHERE ID = '"+req.param('datiBandNew').ID+"';",function(err,rows){
        if(!err) {
          console.log('modifica mail necessaria');
          return res.send(true);
        }else{
          console.log('error'+err);
        }
      });

      connection.query("UPDATE Azienda SET NomeAzienda = '"+req.param('datiBandNew').NomeBand+"', MailBando = '"+req.param('datiBandNew').MailBand+"', Telefono = '"+req.param('datiBandNew').TelBand+"' WHERE IdAzienda = '"+req.param('datiBandNew').ID+"';",function(err,rows){
        if(!err) {
          console.log(rows);
          console.log('modifica profilo avvenuta');
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli del fornitore
  app.post("/api/updateForn",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});;
      }

      console.log('connected as id ' + connection.threadId);
      console.log('paramters ' + req.param('email') + req.param('pass'));

      connection.query("UPDATE AccessoForn SET Mail = '"+req.param('AccessoMail')+"',Passwd = '"+req.param('Passwd')+"' WHERE ID =  = '"+req.param('IdForn')+"';",function(err,rows){
        if(!err) {
          console.log('modifica mail necessaria');
          return res.send(true);
        }else{
          console.log('error'+err);
        }
      });

      connection.query("UPDATE Fornitore SET Nome = '"+req.param('Nome')+"', Cognome = '"+req.param('Cognome')+"', Ruolo = '"+req.param('Ruolo')+"', Telefono = '"+req.param('Telefono')+"', NomeForn = '"+req.param('NomeForn')+"', Categoria = '"+req.param('Categoria')+"', SottoCategoria = '"+req.param('SottoCategoria')+"', IVAForn = '"+req.param('IvaForn')+"', FGiurid = '"+req.param('FGiurid')+"',ATECO = '"+req.param('ATECO')+"', ProvinciaCCIAA ='"+req.param('ProvinciaCCIAA')+"', NumeroREA = '"+req.param('NumeroREA')+"', SitoWeb = '"+req.param('SitoWeb')+"', PEC = '"+req.param('PEC')+"', SLStato = '"+req.param('SLStato')+"',SLRegione = '"+req.param('SLRegione')+"', SLProvincia = '"+req.param('SLProvincia')+"', SLIndirizzo = '"+req.param('SLIndirizzo')+"', SLCAP = '"+req.param('SLCAP')+"', SLFAX = '"+req.param('SLFAX')+"', SAmmStato = '"+req.param('SAmmStato')+"', SAmmRegione = '"+req.param('SAmmRegione')+"', SAmmProvincia = '"+req.param('SAmmProvincia')+"', SAmmIndirizzo = '"+req.param('SAmmIndirizzo')+"',SAmmCAP = '"+req.param('SAmmCAP')+"', SAmmFAX = '"+req.param('SAmmFAX')+"' WHERE IdForn = '"+req.param('IdForn')+"';",function(err,rows){
        if(!err) {
          console.log(rows);
          console.log('modifica profilo avvenuta');
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli dei Banditori
  app.get("/api/visBanditori",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});
      }

      console.log('connected as id ' + connection.threadId);
      console.log('paramters ' + req.param('mail') + req.param('pass'));
      connection.query("SELECT Azienda.IdAzienda AS ID, Azienda.NomeAzienda AS Nome, Azienda.MailBando AS email, AccessoAzienda.Ruolo AS Ruolo FROM Azienda, AccessoAzienda WHERE  Azienda.IdAzienda = AccessoAzienda.ID AND AccessoAzienda.Ruolo = 'Banditore';",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli delle Categorie
  app.get("/api/visCategorie",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});
      }

      console.log('connected as id ' + connection.threadId);
      connection.query("SELECT Categoria.IdCat AS ID, Categoria.NomeCat AS Nome FROM Categoria;",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli delle Categorie
  app.post("/api/allBandi",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});
      }

      console.log('connected as id ' + connection.threadId);
      connection.query("SELECT Bando.IdBando, Bando.Descr, Bando.NomeBando, Categoria.NomeCat, Bando.DataCreazione, Bando.DataApertura, Bando.DataChiusura, Bando.SogliaMax, Bando.MinRating, Bando.Stato FROM Bando, Fornitore, AccessoForn, Categoria WHERE Bando.Categoria = Fornitore.Categoria AND Bando.Categoria = Categoria.IdCat AND Fornitore.IdForn = AccessoForn.ID AND Bando.Stato != 'Nascosto' AND AccessoForn.Mail = '"+req.param('Mail')+"';",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli delle Categorie
  app.post("/api/allBandiBanditore",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});
      }

      console.log('connected as id ' + connection.threadId);
      connection.query("SELECT Bando.IdBando AS ID, Bando.NomeBando AS Nome,Bando.Descr AS Descr, Categoria.NomeCat AS Categoria, Bando.DataCreazione AS DataCreazione, Bando.DataApertura AS Apertura, Bando.DataChiusura AS Chiusura, Bando.SogliaMax AS OffertaMassima, Bando.Stato AS Stato, Bando.MinRating AS MinRating FROM Bando, Gestione, Azienda, AccessoAzienda, Categoria WHERE Bando.IdBando = Gestione.RefBando AND Gestione.RefAzienda = Azienda.IdAzienda AND Bando.Categoria = Categoria.IdCat AND Azienda.IdAzienda = AccessoAzienda.ID AND Mail = '"+req.param('Mail')+"';",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli di tutti i fornitori che hanno aderito a bandi indetti da questo banditore
  app.post("/api/allFornOfBand",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});
      }

      console.log('connected as id ' + req.param('Mail'));
      connection.query("SELECT Fornitore.NomeForn AS Nome,Fornitore.IdForn AS ID, Fornitore.IVAForn, Bando.NomeBando, Partecipazione.Candidatura, Fornitore.Rating FROM Fornitore, Partecipazione, Bando, Gestione, Azienda, AccessoAzienda WHERE Fornitore.IdForn = Partecipazione.RefForn AND Partecipazione.RefBando = Bando.IdBando AND Bando.IdBando = Gestione.RefBando AND Gestione.RefAzienda = Azienda.IdAzienda AND Azienda.IdAzienda = AccessoAzienda.ID AND AccessoAzienda.Mail = '"+req.param('Mail')+"';",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli delle Categorie
  app.post("/api/deleteUser",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});
      }

      console.log('connected as id ' + connection.threadId);
      connection.query("DELETE FROM AccessoAzienda WHERE ID = '"+req.param('datiFornDel').ID+"';",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli delle Categorie
  app.post("/api/deleteCat",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});
      }

      console.log('connected as id ' + connection.threadId);
      connection.query("DELETE FROM Categoria WHERE IdCat = '"+req.param('datiFornDel').ID+"';",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli delle Categorie
  app.post("/api/deleteBando",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});
      }

      console.log('connected as id ' + connection.threadId);
      connection.query("DELETE FROM Bando WHERE IdBando = '"+req.param('ID')+"';",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli delle Categorie
  app.post("/api/deletePartecip",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});
      }

      console.log('connected as id ' + connection.threadId);
      connection.query("DELETE FROM Partecipazione WHERE RefBando = '"+req.param('IdBando')+"' AND RefForn = (SELECT Fornitore.IdForn AS RefForn FROM AccessoForn, Fornitore WHERE AccessoForn.ID = Fornitore.IdForn AND AccessoForn.Mail = '"+req.param('MailBand')+"');",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli delle Categorie
  app.post("/api/updateBando",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});
      }


      console.log('connected as id ' + connection.threadId);
      connection.query("UPDATE Bando SET NomeBando = '"+req.param('nome')+"', Descr = '"+req.param('descr')+"', DataApertura = '"+req.param('dataApertura')+"', DataChiusura = '"+req.param('dataChiusura')+"', SogliaMax = '"+req.param('sogliaMax')+"', MinRating = '"+req.param('minRating')+"',Stato = '"+req.param('stato')+"' WHERE IdBando = '"+req.param('ID')+"'",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli delle Categorie
  app.post("/api/updatePartecip",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});
      }


      console.log('connected as id ' + connection.threadId);
      connection.query("UPDATE Partecipazione SET Titolo = '"+req.param('Titolo')+"', Descrizione = '"+req.param('Descrizione')+"', Offerta = '"+req.param('Offerta')+"' WHERE  RefForn = (SELECT Fornitore.IdForn AS RefForn FROM AccessoForn, Fornitore WHERE AccessoForn.ID = Fornitore.IdForn AND AccessoForn.Mail = '"+req.param('MailBand')+"') AND RefBando = '"+req.param('IdBando')+"';",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli del fornitore
  app.post("/api/getBand",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});;
      }

      console.log('connected as id ' + connection.threadId);
      connection.query("SELECT * FROM Bando WHERE IdBando = '"+req.param('ID')+"'",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  var newRating = 0;
  //richiamo l'endpoint per prendere i dettagli del fornitore
  app.post("/api/valutaForn",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});;
      }

      console.log('connected as id ' + connection.threadId);
      console.log('params : ' + req.param('data').Qualita);
      connection.query("UPDATE Partecipazione SET Valutatore = '"+req.param('data').firstName+" "+req.param('data').lastName+"', Val1 = '"+req.param('data').Qualita+"*2', Val2 = '"+req.param('data').RispSol+"*3', Val3 = '"+req.param('data').Prezzo+"*4', Val4 = '"+req.param('data').Profess+"*2', Val5 = '"+req.param('data').Consulenz+"*5', NoteValutatore = '"+req.param('data').textarea+"' WHERE RefForn = '"+req.param('IDForn')+"';",function(err,rows){
        if(!err) {
          console.log(rows);
          //return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });
      //inizio il calcolo del rating in base a quelo che ho ottenuto nel form di valutazione
      newRating = req.param('data').Qualita*2+req.param('data').RispSol*3+req.param('data').Prezzo*4+req.param('data').Profess*2+req.param('data').Consulenz*5;
      console.log(newRating);
      //query per aggiornare la valutazione del fornitore
      connection.query("UPDATE Fornitore SET Rating = '"+newRating+"' WHERE IdForn = '"+req.param('IDForn')+"';",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli del fornitore
  app.post("/api/getValutatori",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});;
      }

      console.log('connected as id ' + connection.threadId);
      connection.query("SELECT Valutatore, Val1, Val2, Val3, Val4, Val5, NoteValutatore FROM Partecipazione  WHERE RefBando = '"+req.param('IDBando')+"' GROUP BY Valutatore;",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli del fornitore
  app.post("/api/getProposta",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});;
      }

      console.log('connected as id ' + connection.threadId);
      connection.query("SELECT Titolo, DataIscr, Candidatura, Descrizione FROM Partecipazione WHERE RefBando = '"+req.param('IdBando')+"' AND RefForn = (SELECT Fornitore.IdForn AS RefForn FROM AccessoForn, Fornitore WHERE AccessoForn.ID = Fornitore.IdForn AND AccessoForn.Mail = '"+req.param('MailForn')+"');",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli delle Categorie
  app.post("/api/accettaCand",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});
      }

      console.log('connected as id ' + connection.threadId);
      connection.query("UPDATE Partecipazione SET Candidatura = 'Approvata' WHERE RefForn = '"+req.param('IdForn')+"' AND  RefBando = '"+req.param('IdBando')+"';",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli delle Categorie
  app.post("/api/rifiutaCand",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});
      }

      console.log('connected as id ' + connection.threadId);
      connection.query("UPDATE Partecipazione SET Candidatura = 'Rifiutata' WHERE RefForn = '"+req.param('IdForn')+"' AND  RefBando = '"+req.param('IdBando')+"';",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

  //richiamo l'endpoint per prendere i dettagli delle Categorie
  app.post("/api/selectVincitore",(req,res) => {
    pool.getConnection(function(err,connection){
      if (err) {
        //connection.release();
        console.log(connection);
        return res.json({"code" : 100, "status" : "Error in connection database"});
      }

      console.log('connected as id ' + connection.threadId);
      connection.query("UPDATE Partecipazione SET Vincitore = true WHERE RefForn = '"+req.param('IDForn')+"' AND  RefBando = '"+req.param('IDBando')+"';",function(err,rows){
        if(!err) {
          console.log(rows);
          return res.send(JSON.stringify(rows));
        }else{
          console.log('error'+err);
        }
      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            res.send({ error: true, data: err });
      });
      connection.release();
    });
  });

app.use(devMiddleware);
app.use(require('webpack-hot-middleware')(compiler));

app.use(function(req, res, next) {
  const reqPath = req.url;
  // find the file that the browser is looking for
  const file = _.last(reqPath.split('/'));
  if (['index.html'].indexOf(file) !== -1) {
    res.end(devMiddleware.fileSystem.readFileSync(path.join(config.output.path, file)));
  } else if (file.indexOf('.') === -1) {
    // if the url does not have an extension, assume they've navigated to something like /home and want index.html
    res.end(devMiddleware.fileSystem.readFileSync(path.join(config.output.path, 'index.html')));
  } else {
    next();
  }
});




//avviamo il server sulla porta 8080
/* eslint-disable no-console */
let ipAddress;
ipAddress = '127.0.0.1'
app.listen(8080, ipAddress, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  
  console.log('Listening at '+ipAddress+' : '+ process.env.WEBPACK_PORT);
});
/* eslint-enable no-console */
