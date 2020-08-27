/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * labyrinth.component.ts
 * This file handles all the logic during a session on the student's side. Methods for receving questions,
 * team members and sending questions can be found here.
 * @packageDocumentation
 */

import { Component, OnInit } from '@angular/core';
import { titleTrail } from '../../../../constants';
import { User } from '../../models/user';
import { Question } from '../../models/question';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BubbleGraphService } from 'src/app/services/bubble-graph.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'mean-labyrinth',
	templateUrl: './labyrinth.component.html',
	styleUrls: ['./labyrinth.component.css',
		'../../shared/general-styles.css']
})

export class LabyrinthComponent implements OnInit {
	userDetails: User;
	startedLabyrinth: boolean;
	nextQuestionDisabled: boolean;
	questions = [];
	questionOptions = [];
	part: number;
	answers: [{ question: Question, answer: number }] = [,];
	currentQuestion;
	questionLoaded: boolean = false;
	lastQuestionWasImage: boolean = false;
	labyrinthQuestionForm = this.fb.group({
		answer: ['', Validators.required]
	});

	/**
	 * LabyrinthComponent constructor.
	 * @param router
	 * @param sessionService
	 * @param auth
	 * @param snackBar
	 * @param bubbleService
	 * @param fb
	 * @param titleService
	 * @param userService
	 */
	constructor(
		private router: Router,
		private sessionService: SessionService,
		private auth: AuthenticationService,
		private snackBar: MatSnackBar,
		private bubbleService: BubbleGraphService,
		private fb: FormBuilder,
		private titleService: Title,
		private userService: UserService
	) { }


	/**
	 * Initialization method.
	 * @return
	 */
	ngOnInit(): void {
		this.userService.profile().subscribe(user => {
			this.userDetails = user;
		});

		// Start the labyrinth in part 1.
		this.part = 1;

		// Set page title.
		this.titleService.setTitle('Doolhof' + titleTrail);
	}

	/**
	 * Method that saves answers the user gave and sets their bubble initialization to true so they can join a session after this.
	 * @return
	 */
	performedLabyrinth(): void {
		this.sessionService.performedLabyrinth().subscribe(data => {

			// Labyrinth boolean is set to true. Player now has a bubble and can join activity sessions.
			if (data.succes) {
				this.snackBar.open('Je bent bij het eind aangekomen. Je antwoorden zijn opgeslagen.', 'X', {
					duration: 2500,
					panelClass: ['style-succes']
				}).afterDismissed().subscribe(() => {

					// Saves the answers in the database.
					this.sessionService.saveAnswers(this.answers).subscribe(() => {
						this.bubbleService.processLabyrinth(this.answers).subscribe(() => {
							this.router.navigate(['home']);
						});
					});
				});
			}
		});
	}

	/**
	 * Method that starts the labyrinth.
	 * @return
	 */
	startLabyrinth(): void {

		// Shows the question screen due to ngIfs in the HTML.
		this.startedLabyrinth = true;

		// Get the part 1 questions from the database.
		this.sessionService.getQuestions(1).subscribe(questions => {
			this.questions = this.shuffle(questions);

			// Show the first question, previous question does not exist so its null.
			this.nextQuestion(null);
		});
	}

	/**
	 * Method to pause the labyrinth.
	 * @return
	 */
	pauseLabyrinth(): void {
		this.sessionService.saveAnswers(this.answers).subscribe(() => {
			this.bubbleService.processLabyrinth(this.answers).subscribe(() => {
				this.snackBar.open('Doolhof gepauzeerd. Zorg dat je het voor de volgende les hebt afgemaakt.', 'X', {
					duration: 2500,
					panelClass: ['style-warning']
				}).afterDismissed().subscribe(() => {
					this.router.navigate(['home']);
				});
			});
		});
	}

