import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  public apiBaseUrl = "https://127.0.0.1:8000";

  public kraken: any;
  public krakenForm: FormGroup;
  public tentacleForm: FormGroup;
  public powerForm: FormGroup;
  public submitted: boolean;
  public canAddPower: boolean;
  public isLoading: boolean = true;
  public error: any;

  // Tentacle names list
  public tentacles = [
    { name: "6D6" },
    { name: "2D3" },
    { name: "PV" },
    { name: "FOR" },
    { name: "DEX" },
    { name: "CON" },
  ]

  // Power names list
  public powers = [
    { name: "Blast" },
    { name: "Plague" },
    { name: "Mind control" },
    { name: "Ink fog" },
    { name: "Force shield" },
    { name: "Regeneration" },
  ];
  
  constructor(private http: HttpClient, private modalService: NgbModal, private formBuilder: FormBuilder) {
   
    // Kraken form
    this.krakenForm = this.formBuilder.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      size: ['', Validators.required],
      weight: ['', Validators.required]
    });

    // Tentacle form
    this.tentacleForm = this.formBuilder.group({
      name: ['', Validators.required]
    });

    // Power form
    this.powerForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.http
    .get(this.apiBaseUrl)
    .subscribe(
      (data: any) => {
        this.kraken = data;
        this.canAddPower = this.powerDelete();
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
      }
    );
  }

  createKraken(){
    this.submitted = true;
    this.http
    .post(this.apiBaseUrl+"/kraken/new", this.krakenForm.value)
    .subscribe(
      (data: any) => {
        this.kraken = data;
        this.modalService.dismissAll();
        this.submitted = false;
        this.canAddPower = this.powerDelete();
      },
      (error: any) => {
        this.submitted = false;
        if (error.error.message) {
          this.error = error.error.message;
        }
      }
    );
  }

  tentacleAdd(){
    
    this.submitted = true;

    const data = {
      name: this.tentacleForm.value.name,
      action: "add"
    };    

    this.http
    .post(this.apiBaseUrl+"/tentacle", data)
    .subscribe(
      (data: any) => {
        this.kraken = data;
        this.modalService.dismissAll();
        this.submitted = false;
        this.canAddPower = this.powerDelete();
      },
      (error: any) => {
        this.submitted = false;
        if (error.error.message) {
          this.error = error.error.message;
        }
      }
    );
  }

  tentacleDelete()
  {
    this.submitted = true;
    const data = {
      id: this.tentacleForm.value.name,
      action: "remove"
    }; 

    this.http
    .post(this.apiBaseUrl+"/tentacle", data)
    .subscribe(
      (data: any) => {
        this.kraken = data;    
        this.modalService.dismissAll();  
        this.submitted = false; 
        this.canAddPower = this.powerDelete();
      },
      (error: any) => {
        this.submitted = false;
        if (error.error.message) {
          this.error = error.error.message;
        }
      }
    );
  }

  powerAdd(){
    this.submitted = true;
    this.http
    .post(this.apiBaseUrl+"/kraken/power/add", this.powerForm.value)
    .subscribe(
      (data: any) => {
        this.kraken = data;
        this.modalService.dismissAll();
        this.submitted = false;
        this.canAddPower = this.powerDelete();
      },
      (error: any) => {
        this.submitted = false;
        if (error.error.message) {
          this.error = error.error.message;
        }
      }
    );
  }

  powerDelete(){
    if (!this.kraken) {
      return false;
    }
    if(!((((this.kraken.tentacles.length/4) + 1)) - this.kraken.powers.length >= 1)) {
      return false;
    }

    return true;
  }

  // Open modal
  open(content) {
    this.modalService.open(content);
  }

}

