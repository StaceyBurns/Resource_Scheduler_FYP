import { Component, OnInit, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Resource} from '../interfaces/interfaces';
import {ResourceId} from '../interfaces/interfaces';
// import { resource } from 'selenium-webdriver/http';

@Injectable()
export class DatabaseService implements OnInit {

  resourcesCol:AngularFirestoreCollection<Resource>;
  resources:any;

  resourceDoc:AngularFirestoreDocument<Resource>;
  resource:Observable<Resource>;
  selectedResource:string;

  calResources: any;

  loadedCompany:string;

  constructor(private afs:AngularFirestore){

  }

  ngOnInit(){
    this.resourcesCol = this.afs.collection('resource');
    this.resources = this.resourcesCol.snapshotChanges()
      .map(actions=>{
        return actions.map(a=> {
          const data = a.payload.doc.data() as Resource;
          const id = a.payload.doc.id;
          return{id,data};
        })
      })
      this.calResources =[];

  }
  

  addPost(name, note){
    var idName = "my-custom-id";
    this.afs.collection('resource').add({
      name: name, 
      note: note
    });
  }

  getPost(resourceId){
    this.resourceDoc = this.afs.doc('resource/'+resourceId);
    this.resource = this.resourceDoc.valueChanges();
    this.selectedResource = resourceId;
  }

  deletePost(resourceId){
    this.afs.doc('resource/'+resourceId).delete();
  }
  editResource(name, note){
    this.afs.collection('resource/').doc(this.selectedResource).update({
      name: name,
      note: note
  });
  // console.log(this.selectedResource);
  }  

  registerCompany(user, company){
    this.afs.collection('companies/').add({
      company: company,
      user: user,
    });
    console.log('company info added!!');
    this.loadedCompany = company;
  }


getData(calResources){
  
  return this.afs.collection("schedule").ref.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        calResources.push(doc.data());
    });
});
}

testAddDate(date, resource){
   this.afs.collection('schedule').add({
    start: date, 
    title: resource
  }).then(function() {
    console.log('schedule item added')
  });
 
  return this.afs.collection('resource').add({
    title: "straight from db",
    start: date, 
    resource: resource
  });
  
}



getdaydata(){ //returns object matching particular resource
console.log('should return Gggg');
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
deleteCalEvent(dateID, resourceTitle){
  console.log('database DELETE event');

let collectionRef = this.afs.collection('resource');
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

}







