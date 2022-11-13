import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

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

  confirmPopup(message: string, confirmButtonText: string, cancelButtonText: string): Promise<SweetAlertResult<any>>{
    return Swal.fire({
      title: message,
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText
    })
  }
}
