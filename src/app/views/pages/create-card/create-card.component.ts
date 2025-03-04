import { AfterViewInit, Component, type OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as JSZip from 'jszip';
import html2canvas from 'html2canvas';
import { AppWorker } from 'src/app/core/workers/app.worker';
declare var html2pdf: any;

@Component({
  selector: 'app-create-card',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.scss',
})
export class CreateCardComponent implements OnInit, AfterViewInit {

  companyForm?: FormGroup;
  currentStep: number = 1;
  qrcode: string = "";

  constructor(private fb: FormBuilder, public appWorker: AppWorker) {
    this.convertImageToBase64("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://digitalcard.co.in/67ab2d012601d5c398866bf2").then((v) => {
      this.qrcode = v;
    }).catch((e) => console.log(e));
  }
  
  ngAfterViewInit(): void {
    let element = document.getElementById('sidebar');
    if(element!=null){
      element.classList.add('collapsed')
    }
  }

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      mobile: ['', Validators.required],
      company: ['', Validators.required],
      role: ['', Validators.required],
      companyAddress: ['', Validators.required]
    });
  }

  // Check if the current step is valid
  isStepValid(step: number): boolean {
    if(this.companyForm!=null){
      switch (step) {
        case 1:{
          let returnValue = this.companyForm.get('name')?.valid &&
          this.companyForm.get('email')?.valid &&
          this.companyForm.get('password')?.valid &&
          this.companyForm.get('mobile')?.valid;
          return returnValue == undefined ? false: returnValue;
        }
        case 2:{
          let returnValue = this.companyForm.get('company')?.valid &&
          this.companyForm.get('role')?.valid &&
          this.companyForm.get('companyAddress')?.valid;
          return returnValue == undefined ? false: returnValue;
        }
        default:
          return true;
      }
    }else{
      return false;
    }
  }

  // Navigate to the next step
  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  // Navigate to the previous step
  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Set the current step
  setStep(step: number): void {
    if (this.isStepValid(step - 1)) {
      this.currentStep = step;
    }
  }

  moduleTypes: any[] = [
    {
      type: "nfc-card",
      title: "NFC Card",
      value: false
    },
    {
      type: "digital-card",
      title: "Digital Card",
      value: false
    },
    {
      type: "website",
      title: "Website",
      value: false
    }
  ]

  WebModules = [
    { name: 'About Us Section', selected: false },
    { name: 'Team Section', selected: false },
    { name: 'Our Clients Section', selected: false },
    { name: 'Product & Services With Inquiries Section', selected: false },
    { name: 'Number Of Views in Card', selected: false },
    { name: 'Gallery (Image, Video)', selected: false },
    { name: 'Blogs', selected: false },
    { name: 'Upcoming Event', selected: false }
  ];

  // Handle form submission
  onSubmit(): void {
    if (this.companyForm!.valid) {
      const formData = new FormData();
      Object.keys(this.companyForm!.controls).forEach(key => {
        if (key !== 'profileImage' && key !== 'coverImage' && key !== 'logoImage') {
          formData.append(key, this.companyForm?.get(key)!.value);
        }
      });
      console.log('Form Data:', formData);
    } else {
      console.log('Form is invalid');
    }
  }

  async captureElementAsPng(elementId: string, fileName: string): Promise<Blob> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found`);
    }
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: true });
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error('Failed to convert canvas to Blob');
        }
      }, 'image/png');
    });
  }

  convertImageToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL('image/png');
          resolve(base64);
        } else {
          reject('Could not get canvas context');
        }
      };
      img.onerror = (error) => {
        reject(error);
      };
    });
  }



  async downloadZip() {
    const zip = new JSZip();

    try {
      let linkName: string = this.formatString(this.companyForm?.get('name')?.value);
      const frontPngBlob = await this.captureElementAsPng('nfcCardFront', 'NFC_Card_Front.png');
      zip.file('NFC_Card_Front.png', frontPngBlob);

      const backPngBlob = await this.captureElementAsPng('nfcCardBack', 'NFC_Card_Back.png');
      zip.file('NFC_Card_Back.png', backPngBlob);

      let result = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(result);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${linkName}_nfc_card.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error capturing elements or creating ZIP:', error);
    }
  }

  private formatString(input: string): string {
    let formattedString = input.toLowerCase();
    formattedString = formattedString.replace(/[^a-z0-9]/g, '_');
    formattedString = formattedString.replace(/_+/g, '_');
    formattedString = formattedString.replace(/^_+|_+$/g, '');
    return formattedString;
  }

}
