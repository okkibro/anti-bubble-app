import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ClassesService } from '../../services/classes.service'

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
  constructor(private fb: FormBuilder, private classesService: ClassesService) { }

  ngOnInit(): void {
  }

  joinClass(): void {
    this.classesService.joinClass(this.value).subscribe(data => {
      console.log(data);
    });
  }

}
