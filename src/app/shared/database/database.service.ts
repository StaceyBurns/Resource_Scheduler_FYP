import { Component, OnInit, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Resource} from '../interfaces/interfaces';
import {ResourceId} from '../interfaces/interfaces';
import { resource } from 'selenium-webdriver/http';



// interface Resource{
//   name:string;
//   note:string;
//   date:string;
// }

// interface ResourceId extends Resource{
//   id:string;
// }
@Injectable()
export class DatabaseService implements OnInit {

  resourcesCol:AngularFirestoreCollection<Resource>;
  resources:any;

  // name:string;
  // note:string;
  // date:string;
  // id:string;
  // chosenResource:any;

  resourceDoc:AngularFirestoreDocument<Resource>;
  resource:Observable<Resource>;
  selectedResource:string;

  calResources: any;

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


getData(calResources){
  return this.afs.collection("resource").ref.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        calResources.push(doc.data());
        // console.log(calResources);
        // console.log('from db service');
        // console.log(calResources[0]);
    });
});
}




}







