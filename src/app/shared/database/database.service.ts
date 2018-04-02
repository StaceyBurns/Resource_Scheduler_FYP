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

  private resourcesCol: AngularFirestoreCollection < Resource > ;
  public resources: Observable<any>;

  private resourceDoc: AngularFirestoreDocument < Resource > ;
  public resource: Observable < Resource > ;
  public selectedResource: string;

  private groupsCol: AngularFirestoreCollection < Group > ;
  public groups: any;

  private groupDoc: AngularFirestoreDocument < Group > ;
  public group: Observable < Group > ;
  public selectedGroup: string;

  filteredGroup: any;
  filteredGroupItem: Observable <Group>;

  public calResources: any;

  public registeredCompanies = []; //holds a list of all registered companies on service
  public registeredEmails = []; //holds a list of all registered emails on service


  private loadedCompany: string; //holds the reference to the company that the user is signed in with
  private loadedUser: any; // holds the reference to the signed in user
  private loadedResourceDates: any; //dates that a resource has been scheduled for
  private loadedResourceToResource: any; //resource-resource scheduling information (dates and titles)
  constructor(private router: Router, private afs: AngularFirestore) { 
  }

//----------------------------------------------------------------------------------
//-----------------------Setup events-----------------------------------------------
//----------------------------------------------------------------------------------

  ngOnInit() {
    this.onSignIn(); // prevents company reset on page reset
  }

  onSignIn() { // this builds fundamental data needed to run the programme and should be called on startup and when a page refresh is likely to ensure consistency
      this.loadedCompany = localStorage.getItem('loadedCompany'); //set company in local storage to persist throughout refreshes
      //--------------------------------set resources------------------------------------
      this.resourcesCol = this.afs.collection('companies/').doc(this.loadedCompany).collection('resources'); //get resources collection from DB
      this.resources = this.resourcesCol.snapshotChanges() //set resources observable to results of DB query as Resource interface
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
          this.groupsCol = this.afs.collection('companies/').doc(this.loadedCompany).collection('groups'); //get groups collection from DB
          this.groups = this.groupsCol.snapshotChanges() //set groups observable to results of DB query as Group interface
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
              this.getCompanyName(); //get the company name
  }

  getUserOnSignIn(email ? : string) { //returns the user data and sets the users company
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

  getCompanyName(){ //saves the companies name to local storage to persist throughout refreshes
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

  registerUserWithCompany(user, companyKey) { //registers a user with an ALREADY EXISTING company
      let _this = this;
      this.afs.collection('users') //gets user from DB (insertion is handled by auth service)
          .ref.where('email', '==', user)
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  _this.afs.collection('users/').doc(doc.id).update({ //inserts the verified company key entered by the user
                      company: companyKey
                  });
              });
              _this.loadedCompany = companyKey; // sets loaded company and saves to local storage
              localStorage.setItem('loadedCompany', companyKey);
              _this.onSignIn(); //call sign in function to set up all data for user
              _this.router.navigate(['/schedule']); //reroute to the schedule page now that everything is set up for the user and they have permissions to view all pages
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
  }


  registerNewCompany(user, company) { //registers a new company in DB
    let _this = this;
      this.afs.collection('companies/').add({ // adds company name and owner to companies collection in DB
          name: company,
          users: [user],
      }).then(function() {
        _this.registerCompanyID(user, company); //register the generated ID with the company to use as company key
    });
  }

  registerCompanyID(user, company) { //registers the firestore generated ID with the new companyto use as the company ID
      let _this = this;
      this.afs.collection('companies')
          .ref.where('name', '==', company) //get the company whose name was just made
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  _this.loadedCompany = doc.id; //set the loaded company to that of the just generated company ID
                  localStorage.setItem('loadedCompany', doc.id);
                  _this.afs.collection('companies/').doc(doc.id).update({ //update the DB document setting the key to the firestore ID
                      key: doc.id
                  }); 
              }); 
          }).then(function() {
            _this.registerOwnerWithCompany(user); //register the company key to the owners user account
        }); 
  }

  registerOwnerWithCompany(user) {
    let _this = this;
    this.afs.collection('users')
        .ref.where('email', '==', user) //get the owner from DB
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                _this.afs.collection('users/').doc(doc.id).update({ //update the users company to the loadedcompany, previously set from company ID, which will be used as the company key
                    company: _this.loadedCompany
                });
            });
        }).then(function() {
          _this.onSignIn(); //call sign in function to set up all data for user
          _this.router.navigate(['/schedule']); //reroute to the schedule page now that everything is set up for the user and they have permissions to view all pages
      });
}

