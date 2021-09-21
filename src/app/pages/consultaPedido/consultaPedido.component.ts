import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PedidoService } from './../../servicios/pedido.service';
import * as moment from 'moment';

@Component({
  selector: 'app-consultaPedido',
  templateUrl: './consultaPedido.component.html',
  styleUrls: ['./consultaPedido.component.css'],
})
export class ConsultaPedidoComponent implements OnInit {
  fechas: any;
  listPedidosFiltrado: any[] = [];

  createNotification(type: string, mensaje: string): void {
    this.notification.create(type, '', mensaje);
  }

  constructor(
    private pedidoServi: PedidoService,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {}

  consultar() {
    this.pedidoServi
      .getPedidoAprobado
      (moment(this.fechas[0]).startOf('days').add(1,'days').format('YYYY-MM-DD HH:mm'),
      moment(this.fechas[1]).endOf('days').add(1,'days').format('YYYY-MM-DD HH:mm'))
      .toPromise()
      .then((res: any[]) => {
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
