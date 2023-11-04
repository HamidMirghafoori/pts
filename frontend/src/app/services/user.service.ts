// user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { getApplications } from './api';
import { UserType } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private rootUrl = environment.SERVER_URL;

  constructor(private http: HttpClient) {}

  // addUser(uid: string, userData: any): Promise<void> {
  //   return this.db.object(`users/${uid}`).set(userData);
  // }

  // getUser(uid: string): Observable<AppUserType | null> {
  //   return this.db.object<AppUserType>(`users/${uid}`).valueChanges();
  // }

  // updateUser(uid: string, newData: AppUserType): Promise<void> {
  //   return this.db.object(`users/${uid}`).update(newData);
  // }

  // deleteUser(uid: string): Promise<void> {
  //   return this.db.object(`users/${uid}`).remove();
  // }

  getAllApplications(user: UserType | null): Observable<UserType[]> {
    const body = { token: user?.token };
    return this.http
      .post<any>(this.rootUrl + getApplications, body)
      .pipe(map((users) => users.applications));
  }
}