getAllCompanies() { // get all the registered companies from the DB and push to registeredCompanies array
    let _this =this;
    return this.afs.collection('companies').ref.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let data = doc.data();
            _this.registeredCompanies.push(data['key'])
        });
    });
}
getRegisteredEmails(){ // get all registered emails from FB and push to registeredEmails array
    let _this =this;
return this.afs.collection('users').ref.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        let data = doc.data();
        _this.registeredEmails.push(data['email'])
    });
});
}


//----------------------------------------------------------------------------------
//-----------------------Calendar events--------------------------------------------
//----------------------------------------------------------------------------------

  getData(calResources) { //return all data from schedule and push to calResources array
      return this.afs.collection('companies/').doc(this.loadedCompany).collection("schedule").ref.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              calResources.push(doc.data());
          });
      });
  }
//----------------------------------------------------------------------------------
//-----------------------Schedule events--------------------------------------------
//----------------------------------------------------------------------------------

    getScheduledDates(resource) {//returns all dates schedules within a specific resources collection in DB
        let _this = this;
        this.loadedResourceDates = []; //resets array to empty before beginning
        return this.afs.collection("companies").doc(this.loadedCompany).collection('resources').ref.where('title', '==', resource).get().then(function(querySnapshot)
            {
                querySnapshot.forEach(function(doc) { 
                    let data = doc.data();
                    for(let i=0; i<data['start'].length; i++){ //gets all data from the 'start' field in resource document from DB and pushes it to loadedResourceDates array
                    _this.loadedResourceDates.push(data['start'][i]);
                    }
                });
            });            
    }

    getResourceToResource(resource) { // gets resource-resource scheduling data from specified resource's collection
        let _this = this;
        this.loadedResourceToResource = []; //reset array before starting
        return this.afs.collection("companies").doc(this.loadedCompany).collection('resources').ref.where('title', '==', resource).get().then(function(querySnapshot)
            {
                    querySnapshot.forEach(function(doc) {
                    let data = doc.data();
                    _this.loadedResourceToResource = data['resourceToResource']; //set local loadedResourceToResource to that of data stored in 'resourceToResource' field of specified resource document in DB
                });
            });            
    }

  testAddDate(resource, date) { // ad scheduled data data to resource and schedule collections in DB
    this.loadedResourceDates.push(date); //push the newly added date to the array of scheduled dates
    let collectionRef = this.afs.collection('companies/').doc(this.loadedCompany).collection('resources'); // get specified resource document from DB
    collectionRef.ref.where("title", "==", resource)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                doc.ref.update({
                    start: this.loadedResourceDates //update the resources start date with the new array (old array with new data pushed)
                })
            })
        })
    return this.afs.collection('companies/').doc(this.loadedCompany).collection('schedule').add({ //get the loaded companies schedule collection from DB
        start: date,
        title: resource // add a new document to the collection with the new fields detailing start date and resource title
    })
}

