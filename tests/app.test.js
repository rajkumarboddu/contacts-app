const expect = require('expect');
const request = require('supertest');

let {Contact} = require('./../models/contact');
let {app} = require('./../app');
let {contacts, seedContacts} = require('./seeds');

beforeEach(seedContacts);

describe('POST /contacts', () => {
   it('should add the contact with the valid data passed', (done) => {
      let newContact = {
          name: 'Uday',
          mobile: '9491641023',
          group: 'friends'
      };
      request(app)
          .post('/contacts')
          .send(newContact)
          .expect(200)
          .expect((res) => {
            expect(res.body.contact.name).toBe(newContact.name);
            expect(res.body.contact.mobile).toBe(newContact.mobile);
            expect(res.body.contact.group).toBe(newContact.group);
          })
          .end(done);
   });

   it('should fail to add contact with invalid data passed', (done) => {
       let newContact = {
           mobile: '94916410',
           group: 'friends'
       };
       request(app)
           .post('/contacts')
           .send(newContact)
           .expect(400)
           .end(done);
   });
});