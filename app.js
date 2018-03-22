require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

let {mongoose} = require('./db');
let {Contact} = require('./models/contact');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');


const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('<h1>Contacts App</h1>');
});

app.post('/contacts', (req, res) => {
    let params = _.pick(req.body, ['name', 'mobile', 'group', 'isFav']);
    let contact = new Contact(params);
    contact.save().then((contact) => {
        res.send({contact});
    }).catch((e) => res.status(400).send(e));
});

app.get('/contacts', (req, res) => {
    Contact.find().then((contacts) => {
        res.status(200).send({contacts});
    }).catch((e) => res.status(400).send(e));
});

app.get('/contacts/:id', (req, res) => {
    let {id} = req.params;

    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Contact.findById(id).then((contact) => {
        if(!contact) {
            return res.status(404).send();
        }
        res.send(contact);
    }).catch((e) => res.status(400).send(e));
});

app.patch('/contacts/:id', (req, res) => {
    let {id} = req.params;

    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    let params = _.pick(req.body, ['name', 'mobile', 'group', 'isFav']);
    console.log(params);
    Contact.findByIdAndUpdate(id, {
        $set: params
    }, {
        new: true
    }).then((contact) => {
        if(!contact) {
            return res.status(404).send();
        }

        res.send(contact);
    }).catch((e) => res.status(400).send(e));
});

app.delete('/contacts/:id', (req, res) => {
   let {id} = req.params;

    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Contact.findByIdAndRemove(id).then((contact) => {
        if(!contact) {
            return res.status(404).send();
        }

        res.send({contact});
    }).catch((e) => res.status(400).send(e));
});

app.post('/users', (req, res) => {
   let params = _.pick(req.body, ['email', 'password']);

   let user = new User(params);
   user.save().then((user) => {
       user.generateAuthToken();
       res.header('x-auth', user.tokens[0].token).send(user);
   }).catch((e) => res.status(400).send(e));
});

app.post('/users/login', (req, res) => {
    let params = _.pick(req.body, ['email', 'password']);

    User.findOne({
        email: params.email
    })
    .then((user) => {
        if(!user) {
            res.status(404).send();
        }

        let matched = bcrypt.compare(params.password, user.password);
        if(matched) {
            return user.generateAuthToken();
        }
        res.status(401).send();
    })
    .then((user) => {
        return res.header('x-auth', user.tokens[0].token).send(user);
    })
    .catch((e) => res.status(400).send(e));
});

app.get('/users/logout', authenticate, (req, res) => {
    let token = req.header('x-auth');

    User.findByToken(token)
        .then((user) => {
            return user.removeToken(token);
        })
        .then(() => {
            res.send();
        })
        .catch((e) => res.status(400).send(e));
});

app.get('/users/me', authenticate, (req, res) => {
    res.send('authenticated route');
});

app.listen(process.env.PORT, () => console.log(`Server start on port ${process.env.PORT}`));

module.exports = {app};