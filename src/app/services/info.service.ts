import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor() { }

  popupInfo(message: string) {
    Swal.fire({
      title: message,
      showCancelButton: false,
      confirmButtonText: 'Ok'
    })
  }
}
