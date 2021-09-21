import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private http: HttpClient) { }

  postPedido(pedido: any){
    return this.http.post(`${apiUrl}/pedido`, pedido)
  } 

  pedidosRegistrados(){    
    return this.http.get(`${apiUrl}/pedido/pedidosRegistrados`)
  }

  putPedido(pedido: any, id){    
    return this.http.put(`${apiUrl}/pedido/${id}`, pedido)
  }

  getPedido(){    
    return this.http.get(`${apiUrl}/pedido`)
  }

  getPedidoRegistrado(numPedido?, cliente?, fechaCreacion?){    
    return this.http.get(`${apiUrl}/pedido/pedidosRegistrados/${numPedido}/${cliente}/${fechaCreacion}`)
  }

  getPedidoAprobado(fechaI, fechaF){    
    return this.http.get(`${apiUrl}/pedido/pedidosAprobados/${fechaI}/${fechaF}`)
  }
}
