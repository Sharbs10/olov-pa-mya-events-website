import { Injectable } from '@angular/core';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface SendMassSMSRequest {
  message: string;
}

interface SendMassSMSResponse {
  success: boolean;
  sent: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {
  private app: any;
  private db: any;
  private functionsUrl = 'https://us-central1-olov-mya-pa.cloudfunctions.net';

  constructor(private firestore: Firestore, private fns: Functions, private http: HttpClient) {
    // Initialize Firebase Realtime Database
    this.app = initializeApp(environment.firebase);
    this.db = getDatabase(this.app);
  }

  sendBroadcast(message: string): Observable<any> {
    return this.http.post(`${this.functionsUrl}/sendSMS`, { message });
  }

  // ----------------------
  // Realtime Database methods
  // ----------------------

  // Add a new subscriber to Realtime Database
  async addSubscriber(phone: string) {
    const subscribersRef = ref(this.db, 'subscribers');
    const newSubRef = push(subscribersRef);
    return set(newSubRef, {
      phone,
      subscribedAt: new Date().toISOString()
    });
  }

  // Listen to all subscribers
  onSubscribers(callback: (list: any[]) => void) {
    const subscribersRef = ref(this.db, 'subscribers');
    onValue(subscribersRef, snapshot => {
      const val = snapshot.val() || {};
      const arr = Object.entries(val).map(([id, data]) => ({ id, ...(data as any) }));
      callback(arr);
    });
  }

  // ----------------------
  // Firestore + Functions methods
  // ----------------------

  // Optional: Subscribe user in Firestore
  async subscribeUserFirestore(phone: string) {
    try {
      const subscribersRef = collection(this.firestore, 'subs');
      return await addDoc(subscribersRef, {
        phone,
        subscribedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Firestore error:', err);
      throw err; // let component handle it
    }
  }

  // Send mass SMS via Firebase Callable Function
  sendMassMessage(message: string) {
    const callable = httpsCallable<SendMassSMSRequest, SendMassSMSResponse>(this.fns, 'sendSMS');
    return callable({ message });
  }


}
