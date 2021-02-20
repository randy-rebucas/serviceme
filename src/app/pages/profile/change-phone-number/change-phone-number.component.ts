import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { from } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { SubSink } from 'subsink';
import { ProfileService } from '../profile.service';
import firebase from 'firebase/app';
@Component({
  selector: 'app-change-phone-number',
  templateUrl: './change-phone-number.component.html',
  styleUrls: ['./change-phone-number.component.scss'],
})
export class ChangePhoneNumberComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public codeForm: FormGroup;
  public windowRef: any;
  public formSubmited: boolean;
  private subs = new SubSink();
  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    public win: ProfileService
  ) {
    this.formSubmited = false;
  }

  ngOnInit() {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('re-captcha', {
        size: 'invisible'
    });

    this.form = new FormGroup({
      phoneNumber: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(8)]
      })
    });

    this.codeForm = new FormGroup({
      code: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(8)]
      })
    });
  }

  onDismiss(status: boolean) {
    this.modalController.dismiss({
      dismissed: status // true
    });
  }

  presentAlert(alertHeader: string, alertMessage: string) {
    this.subs.sink = from(this.alertController.create({
      header: alertHeader, // alert.code,
      message: alertMessage, // alert.message,
      buttons: ['OK']
    })).subscribe(alertEl => {
        alertEl.present();
    });
  }

  onUpdate() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(this.form.value.phoneNumber, appVerifier).then((res) => {
      console.log(res);
      this.windowRef.confirmationResult = res;
      this.formSubmited = true;
    });
  }

  onVerify() {
    this.windowRef.confirmationResult.confirm(this.codeForm.value.code).then(p => {
        console.log(p);
    }).catch(err => {
        console.log(err);
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