scheduleResourceToResource(resource, date) { //adds resource-resource scheduling data to specified resource document in DB
    let __this = this;
    this.getResourceToResource(resource).then(function(){ // call this to populate the loadedResourceToResource array with the pre existing data from DB
    __this.loadedResourceToResource[0][date] = resource; // add new key value pair to the object inside array, with the start date and the  title of the resource which has been scheduled to resource x
    let collectionRef = __this.afs.collection('companies/').doc(__this.loadedCompany).collection('resources');
    collectionRef.ref.where("title", "==", resource) // get the document from DB for specified resource
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                doc.ref.update({
                    resourceToResource: __this.loadedResourceToResource //update 'resourceToResource' field in document, adding newly scheduled date and resource
                })
            })
            console.log('R to R scheduled for ' + resource)
        })
    })
}

  deleteCalEvent(dateID, resourceTitle) { //delete scheduling data for matched documents
    this.getResourceToResource(resourceTitle); // call this to populate the loadedResourceToResource array with the pre existing data from DB
      let collectionRef = this.afs.collection('companies/').doc(this.loadedCompany).collection('schedule'); 
      collectionRef.ref.where("title", "==", resourceTitle).where("start", "==", dateID) // documents from the loaded companies schedule document where the title and start date match
          .get()
          .then(querySnapshot => {
              querySnapshot.forEach((doc) => { //empty the data from each document
                  doc.ref.update({
                      title: '',
                      start: ''
                  }).then(function(){
                      console.log("Document successfully deleted!");
                  }).catch(function(error) {
                      console.error("Error removing document: ", error);
                  });
              });
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
          let __this = this;
          this.getScheduledDates(resourceTitle).then(function(){  // call this to get all the data from the 'start' field of the specified resource and push it to the loadedResourceDates array
          //the dates array needs to be processed client side and replaced on the DB otherwise all previous data will be overwritten  
          //therefore we get the current array from the db, process it as a local array and push the local array to the db
          for (var i=__this.loadedResourceDates.length-1; i>=0; i--) {
                if (__this.loadedResourceDates[i] === dateID) { // if an item in the array matched the date to be deleted, remove it
                    __this.loadedResourceDates.splice(i, 1);
                }
            }
        }).then(function(){
            delete __this.loadedResourceToResource[0][dateID]; // loadedResoureToResource is populated at the start of this function. delete the key value pair 
            //from the 0 index of the array which matched the date to be deleted. The array will only ever reach 0 and will never be empty
            //the resource-resource array needs to be processed client side and replaced in the array otherwise all data will be overwritten
            //therefore we get the current array from the db, process it as a local array and push the local array to the db
            let resCollectionRef = __this.afs.collection('companies/').doc(__this.loadedCompany).collection('resources');
            resCollectionRef.ref.where("title", "==", resourceTitle) // get the specified resource document from DB
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((doc) => {
                    doc.ref.update({
                        start: __this.loadedResourceDates, //update the start field with the new array with date spliced
                        resourceToResource: __this.loadedResourceToResource //update the resourceToResource field with date deleted
                    })
                })
            });
        })
  }

//----------------------------------------------------------------------------------
//-----------------------Resource events--------------------------------------------
//----------------------------------------------------------------------------------

  addResource(name, note, group, schedulingDepend) { //adds a new resource document to the DB
      var idName = "my-custom-id";
      this.afs.collection('companies/').doc(this.loadedCompany).collection('resources').add({ // get resource collection from DB, add new document with specified fields
          title: name,
          note: note,
          group: group,
          schedulingDependency: schedulingDepend,
          start: [],
          resourceToResource: [{'empty':'empty'}] // this endures that resourceToResource will never return null/undefined/empty before data is added or when all dates have been deleted
      });
  }

  getResource(resourceId) { //gets specific resource from DB and sets 'resource' to such
      this.resourceDoc = this.afs.collection('companies/').doc(this.loadedCompany).collection('resources').doc(resourceId);
      this.resource = this.resourceDoc.valueChanges();
      this.selectedResource = resourceId; //set selectedResource to access the current resources ID globally
  }

  deleteResource(resourceId) { // deletes specified resource document from DB
      this.afs.collection('companies/').doc(this.loadedCompany).collection('resources').doc(resourceId).delete();
  }

  editResource(name, note, group, schedulingDepend) { // edits specified resource document, updating only the specified fields
      let _this = this;
    this.getScheduledDates(name).then(function(){
        console.log(_this.loadedResourceDates);
      _this.afs.collection('companies/').doc(_this.loadedCompany).collection('resources/').doc(_this.selectedResource).update({
          title: name,
          note: note,
          group: group,
        //   start:  _this.loadedResourceDates,
          schedulingDependency: schedulingDepend
      });
    })
  }

//----------------------------------------------------------------------------------
//-----------------------Group events--------------------------------------------
//----------------------------------------------------------------------------------

addGroup(name, note) { //adds a new group document to the DB
    var idName = "my-custom-id";
    this.afs.collection('companies/').doc(this.loadedCompany).collection('groups').add({ // get group collection from DB, add new document with specified fields
        name: name,
        note: note
    });
}

getGroup(groupId) { //gets specific group from DB and sets 'group' to such
    this.groupDoc = this.afs.collection('companies/').doc(this.loadedCompany).collection('groups').doc(groupId);
    this.group = this.groupDoc.valueChanges();
    this.selectedGroup = groupId; //set selectedGroup to access the current groups ID globally
}

deleteGroup(groupId) { // deletes specified group document from DB
    this.afs.collection('companies/').doc(this.loadedCompany).collection('groups').doc(groupId).delete();
}

editGroup(note) { // edits specified group document, updating only the specified fields
    this.afs.collection('companies/').doc(this.loadedCompany).collection('groups/').doc(this.selectedGroup).update({
        note: note
    });
}

//----------------------------------------------------------------------------------
//-----------------------Filtering events--------------------------------------------
//----------------------------------------------------------------------------------
filterByGroup(group:any){
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