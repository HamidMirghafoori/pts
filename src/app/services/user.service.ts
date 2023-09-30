// user.service.ts
import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { Observable, map } from 'rxjs';
import { AppUserType } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersRef!: AngularFireList<AppUserType>;

  constructor(private db: AngularFireDatabase) {
    this.usersRef = db.list('users');
  }

  addUser(uid: string, userData: any): Promise<void> {
    return this.db.object(`users/${uid}`).set(userData);
  }

  getUser(uid: string): Observable<AppUserType | null> {
    return this.db.object<AppUserType>(`users/${uid}`).valueChanges();
  }

  updateUser(uid: string, newData: AppUserType): Promise<void> {
    return this.db.object(`users/${uid}`).update(newData);
  }

  deleteUser(uid: string): Promise<void> {
    return this.db.object(`users/${uid}`).remove();
  }

  getAllApplications(): Observable<AppUserType[]> {
    return this.usersRef.snapshotChanges().pipe(
      map((users) => {
        return users
          .filter((user) => user.payload.val()?.status === 'pending')
          .map((c) => ({
            ...(c.payload.val() as AppUserType),
            id: c.key ?? '',
          }));
      })
    );
  }
}
