import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { PedidosRegistradosComponent } from './pages/pedidosRegistrados/pedidosRegistrados.component';
import { ConsultaPedidoComponent } from './pages/consultaPedido/consultaPedido.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: WelcomeComponent,
    children: [
      { path: 'pedido', component: PedidoComponent },
      { path: 'pedidoRegistrado', component: PedidosRegistradosComponent },
      { path: 'consultaPedido', component: ConsultaPedidoComponent }

    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
