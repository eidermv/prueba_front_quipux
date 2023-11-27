import * as CryptoJS from 'crypto-js';

import { Injectable } from '@angular/core';

const SecureStorage = require('secure-web-storage');
const SECRET_KEY: any = 'E5ta35unAc1a6E';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  public secureStorage = new SecureStorage(localStorage, {
    hash: function hash(key: string | CryptoJS.lib.WordArray) {
      key = CryptoJS.SHA256(key, SECRET_KEY);

      return key.toString();
    },
    encrypt: function encrypt(data: any) {
      data = CryptoJS.AES.encrypt(data, SECRET_KEY);

      data = data.toString();

      return data;
    },
    decrypt: function decrypt(data: any) {
      data = CryptoJS.AES.decrypt(data, SECRET_KEY);

      data = data.toString(CryptoJS.enc.Utf8);

      return data;
    }
  });
}
