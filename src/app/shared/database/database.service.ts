import {Component, OnInit, Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Resource} from '../interfaces/interfaces';
import {ResourceId} from '../interfaces/interfaces';
import {Group} from '../interfaces/interfaces';
import {GroupId} from '../interfaces/interfaces';
import {Router} from '@angular/router';

@Injectable()
export class DatabaseService implements OnInit {

  resourcesCol: AngularFirestoreCollection < Resource > ;
  resources: Observable<any>;

  resourceDoc: AngularFirestoreDocument < Resource > ;
  resource: Observable < Resource > ;
  selectedResource: string;

  groupsCol: AngularFirestoreCollection < Group > ;
  groups: any;

  groupDoc: AngularFirestoreDocument < Group > ;
  group: Observable < Group > ;
  selectedGroup: string;

  filteredGroup: any;
  filteredGroupItem: Observable <Group>;

  calResources: any;

  registeredCompanies = [];
  registeredEmails = [];


  loadedCompany: string;
  loadedUser: any;
  loadedScheduleDates = [];
  loadedResourceDates: any;
  constructor(private router: Router, private afs: AngularFirestore) {

  }

//----------------------------------------------------------------------------------
//-----------------------Setup events-----------------------------------------------
//----------------------------------------------------------------------------------

  ngOnInit() {
    this.onSignIn(); // prevents company reset on page reset
  }

  onSignIn() {
      this.loadedCompany = localStorage.getItem('loadedCompany');
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
              this.getCompanyName();
  }

  getUserOnSignIn(email ? : string) {
      let _this = this;
      return this.afs.collection("users").ref.where('email', '==', email).get().then(function(querySnapshot)
          {
              querySnapshot.forEach(function(doc) {
                  _this.loadedUser = doc.data();
                  _this.loadedCompany =_this.loadedUser['company'];
                localStorage.setItem('loadedCompany', _this.loadedUser['company']);
                _this.onSignIn();
              });
          });
  }

  getCompanyName(){
      let _this = this;
   this.afs.collection('companies').ref.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let data = doc.data();
            // doc.data() is never undefined for query doc snapshots
            localStorage.setItem('companyName', (data['name']));
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
          _this.onSignIn();
          _this.router.navigate(['/schedule']);
      });
}

getAllCompanies() {
    let _this =this;
    return this.afs.collection('companies').ref.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let data = doc.data();
            // doc.data() is never undefined for query doc snapshots
            _this.registeredCompanies.push(data['key'])
        });
    });
}
getRegisteredEmails(){
    let _this =this;
return this.afs.collection('users').ref.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        let data = doc.data();
        // doc.data() is never undefined for query doc snapshots
        _this.registeredEmails.push(data['email'])
    });
});
}


//----------------------------------------------------------------------------------
//-----------------------Calendar events--------------------------------------------
//----------------------------------------------------------------------------------

  getData(calResources) {

      return this.afs.collection('companies/').doc(this.loadedCompany).collection("schedule").ref.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              calResources.push(doc.data());
          });
      });
  }

//   getdaydata() { //returns object matching particular resource
//       this.afs.collection('days')
//           .ref.where('title', '==', 'Gggg')
//           .get()
//           .then(function(querySnapshot) {
//               querySnapshot.forEach(function(doc) {
//                   console.log(doc.id, " => ", doc.data());
//               });
//           })
//           .catch(function(error) {
//           });
//   }
//----------------------------------------------------------------------------------
//-----------------------Schedule events--------------------------------------------
//----------------------------------------------------------------------------------

    getScheduledDates(resource) {
        let _this = this;
        this.loadedResourceDates = [];
        return this.afs.collection("companies").doc(this.loadedCompany).collection('resources').ref.where('title', '==', resource).get().then(function(querySnapshot)
            {
                querySnapshot.forEach(function(doc) {
                    let data = doc.data();
                    for(let i=0; i<data['start'].length; i++){
                    _this.loadedResourceDates.push(data['start'][i]);
                    }
                });
            });            
    }

  testAddDate(resource, date) {
    this.loadedResourceDates.push(date);
    console.log('dates array after new date pushed');
    console.log(this.loadedResourceDates);
    let collectionRef = this.afs.collection('companies/').doc(this.loadedCompany).collection('resources');
    collectionRef.ref.where("title", "==", resource)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                doc.ref.update({
                    start: this.loadedResourceDates
                })
            })
        })


    return this.afs.collection('companies/').doc(this.loadedCompany).collection('schedule').add({
        start: date,
        title: resource
    }).then(function() {
        console.log('schedule item added')
    });

    //-----------Add something like this if the resource is new

    // return this.afs.collection('companies/').doc(this.loadedCompany).collection('resources').add({
    //     title: "straight from db",
    //     start: date,
    //     resource: resource
    // });

}

  // delete field data for match
  //check if array needs to be processed backwards
  deleteCalEvent(dateID, resourceTitle) {
      console.log('from delete calevent delete cal date '+ dateID + ' resource '+ resourceTitle)
      let collectionRef = this.afs.collection('companies/').doc(this.loadedCompany).collection('schedule');
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
          let _this = this;
          this.getScheduledDates(resourceTitle).then(function(){
            for (var i=_this.loadedResourceDates.length-1; i>=0; i--) {
                if (_this.loadedResourceDates[i] === dateID) {
                    _this.loadedResourceDates.splice(i, 1);
                }
            }
        }).then(function(){
            let resCollectionRef = _this.afs.collection('companies/').doc(_this.loadedCompany).collection('resources');
            resCollectionRef.ref.where("title", "==", resourceTitle)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((doc) => {
                    doc.ref.update({
                        start: _this.loadedResourceDates
                    })
                })
            });
        })
  }

//----------------------------------------------------------------------------------
//-----------------------Resource events--------------------------------------------
//----------------------------------------------------------------------------------

  addResource(name, note, group, schedulingDepend) {
      var idName = "my-custom-id";
      this.afs.collection('companies/').doc(this.loadedCompany).collection('resources').add({
          title: name,
          note: note,
          group: group,
          schedulingDependency: schedulingDepend,
          start: []
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

  editResource(name, note, group, schedulingDepend) {
      let _this = this;
    this.getScheduledDates(name).then(function(){
        console.log(_this.loadedResourceDates);
      _this.afs.collection('companies/').doc(_this.loadedCompany).collection('resources/').doc(_this.selectedResource).update({
          title: name,
          note: note,
          group: group,
          start:  _this.loadedResourceDates,
          schedulingDependency: schedulingDepend
      });
    })
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

//----------------------------------------------------------------------------------
//-----------------------Filtering events--------------------------------------------
//----------------------------------------------------------------------------------


filterByGrouup(group:any){
    this.resourcesCol = this.afs.collection('companies/').doc(this.loadedCompany).collection('resources', ref =>{
            return ref.where("group", "==", group);
    })
    this.resources = this.resourcesCol.valueChanges();
    console.log('FILTER function running woth argument ' + group)
    console.log(this.resources);
    this.resources.forEach(item => {
        console.log('Item:', item);
    });



}



}