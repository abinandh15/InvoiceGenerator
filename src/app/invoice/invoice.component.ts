import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormArray, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  
  invoiceHeaderForm : FormGroup;
  invoiceDate: number = Date.now();
  subtotal:number = 0;
  fileData: File = null;
  previewUrl:any = null;
  uploadedFilePath: string = null;


  constructor(private fb: FormBuilder, private datePipe:DatePipe) { }

  ngOnInit() {       
    this.invoiceHeaderForm = this.fb.group({
      invoiceNumber: ['#12345'],
      invoiceDate: [this.datePipe.transform(this.invoiceDate,"yyyy-MM-dd")],
      balanceDue: [0],
      subTotal: [''],
      discounts:[0],
      total:[''],
      freelancerDetails: [''],
      clientDetails: [''],
      invoiceList: this.fb.array([])
    });
    this.addList();
    this.invoiceListForms.valueChanges.subscribe(change=>{
      this.subTotalCalculation();
    })
    this.invoiceHeaderForm.get('discounts').valueChanges.subscribe(change=>{
      this.totalCalculation();
    });
  }
  get invoiceListForms() {
    return this.invoiceHeaderForm.get('invoiceList') as FormArray
  }
  
  addList(){
    const listitem = this.fb.group({
      item:[''],
      quantity:['1'],
      rate:[''],
      amount:['']
    })
    this.invoiceListForms.push(listitem);
     console.log(listitem)
  }  
  get subTotal(){
    return this.invoiceHeaderForm.controls.subTotal as FormControl
  }
  get total(){
    return this.invoiceHeaderForm.controls.total as FormControl
  }
  get discounts(){
    return this.invoiceHeaderForm.controls.discounts as FormControl
  }
  get balanceDue(){
    return this.invoiceHeaderForm.controls.balanceDue as FormControl
  }

  public subTotalCalculation(){
    this.subtotal = 0;
    this.invoiceListForms.controls.forEach(listItem => {
       this.subtotal = this.subtotal + Number(listItem.value.amount);
     }); 
     this.subTotal.patchValue(this.subtotal); 
     this.totalCalculation();
  }

  public totalCalculation(){
    this.total.patchValue(this.subTotal.value-(this.subTotal.value*this.discounts.value/100));
    this.balanceDueCalculation();
    console.log(this.discounts.value);
  }

  public balanceDueCalculation(){
    this.balanceDue.patchValue(this.total.value);
  }
 deleteListItem(i){
   this.invoiceListForms.removeAt(i);
  }

  public getFileURL(event){
    this.fileData = <File>event.target.files[0];
    console.log(event);
    this.preview();
  }

  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
    }
}

}
