import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }

    this.serviceAuth
      .verificar(this.validateForm.value)
      .toPromise()
      .then(
        (data: any) => {
          this.createNotification('success', 'Bienvenido');
          this.router.navigate(['pedido']);
          localStorage.setItem('id', data[0]);
          localStorage.setItem('tipo', data[1])

        },
        (err) => {
          this.createNotification('error', 'Sus credenciales son invalidas');
          console.log(err);
          this.validateForm = this.fb.group({
            user: [null, Validators.required],
            pass: [null, Validators.required],
          });
        }
      );
  }

  createNotification(type: string, mensaje: string): void {
    this.notification.create(type, '', mensaje);
  }

  constructor(
    private fb: FormBuilder,
    private serviceAuth: AuthService,
    private notification: NzNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      user: [null, Validators.required],
      pass: [null, Validators.required],
    });
  }
}
