import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})  
export class UserService {

  constructor(private fb:FormBuilder, private http: HttpClient ) { }
  readonly BaseUri = 'https://localhost:44327/api';

  formModel = this.fb.group({
    UserName : ['', Validators.required],
    Email : ['', Validators.email],
    FullName : [''],
    Passwords : this.fb.group({
      Password : ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword :['', Validators.required]
    },
    {validator : this.comparePasswords})
    
  });

  comparePasswords(fb:FormGroup){
    var confirmPasswrdCtrl = fb.get('ConfirmPassword');
    if(confirmPasswrdCtrl.errors == null || 'passwordMismatch' in confirmPasswrdCtrl.errors){
      if(fb.get('Password').value != confirmPasswrdCtrl.value){
        confirmPasswrdCtrl.setErrors({passwordMismatch: true});
      }
      else{
        confirmPasswrdCtrl.setErrors(null);
      }
    }
  }
  register(){
    var body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      FullName: this.formModel.value.FullName,
      Password: this.formModel.value.Passwords.Password
    };

   return this.http.post(this.BaseUri + '/ApplicationUser/Register', body);
  }
  login(formData){
    return this.http.post(this.BaseUri + '/ApplicationUser/Login', formData);
  }

  getUserProfile(){
    
    return this.http.get(this.BaseUri + '/UserProfile');
  }

  roleMatch(allowedRoles): boolean {
    var isMatch = false;
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userRole = payLoad.role;
    allowedRoles.forEach(element => {
      if (userRole == element) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }
}
