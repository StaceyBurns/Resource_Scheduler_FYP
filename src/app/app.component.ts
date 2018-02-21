import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {Router} from "@angular/router";

interface Resource{
  name:string;
  note:string;
}

interface ResourceId extends Resource{
  id:string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {
  loadedFeature = 'schedule'
  onNavigate(feature:string){
    this.loadedFeature=feature;
  }
  dbResources: Observable<any[]>;

  // resourcesCol:AngularFirestoreCollection<Resource>;
  // resources:any;

  // name:string;
  // note:string;

  // resourceDoc:AngularFirestoreDocument<Resource>;
  // resource:Observable<Resource>;

  constructor(private afs:AngularFirestore){

    
 
      // console.log(afs);
      this.dbResources = afs.collection('resource').valueChanges();

  }

  ngOnInit(){
    // this.resourcesCol = this.afs.collection('resource');
    // this.resources = this.resourcesCol.snapshotChanges()
    //   .map(actions=>{
    //     return actions.map(a=> {
    //       const data = a.payload.doc.data() as Resource;
    //       const id = a.payload.doc.id;
    //       return{id,data};
    //     })
    //   })
  }

  // addPost(){
  //   var idName = "my-custom-id";
  //   this.afs.collection('resource').add({'name':this.name, 'note':this.note});
  // }

  // getPost(resourceId){
  //   this.resourceDoc = this.afs.doc('resource/'+resourceId);
  //   this.resource = this.resourceDoc.valueChanges();
  // }

  // deletePost(resourceId){
  //   this.afs.doc('resource/'+resourceId).delete();
  // }


}




