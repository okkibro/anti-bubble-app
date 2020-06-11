import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketIOService } from 'src/app/services/socket-io.service';

@Component({
  selector: 'mean-answer-form',
  templateUrl: './answer-form.component.html',
  styleUrls: ['./answer-form.component.css',
    '../../shared/general-styles.css']
})
export class AnswerFormComponent implements OnInit {

  value = "";
  getAnswerForm = this.fb.group({
    getAnswer: ['', []]
  });

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private socketService: SocketIOService) { }

  ngOnInit(): void { }


  sendAnswer(): void {
    if (this.value != "") {
      this.socketService.studentSubmit(this.value);
      this.value = "";
    } else {
      this.snackBar.open('Vul een antwoord in', 'X', { duration: 2500, panelClass: ['style-error'], });
    }
  }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
