/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * answer-form.component.ts
 * This file is a sub-component used by the activities component to handle receving of form and input data
 * through the SocketIoService, linked through the studentSubmit() and the teacherSubmit() method.
 * @packageDocumentation
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { tokenData } from '../../models/tokenData';

@Component({
	selector: 'mean-answer-form',
	templateUrl: './answer-form.component.html',
	styleUrls: ['./answer-form.component.css',
		'../../shared/general-styles.css']
})

export class AnswerFormComponent implements OnInit {
	getAnswerForm = this.fb.group({
		getAnswer: ['', []]
	});
	sendQuestionsForm = this.fb.group({
		getQuestion: ['', []]
	});
	tokenData: tokenData;
	answerSubmitted: boolean = false;
	questionSubmitted: boolean = false;
	question: string;

	/**
	 * AnswerFormComponent constructor.
	 * @param fb
	 * @param snackBar
	 * @param socketService
	 * @param auth
	 */
	constructor(
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		private socketService: SocketIOService,
		private auth: AuthenticationService
	) { }


	/**
	 * Initialization method.
	 * @returns
	 */
		/**
	 * Initialization method.
	 * @returns
	 */
	ngOnInit(): void {
		this.tokenData = this.auth.getTokenData();

		// Reactivate the option to answer after the teacher has deleted the answer.
		this.socketService.reactivateButton(() => {
			this.answerSubmitted = false;
		});
	}

	/**
	 * This method lets students submit an answer to the teacher that will be displayed on the digiboard.
	 * @returns
	 */
	sendAnswer(): void {
		if (this.getAnswerForm.get('getAnswer').value != '') {
			this.socketService.studentSubmit(this.getAnswerForm.get('getAnswer').value);
			this.getAnswerForm.get('getAnswer').setValue('');

			// Prevents students from spamming the teacher with answers.
			this.answerSubmitted = true;
		} else {
			this.snackBar.open('Vul een antwoord in.', 'X', { duration: 2500, panelClass: ['style-warning'] });
		}
	}

	/**
	 * This method lets a teacher submit a question to all of the students in the session.
	 * @returns
	 */
	sendQuestion(): void {
		let getQuestion = this.sendQuestionsForm.get('getQuestion').value;
		if (getQuestion != '') {
			this.question = getQuestion;
			this.socketService.teacherSubmit(getQuestion);
			this.sendQuestionsForm.get('getQuestion').setValue('');
			this.questionSubmitted = true;
		} else {
			this.snackBar.open('Vul een onderwerp in.', 'X', { duration: 2500, panelClass: ['style-warning'] });
		}
	}
}
