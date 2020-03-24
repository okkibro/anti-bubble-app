import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebService {
  readonly ROOT_URL
  constructor(private https: HttpClient) { 
    this.ROOT_URL = "https://localhost:3000";
  }

  public get(uri: string, payload: Object) {
    return this.https.get(`${this.ROOT_URL}/${uri}`, payload);
  }
  public post(uri: string, payload: Object) {
    return this.https.post(`${this.ROOT_URL}/${uri}`, payload);
  }
  public patch(uri: string, payload: Object) {
    return this.https.patch(`${this.ROOT_URL}/${uri}`, payload);
  }
  public delete(uri: string) {
    return this.https.delete(`${this.ROOT_URL}/${uri}`);
  }
}
