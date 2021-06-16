import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  @Output() eventFromChild = new EventEmitter();

  constructor() { 
  }

  ngOnInit(): void {
  }

  onLogin() {
    this.eventFromChild.emit({isLanding: false, isReg: false});
  }

  onRegister(){
    this.eventFromChild.emit({isLanding: false, isReg: true});
  }
}
