import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/Model/user';
import { AuthService } from 'src/app/Service/auth.service';

function unique(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const txt = control.value;
    // return { 'unique': true } // nếu hợp lệ
    return null; // Nếu có lỗi
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  user: User = new User(0, '', '', '', '', [], '', '', 0, '', false);
  isRegistered: boolean = false;
  submitted: boolean = false;
  errorMessage: any = '';
  roles: any = [
    { name: 'admin', id: 1, selected: false },
    { name: 'user', id: 2, selected: true },
  ];
  selectedRoles!: string[];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.initUserForm();
  }

  initUserForm() {
    this.registrationForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      roleSelection: this.createRoles(this.roles),
    });
  }

  checkUser(evt: any) {
    this.authService.uniqueUsername(evt.target.value).subscribe((res) => {
      console.log(res);
      if (res == null) {
        // Nếu trùng
        this.registrationForm.get('username')?.setErrors(null);
      } else {
        this.registrationForm.get('username')?.setErrors({ unique: true });
      }
    });
  }

  checkEmail(evt: any) {
    this.authService.uniqueUserEmail(evt.target.value).subscribe((res) => {
      console.log(res);
      if (res == null) {
        // Nếu trùng
        this.registrationForm.get('email')?.setErrors(null);
      } else {
        this.registrationForm.get('email')?.setErrors({ unique: true });
      }
    });
  }

  createRoles(roleList: any): FormArray {
    const arr = roleList.map((role: { selected: any }) => {
      return new FormControl(role.selected);
    });
    return new FormArray(arr);
  }

  onSubmit() {
    this.submitted = true;
    this.user.username = this.registrationForm.value.username;
    this.user.email = this.registrationForm.value.email;
    this.user.password = this.registrationForm.value.password;
    this.user.roles = this.getSelectedRoles();
    this.registerUser();
  }

  registerUser() {
    this.authService.signup(this.user).subscribe(
      (user) => {
        console.log(user);
        this.isRegistered = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      (error) => {
        console.log(error);
        this.errorMessage = error;
        this.isRegistered = false;
      }
    );
  }

  getSelectedRoles(): string[] {
    this.selectedRoles = this.registrationForm.value.roleSelection.map(
      (selected: any, i: any) => {
        if (selected) {
          return this.roles[i].name;
        } else {
          return '';
        }
      }
    );
    // return selected roles
    return this.selectedRoles.filter(function (element) {
      if (element !== '') {
        return element;
      }
      return '';
    });
  }
}
