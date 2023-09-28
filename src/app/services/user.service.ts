// user.service.ts
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { AppUserType } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase) { }

  addUser(uid: string, userData: any): Promise<void> {
    return this.db.object(`users/${uid}`).set(userData);
  }

  getUser(uid: string): Observable<AppUserType | null> {
    return this.db.object<AppUserType>(`users/${uid}`).valueChanges();
  }

  updateUser(uid: string, newData: any): Promise<void> {
    return this.db.object(`users/${uid}`).update(newData);
  }

  deleteUser(uid: string): Promise<void> {
    return this.db.object(`users/${uid}`).remove();
  }
}
