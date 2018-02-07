import { Component, OnInit, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

interface Resource{
  name:string;
  note:string;
}

interface ResourceId extends Resource{
  id:string;
}
@Injectable()
export class DatabaseService implements OnInit {

  resourcesCol:AngularFirestoreCollection<Resource>;
  resources:any;

  name:string;
  note:string;

  resourceDoc:AngularFirestoreDocument<Resource>;
  resource:Observable<Resource>;

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
  }

  addPost(){
    var idName = "my-custom-id";
    this.afs.collection('resource').add({'name':this.name, 'note':this.note});
  }

  getPost(resourceId){
    this.resourceDoc = this.afs.doc('resource/'+resourceId);
    this.resource = this.resourceDoc.valueChanges();
  }

  deletePost(resourceId){
    this.afs.doc('resource/'+resourceId).delete();
  }

}



