import {Component, OnInit, Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Resource} from '../interfaces/interfaces';
import {ResourceId} from '../interfaces/interfaces';
import { Router } from '@angular/router';
// import { resource } from 'selenium-webdriver/http';

@Injectable()
export class DatabaseService implements OnInit {

  resourcesCol: AngularFirestoreCollection < Resource > ;
  resources: any;

  resourceDoc: AngularFirestoreDocument < Resource > ;
  resource: Observable < Resource > ;
  selectedResource: string;

  calResources: any;

  loadedCompany: string;
  loadedUser: any;
  constructor(private router: Router, private afs: AngularFirestore) {

  }

  ngOnInit() {

      this.calResources = [];
  }

  onSignIn() {
      console.log('on sign in loaded company ' + this.loadedCompany)

      this.resourcesCol = this.afs.collection('companies/').doc(this.loadedCompany).collection('resources');
      this.resources = this.resourcesCol.snapshotChanges()
          .map(actions => {
              return actions.map(a => {
                  const data = a.payload.doc.data() as Resource;
                  const id = a.payload.doc.id;
                  return {
                      id,
                      data
                  };
              })
          })
          this.router.navigate(['/schedule']);
  }

  getUserOnSignIn(email ? : string) {
      this.afs.collection('users')
          .ref.where('email', '==', email)
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  // _this.loadedCompany = doc.id;
                  console.log(doc.data);

              });
          })

      let _this = this;
      return this.afs.collection("users").ref.where('email', '==', email).get().then(function(querySnapshot)

          {
              querySnapshot.forEach(function(doc) {
                  _this.loadedUser = doc.data();
                  console.log('loadedUser')
                  console.log(_this.loadedUser)
              });
          });

  }

  registerUserWithCompany(user, companyKey) {
      let _this = this;
      this.afs.collection('users')
          .ref.where('email', '==', user)
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  // _this.loadedCompany = doc.id;
                  _this.afs.collection('users/').doc(doc.id).update({
                      company: companyKey
                  });
              });
              console.log('gonna add key ' + companyKey + ' to the user ' + user);
              _this.onSignIn();
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
  }


  registerNewCompany(user, company) {
    let _this = this;
      this.afs.collection('companies/').add({
          name: company,
          users: [user],
      }).then(function() {
        _this.registerCompanyID(user, company);
        console.log('REGISTER new company complete');
        console.log('begfore ...........8888888888888888888888888888' + _this.loadedCompany +'fsdcdv' )
    });
  }

  registerCompanyID(user, company) {
      let _this = this;
      this.afs.collection('companies')
          .ref.where('name', '==', company)
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  _this.loadedCompany = doc.id;
                  console.log('this waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaan');
                  _this.afs.collection('companies/').doc(doc.id).update({
                      // key: doc.id,
                      key: doc.id
                  }); 
                  // _this.loadedCompany ='works every time??';
              }); 
          // }) 
          // .catch(function(error) {
          //     console.log("Error getting documents: ", error);
          }).then(function() {
            _this.registerOwnerWithCompany(user);
            console.log('REGISTER company ID complete');
        }); 
  }

  registerOwnerWithCompany(user) {
    let _this = this;
    this.afs.collection('users')
        .ref.where('email', '==', user)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                _this.afs.collection('users/').doc(doc.id).update({
                    company: _this.loadedCompany
                });
            });
        }).then(function() {
          console.log('REGISTER owner with company complete');
          console.log('OWNER -- gonna add key ' + _this.loadedCompany + ' to the user ' + user);
          _this.onSignIn();
      });
}


  getData(calResources) {

      return this.afs.collection("schedule").ref.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              // console.log(doc.id, " => ", doc.data());
              calResources.push(doc.data());
          });
      });
  }

  testAddDate(date, resource) {
      this.afs.collection('schedule').add({
          start: date,
          title: resource
      }).then(function() {
          console.log('schedule item added')
      });

      return this.afs.collection('companies/').doc(this.loadedCompany).collection('resources').add({
          title: "straight from db",
          start: date,
          resource: resource
      });

  }



  getdaydata() { //returns object matching particular resource
      this.afs.collection('days')
          .ref.where('title', '==', 'Gggg')
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  console.log(doc.id, " => ", doc.data());
              });
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
  }

  // delete field data for match
  deleteCalEvent(dateID, resourceTitle) {
      let collectionRef = this.afs.collection('schedule');
      collectionRef.ref.where("title", "==", resourceTitle).where("start", "==", dateID)
          .get()
          .then(querySnapshot => {
              querySnapshot.forEach((doc) => {
                  doc.ref.update({
                      title: '',
                      start: ''
                  }).then(() => {
                      console.log("Document successfully deleted!");
                  }).catch(function(error) {
                      console.error("Error removing document: ", error);
                  });
              });
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
  }

  addPost(name, note) {
      var idName = "my-custom-id";
      this.afs.collection('companies/').doc(this.loadedCompany).collection('resources').add({
          name: name,
          note: note
      });
  }

  getPost(resourceId) {
      this.resourceDoc = this.afs.collection('companies/').doc(this.loadedCompany).collection('resources').doc(resourceId);
      this.resource = this.resourceDoc.valueChanges();
      this.selectedResource = resourceId;
  }

  deletePost(resourceId) {
      this.afs.collection('companies/').doc(this.loadedCompany).collection('resources').doc(resourceId).delete();
  }
  editResource(name, note) {
      this.afs.collection('companies/').doc(this.loadedCompany).collection('resources/').doc(this.selectedResource).update({
          name: name,
          note: note
      });
  }

}