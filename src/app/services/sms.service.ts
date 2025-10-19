import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  private baseUrl = environment.firebaseFunctionsBaseUrl;

  constructor(private http: HttpClient) {}

 sendMassSMS(message: string, numbers: string[]) {
  return this.http.post('/sendSMS', { message, numbers });
}

}
