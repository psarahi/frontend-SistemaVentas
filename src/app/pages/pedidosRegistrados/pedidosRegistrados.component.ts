import { Component, OnInit } from '@angular/core';
import { PedidoProducto } from '../../modelos/pedidoProducto';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PedidoService } from './../../servicios/pedido.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import * as moment from 'moment';

@Component({
  selector: 'app-pedidosRegistrados',
  templateUrl: './pedidosRegistrados.component.html',
  styleUrls: ['./pedidosRegistrados.component.css'],
})
export class PedidosRegistradosComponent implements OnInit {
  expandSet = new Set<number>();
  listPedidos: PedidoProducto[] = [];
  listPedidosFiltrado: PedidoProducto[] = [];
  cliente: string = '';
  idPedido: string;
  cantProducto: number = 0;
  usuarios: string;
  fechaCreacion: any;
  pedidoProductos: any[] = [];
  listCliente: any[] = [];
  disableAprobar: boolean = true;
  numPedido: string = null;
  clienteFiltro: string = null;
  fechaCreaFiltro: any = null;

  createNotification(type: string, mensaje: string): void {
    this.notification.create(type, '', mensaje);
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  constructor(
    private pedidoServi: PedidoService,
    private notification: NzNotificationService,
    private clienteServi: ClienteService
  ) { }

  ngOnInit() {
    this.disableAprobar =
      localStorage.getItem('tipo') == 'supervisor' ? false : true;
    this.clienteServi
      .getCliente()
      .toPromise()
      .then((dataC: any) => {
        this.listCliente = dataC;

        this.pedidoServi
          .pedidosRegistrados()
          .toPromise()
          .then((res: PedidoProducto[]) => {
            this.listPedidos = res;

            console.log(this.listPedidos);
          });
      });
  }

  guardarPedido() {
    const pedido = {
      clientes: this.cliente,
      usuarios: this.usuarios,
      productos: this.pedidoProductos,
      fechaCreacion: this.fechaCreacion,
      fechaAprobacion: new Date(),
      aprobadoPor: localStorage.getItem('id'),
      estado: 'Aprobado',
    };

    this.pedidoServi
      .putPedido(pedido, this.idPedido)
      .toPromise()
      .then(
        (data: any) => {
          this.createNotification(
            'success',
            'Pedido a sido aprobado con exito'
          );
        },
        (error) => {
          console.log(error);
          this.createNotification('error', 'No se puedo aprobar el pedido');
        }
      );
  }

  aprobarPedido(data) {
    this.idPedido = data._id;
    this.cliente = data.clientes._id;
    this.usuarios = data.usuarios._id;
    this.fechaCreacion = data.fechaCreacion;
    this.pedidoProductos = data.productos;

    const pedido = {
      clientes: this.cliente,
      usuarios: this.usuarios,
      productos: this.pedidoProductos,
      fechaCreacion: this.fechaCreacion,
      fechaAprobacion: new Date(),
      aprobadoPor: localStorage.getItem('id'),
      estado: 'Aprobado',
    };

    this.pedidoServi
      .putPedido(pedido, this.idPedido)
      .toPromise()
      .then(
        (data: any) => {
          this.listPedidosFiltrado = this.listPedidosFiltrado.filter((x) => {
            x._id != this.idPedido;
          });
          this.createNotification(
            'success',
            'Pedido a sido aprobado con exito'
          );
        },
        (error) => {
          console.log(error);
          this.createNotification('error', 'No se puedo aprobar el pedido');
        }
      );
  }

  consultar() {
    this.pedidoServi
      .getPedidoRegistrado(
        this.numPedido,
        this.clienteFiltro,
        this.fechaCreaFiltro
      )
      .toPromise()
      .then((res: PedidoProducto[]) => {
        this.listPedidosFiltrado = res;

        if (res.length == 0) {
          this.createNotification(
            'warning',
            'No se puedo encontrar ningun pedido'
          );
        }

        console.log(this.listPedidosFiltrado);
      });
  }
}
