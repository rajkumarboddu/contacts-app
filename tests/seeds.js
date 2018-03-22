const {ObjectID} = require('mongodb');

let {Contact} = require('./../models/contact');

const contacts = [
    {
        _id: new ObjectID(),
        name: 'Raj',
        mobile: '8330956094',
        group: 'friends',
        isFav: true
    },{
        _id: new ObjectID(),
        name: 'Uday',
        mobile: '9491641023',
        group: 'friends'
    },{
        _id: new ObjectID(),
        name: 'Punna',
        mobile: '9491072821',
        group: 'friends'
    }
];

let seedContacts = () => {
    Contact.remove({}).then(() => {

        Contact.insertMany(contacts)
            .then()
            .catch((e) => console.log(e));

    }).catch((e) => console.log(e));

};

module.exports = {contacts, seedContacts};