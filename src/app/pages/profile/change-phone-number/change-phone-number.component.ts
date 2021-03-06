import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { from } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { SubSink } from 'subsink';
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
    private authService: AuthService
  ) {
    this.formSubmited = false;
  }

  ngOnInit() {
    this.form = new FormGroup({
      phoneNumber: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(13)]
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

  onVerify(verificationId: any, verificationCode: any) {
    const phoneCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
    from(firebase.auth().currentUser.updatePhoneNumber(phoneCredential)).subscribe(() => {
      this.loadingController.dismiss();
      this.onDismiss(true);
    }, (error: any) => {
      this.loadingController.dismiss();
      this.presentAlert(error.code, error.message);
    });
  }

  doUpdate() {
    const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {size: 'invisible'});
    const provider = new firebase.auth.PhoneAuthProvider();
    this.subs.sink = from(provider.verifyPhoneNumber(this.form.value.phoneNumber, appVerifier)).subscribe((verificationId) => {
        const verificationCode = window.prompt('Please enter the verification ' +
            'code that was sent to your mobile device.');
        this.onVerify(verificationId, verificationCode);
    }, (error: any) => {
      this.loadingController.dismiss();
      this.presentAlert(error.code, error.message);
    });
  }

  onUpdate() {
    this.subs.sink = from(this.loadingController.create({
      message: 'Please wait...'
    })).subscribe(loadingEl => {
      loadingEl.present();
      this.doUpdate();
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
