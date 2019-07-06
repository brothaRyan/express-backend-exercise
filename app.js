const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const models = require('./models');
const dotenv = require('dotenv');

dotenv.config();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PassPhrase = process.env.REACT_APP_SSL_PASS_PHRASE;
const KeyPath = process.env.REACT_APP_SSL_KEY_PATH;
const CertPath = process.env.REACT_APP_SSL_CERT_PATH;

function isEmpty(data) {
  return data === undefined || data == null || data.length === 0;
}

app.get('/todos', (req, res) => {
  models.todolistitem.findAll()
      .then(todolistitem => res.status(201).json(todolistitem));
});

app.post('/todos', (req, res) => {
  const text = req.body.text || '';
  if (!text.length) {
    return res.status(400).json({error: 'Incorrenct text'});
  }
  
  models.todolistitem.create({
    itemTodo: text,
    isCompleted: false
  }).then(() => {
    models.todolistitem.findAll()
  .then(todolistitem => res.status(201).json(todolistitem));
  })
});

app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  models.todolistitem.update({
    // itemTodo: req.body.text,
    isCompleted: req.body.isCompleted
  },
  {
    where: {
      id: req.params.id
    }
  }).then(() => {
    models.todolistitem.findAll()
  .then(todolistitem => res.status(201).json(todolistitem));
  })
});

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({error: 'Incorrect id'});
  }

  models.todolistitem.destroy({
    where: {
      id: id
    }
  }).then(() => {
    models.todolistitem.findAll()
  .then(todolistitem => res.status(201).json(todolistitem));
  })
});

// app.listen(3000, () => {
//   console.log('Example app listening on port 3000!');

//   require('./models').sequelize.sync({force: false})
//     .then(() => {
//       console.log('Databases sync');
//     });
// });

https.createServer({
  key: fs.readFileSync(KeyPath),
  cert: fs.readFileSync(CertPath),
  passphrase: PassPhrase
}, app)
.listen(3000);