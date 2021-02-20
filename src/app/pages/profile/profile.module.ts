import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormComponent } from './form/form.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { Camera } from '@ionic-native/camera/ngx';
import { ChangePhoneNumberComponent } from './change-phone-number/change-phone-number.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedModule
  ],
  declarations: [
    ProfilePage,
    FormComponent,
    ChangePasswordComponent,
    ChangePhoneNumberComponent
  ],
  entryComponents: [
    FormComponent,
    ChangePasswordComponent,
    ChangePhoneNumberComponent
  ],
  providers: [
    Camera
  ]
})
export class ProfilePageModule {}