	/**
	 * Method that shows the next question on the screen.
	 * @param prevQuestion Question used to determine what question is next in the labyrinth.
	 * @return
	 */
	nextQuestion(prevQuestion: Question): void {
		this.nextQuestionDisabled = true;
		this.questionLoaded = false;
		if (this.questions.length === 0) {

			if (this.part !== 4) {

				// If at the end of part 1, 2 or 3; get the next part of questions.
				this.part = this.part + 1;
				this.sessionService.getQuestions(this.part).subscribe(questions => {

					// Only shuffle the questions when getting the questions for part 2, since the order of
					// questions matters for part 3 and 4.
					if (this.part === 3 || this.part === 4) {
						this.questions = questions;
					} else {
						this.questions = this.shuffle(questions);
					}
					this.nextQuestion(prevQuestion);
				});
			} else {

				// If at the end of part 4, finish labyrinth.
				this.saveQuestion(prevQuestion);
				this.performedLabyrinth();
			}
		} else {

			// Get next question from array.
			let question = this.questions.shift();
			this.currentQuestion = question;

			if (prevQuestion != null) {

				// If its not the first question, save previous question.
				this.saveQuestion(prevQuestion);
			}

			if (this.userDetails.labyrinthAnswers[question.id] != undefined && this.userDetails.labyrinthAnswers[question.id] != null) {
				this.nextQuestion(null);
			} else {

				// Show the qustion on the screen.
				this.showQuestion(question);
			}
		}
	}

	/** Method that saves a question to the global this.answers array.
	 * @param question Question that has just been answerd by the user.
	 * @return
	 */
	saveQuestion(question: Question): void {
		if (question) {

			// Push the result with its corresponding question to this.answers.
			this.answers.push({ question: question, answer: this.labyrinthQuestionForm.get('answer').value });

			// Deselecting radio button when going to the next question.
			this.labyrinthQuestionForm.get('answer').setValue('');
		}
	}

	/** Method that shows a question on the screen.
	 * @param question Quesiton that has to be shown to the user.
	 * @return
	 */
	showQuestion(question: Question): void {

		// Set question title.
		document.getElementById('question').innerHTML = question.question;
		this.questionOptions = question.choices;
		this.questionLoaded = true;
		let textArea = document.getElementsByClassName('answer-options');

		// For each question...
		for (let i = 0; i < question.choices.length; i++) {

			// Determine whether the question to be shown is an image question by looking at the path
			// and adjusting the styling as necessary.
			if (question.choices[i].startsWith('/assets/')) {
				setTimeout(() => {
					let radioGroup = document.getElementById('radio-button-options');
					let image = document.createElement('img');
					radioGroup.style.display = 'flex';
					radioGroup.style.alignItems = 'center';
					radioGroup.style.justifyContent = 'center';
					if (screen.width < 600) {
						image.style.maxWidth = '300px';
						image.style.maxHeight = '300px';
						image.style.paddingRight = '10px';
					} else {
						image.style.maxWidth = '500px';
						image.style.maxHeight = '500px';
						image.style.paddingRight = '15px';
					}
					image.style.width = 'auto';
					image.style.height = 'auto';
					image.addEventListener('click', this.selectedOption);
					image.id = 'image' + i;
					image.setAttribute('src', question.choices[i]);
					textArea[i].appendChild(image);
					this.lastQuestionWasImage = true;
				}, 10);
			} else {
				setTimeout(() => {

					// Below lines make sure that radio button questions are shown stacked, but image questions are shown
					// side by side.
					if (this.lastQuestionWasImage) {
						let radioGroup = document.getElementById('radio-button-options');
						radioGroup.style.display = 'inline-block';
						radioGroup.style.alignItems = 'unset';
						radioGroup.style.justifyContent = 'unset';
					}
					textArea[i].textContent = '';
					textArea[i].appendChild(document.createTextNode(question.choices[i]));
				}, 10);
			}
		}
	}

	/**
	 * Method that enables the button to go to the next question when an answer has been selected.
	 * @return
	 */
	selectedOption(): void {
		this.nextQuestionDisabled = false;
	}

	/**
	 * Method used for shuffling the array of questions so not all students answer the questions in the
	 * same order. Based on the Fisher-Yates shuffle algorithm.
	 * @param array Array of questions to shuffle.
	 * @return Array of shuffles questions.
	 */
	shuffle(array: any): any {
		let currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}
}