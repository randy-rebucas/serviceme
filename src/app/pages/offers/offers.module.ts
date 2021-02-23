import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { OffersPageRoutingModule } from './offers-routing.module';

import { OffersPage } from './offers.page';
import { FormComponent } from './form/form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OffersPageRoutingModule,
    SharedModule
  ],
  declarations: [
    OffersPage,
    FormComponent
  ],
  entryComponents: [
    FormComponent
  ],
  providers: [
    Camera
  ]
})
export class OffersPageModule {}
