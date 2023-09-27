// user.service.ts
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase) { }

  // CREATE: Add user information to the database
  addUser(uid: string, userData: any): Promise<void> {
    return this.db.object(`users/${uid}`).set(userData);
  }

  // READ: Get user information from the database
  getUser(uid: string): Observable<any> {
    return this.db.object(`users/${uid}`).valueChanges();
  }

  // UPDATE: Update user information in the database
  updateUser(uid: string, newData: any): Promise<void> {
    return this.db.object(`users/${uid}`).update(newData);
  }

  // DELETE: Delete user information from the database
  deleteUser(uid: string): Promise<void> {
    return this.db.object(`users/${uid}`).remove();
  }
}
