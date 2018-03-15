import {Component, OnInit, Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Resource} from '../interfaces/interfaces';
import {ResourceId} from '../interfaces/interfaces';
import {Group} from '../interfaces/interfaces';
import {GroupId} from '../interfaces/interfaces';
import {Router} from '@angular/router';
// import { resource } from 'selenium-webdriver/http';

@Injectable()
export class DatabaseService implements OnInit {

  resourcesCol: AngularFirestoreCollection < Resource > ;
  resources: any;

  resourceDoc: AngularFirestoreDocument < Resource > ;
  resource: Observable < Resource > ;
  selectedResource: string;

  groupsCol: AngularFirestoreCollection < Group > ;
  groups: any;

  groupDoc: AngularFirestoreDocument < Group > ;
  group: Observable < Group > ;
  selectedGroup: string;

  calResources: any;


  loadedCompany: string;
  loadedUser: any;
  constructor(private router: Router, private afs: AngularFirestore) {

  }

//----------------------------------------------------------------------------------
//-----------------------Setup events-----------------------------------------------
//----------------------------------------------------------------------------------

  ngOnInit() {

    // this.calResources = [];
    this.onSignIn(); // prevents company reset on page reset
  }

  onSignIn() {
      console.log('on sign in loaded company ' + this.loadedCompany);
      this.loadedCompany = localStorage.getItem('loadedCompany');
    //   this.calResources = [];

      //--------------------------------set resources------------------------------------
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
        //--------------------------------set groups------------------------------------
          this.groupsCol = this.afs.collection('companies/').doc(this.loadedCompany).collection('groups');
          this.groups = this.groupsCol.snapshotChanges()
              .map(actions => {
                  return actions.map(a => {
                      const data = a.payload.doc.data() as Group;
                      const id = a.payload.doc.id;
                      return {
                          id,
                          data
                      };
                  })
              })
        //   this.router.navigate(['/schedule']);
  }

  getUserOnSignIn(email ? : string) {
      let _this = this;
      return this.afs.collection("users").ref.where('email', '==', email).get().then(function(querySnapshot)
          {
              querySnapshot.forEach(function(doc) {
                  _this.loadedUser = doc.data();
                  console.log('loadedUser')
                  console.log(_this.loadedUser)
                  console.log(_this.loadedUser['email'])
                  _this.loadedCompany =_this.loadedUser['company'];
                //   var value = _this.loadedUser[Object.keys(_this.loadedUser)[0]];
                //   console.log(value);
                localStorage.setItem('loadedCompany', _this.loadedUser['company']);
                _this.onSignIn();
              });
          });

  }

//----------------------------------------------------------------------------------
//-----------------------Auth events------------------------------------------------
//----------------------------------------------------------------------------------

  registerUserWithCompany(user, companyKey) {
      let _this = this;
      this.afs.collection('users')
          .ref.where('email', '==', user)
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  _this.afs.collection('users/').doc(doc.id).update({
                      company: companyKey
                  });
              });
              console.log('Adding ' + companyKey + ' to the user ' + user);
              _this.loadedCompany = companyKey;
              localStorage.setItem('loadedCompany', companyKey);
              _this.onSignIn();
              _this.router.navigate(['/schedule']);
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
                  localStorage.setItem('loadedCompany', doc.id);
                  _this.afs.collection('companies/').doc(doc.id).update({
                      key: doc.id
                  }); 
              }); 
          // }) 
          // .catch(function(error) {
          //     console.log("Error getting documents: ", error);
          }).then(function() {
            _this.registerOwnerWithCompany(user);
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
          console.log('OWNER -- adding key ' + _this.loadedCompany + ' to the user ' + user);
          _this.onSignIn();
          _this.router.navigate(['/schedule']);
      });
}


//----------------------------------------------------------------------------------
//-----------------------Calendar events--------------------------------------------
//----------------------------------------------------------------------------------

  getData(calResources) {

      return this.afs.collection("schedule").ref.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              calResources.push(doc.data());
          });
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
//----------------------------------------------------------------------------------
//-----------------------Schedule events--------------------------------------------
//----------------------------------------------------------------------------------

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

//----------------------------------------------------------------------------------
//-----------------------Resource events--------------------------------------------
//----------------------------------------------------------------------------------

  addResource(name, note) {
      var idName = "my-custom-id";
      this.afs.collection('companies/').doc(this.loadedCompany).collection('resources').add({
          name: name,
          note: note
      });
  }

  getResource(resourceId) {
      this.resourceDoc = this.afs.collection('companies/').doc(this.loadedCompany).collection('resources').doc(resourceId);
      this.resource = this.resourceDoc.valueChanges();
      this.selectedResource = resourceId;
  }

  deleteResource(resourceId) {
      this.afs.collection('companies/').doc(this.loadedCompany).collection('resources').doc(resourceId).delete();
  }

  editResource(name, note) {
      this.afs.collection('companies/').doc(this.loadedCompany).collection('resources/').doc(this.selectedResource).update({
          name: name,
          note: note
      });
  }

//----------------------------------------------------------------------------------
//-----------------------Resource events--------------------------------------------
//----------------------------------------------------------------------------------

addGroup(name, note) {
    var idName = "my-custom-id";
    this.afs.collection('companies/').doc(this.loadedCompany).collection('groups').add({
        name: name,
        note: note
    });
}

getGroup(groupId) {
    this.groupDoc = this.afs.collection('companies/').doc(this.loadedCompany).collection('groups').doc(groupId);
    this.group = this.groupDoc.valueChanges();
    this.selectedGroup = groupId;
}

deleteGroup(groupId) {
    this.afs.collection('companies/').doc(this.loadedCompany).collection('groups').doc(groupId).delete();
}

editGroup(name, note) {
    this.afs.collection('companies/').doc(this.loadedCompany).collection('groups/').doc(this.selectedGroup).update({
        name: name,
        note: note
    });
}

}