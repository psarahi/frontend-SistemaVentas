import { PedidoService } from './../../servicios/pedido.service';
import { ClienteService } from './../../servicios/cliente.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventarioService } from 'src/app/servicios/inventario.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PedidoProducto } from '../../modelos/pedidoProducto';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css'],
})
export class PedidoComponent implements OnInit {
  expandSet = new Set<number>();

  listPedidos: PedidoProducto[] = [];
  isVisible: boolean;
  validateForm!: FormGroup;
  validateFormProducto!: FormGroup;
  listProductos: any[] = [];
  pedidoProductos: any[] = [];
  listCliente: any[] = [];
  isVisibleproducto: boolean;
  cliente: string = '';
  idPedido: string;
  cantProducto: number = 0;
  usuarios: string;
  fechaCreacion: any;
  disablePedido: boolean = true;
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
    private fb: FormBuilder,
    private inventarioService: InventarioService,
    private clienteServi: ClienteService,
    private pedidoServi: PedidoService,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.isVisible = false;
    this.isVisibleproducto = false;

    this.inventarioService
      .getProductos()
      .toPromise()
      .then((data: any) => {
        this.listProductos = data;

        this.clienteServi
          .getCliente()
          .toPromise()
          .then((dataC: any) => {
            this.listCliente = dataC;
          });

        this.pedidoServi
          .pedidosRegistrados()
          .toPromise()
          .then((res: PedidoProducto[]) => {
            this.listPedidos = res;

            console.log(this.listPedidos);
          });
      });

    this.validateForm = this.fb.group({
      cliente: [null, [Validators.required]],
      producto: [null, [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });

    this.validateFormProducto = this.fb.group({
      producto: [null, [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
  }

  guardarPedido() {
    const pedido = {
      clientes: this.validateForm.value.cliente,
      usuarios: localStorage.getItem('id'),
      productos: this.pedidoProductos,
      fechaCreacion: new Date(),
      fechaAprobacion: new Date(),
      aprobadoPor: '',
      estado: 'Registrado',
    };

    this.pedidoServi
      .postPedido(pedido)
      .toPromise()
      .then(
        (data: any) => {
          console.log(data);

          this.createNotification('success', 'Pedido a sido creado con exito');
          this.isVisible = false;
          this.pedidoProductos = [];
          this.validateForm = this.fb.group({
            cliente: [null, [Validators.required]],
            producto: [null, [Validators.required]],
            cantidad: [1, [Validators.required, Validators.min(1)]],
          });
        },
        (error) => {
          console.log(error);
          this.createNotification('error', 'No se puedo crear el pedido');
        }
      );
  }

  agregarProducto(nombre, cantidad, op) {
    if (op === 1) {
      this.pedidoProductos = [...this.pedidoProductos, { nombre, cantidad }];
      this.disablePedido = false;
      this.createNotification('success', 'Producto agregado con exito');
    } else {
      const pedido = {
        clientes: this.cliente,
        usuarios: this.usuarios,
        productos: [
          ...this.pedidoProductos,
          {
            nombre: this.validateFormProducto.value.producto,
            cantidad: this.validateFormProducto.value.cantidad,
          },
        ],
        fechaCreacion: this.fechaCreacion,
        fechaAprobacion: new Date(),
        aprobadoPor: '',
        estado: 'Registrado',
      };

      this.pedidoServi
        .putPedido(pedido, this.idPedido)
        .toPromise()
        .then(
          (data: any) => {
            console.log(data);

            this.createNotification('success', 'Productos agregados');
            this.isVisibleproducto = false;
            this.pedidoProductos = [];
            this.idPedido = '';
            this.validateFormProducto = this.fb.group({
              producto: [null, [Validators.required]],
              cantidad: [1, [Validators.required, Validators.min(1)]],
            });
          },
          (error) => {
            console.log(error);
            this.createNotification(
              'error',
              'No se puedo actualizar el pedido'
            );
          }
        );
    }
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  showModalProducto(data): void {
    this.idPedido = data._id;
    this.cliente = data.clientes._id;
    this.usuarios = data.usuarios._id;
    this.fechaCreacion = data.fechaCreacion;
    this.pedidoProductos = data.productos;

    this.isVisibleproducto = true;
    this.validateFormProducto = this.fb.group({
      producto: [null, [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
  }

  handleOkProducto(): void {
    console.log('Button ok clicked!');
    this.isVisibleproducto = false;
  }

  handleCancelProducto(): void {
    console.log('Button cancel clicked!');
    this.isVisibleproducto = false;
  }
}
