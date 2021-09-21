import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

constructor(private http: HttpClient) { }

getProductos(){
  console.log(`${apiUrl}/inventario`);
  
  return this.http.get(`${apiUrl}/inventario`)
}

}
