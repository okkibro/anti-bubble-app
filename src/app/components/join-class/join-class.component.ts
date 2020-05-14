import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'mean-join-class',
  templateUrl: './join-class.component.html',
  styleUrls: ['./join-class.component.css']
})
export class JoinClassComponent implements OnInit {
  classCodeField = this.fb.group({
    classCode: ['', []]
  });
  value;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

}
