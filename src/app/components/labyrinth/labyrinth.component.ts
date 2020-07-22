/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BubbleGraphService } from 'src/app/services/bubble-graph.service';
import { FormBuilder, Validators } from '@angular/forms';

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
    part: Number;
    answers: [{ question: any, answer: any }] = [,];
    currentQuestion;
    questionLoaded: boolean = false;
    lastQuestionWasImage: boolean = false;
    labyrinthQuestionForm = this.fb.group({
        answer: ['', Validators.required]
    });

    constructor(
        private router: Router,
        private sessionService: SessionService,
        private auth: AuthenticationService,
        private snackBar: MatSnackBar,
        private bubbleService: BubbleGraphService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.auth.profile().subscribe(user => {
            this.userDetails = user;
        });

        // Start the labyrinth in part 1.
        this.part = 1;
    }


    /** Method that saves answers the user gave and sets their bubble initialization to true so they can join a session after this. */
    performedLabyrinth() {
        this.sessionService.performedLabyrinth().subscribe(data => {

            // Labyrinth boolean is set to true. Player now has a bubble and can join activity sessions.
            if (data.succes) {
                this.snackBar.open('Je bent bij het eind aangekomen. Je antwoorden zijn opgeslagen.', 'X', { duration: 2500, panelClass: ['style-succes'] }).afterDismissed().subscribe(() => {

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

    /** Method that starts the labyrinth. */
    startLabyrinth() {

        // Shows the question screen due to ngIfs in the HTML.
        this.startedLabyrinth = true;

        // Get the part 1 questions from the database.
        this.sessionService.getShuffledQuestions(1).subscribe(questions => {
            this.questions = questions;

            // Show the first question, previous question does not exist so its null.
            this.nextQuestion(null);
        })
    }

    /** Method to pause the labyrinth */
    paused() {
        this.sessionService.saveAnswers(this.answers).subscribe(() => {
            this.snackBar.open('Doolhof gepauzeerd. Zorg dat je het voor de volgende les hebt afgemaakt.', 'X', { duration: 2500, panelClass: ['style-warning'], }).afterDismissed().subscribe(() => {
                this.bubbleService.processLabyrinth(this.answers).subscribe(() => {
                    this.router.navigate(['home']);
                });
            });
        });
    }

    /** Method that shows the next question on the screen. */
    nextQuestion(prevQuestion) {
        this.nextQuestionDisabled = true;
        this.questionLoaded = false;
        if (this.questions.length === 0) {
            if (this.part === 1) {

                // If at the end of part 1, go to part 2.
                this.part = 2;
                this.sessionService.getShuffledQuestions(2).subscribe(questions => {
                    this.questions = questions;
                    this.nextQuestion(prevQuestion);
                });
            } else {

                // If at the end of part 2, finish labyrinth.
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

    /** Method that saves a question to this.answers. */
    saveQuestion(question) {
        if (question) {

            // Push the result with its corresponding question to this.answers.
            this.answers.push({ question: question, answer: this.labyrinthQuestionForm.get('answer').value });

            // Deselecting radio button when going to the next question.
            this.labyrinthQuestionForm.get('answer').setValue('');
        }
    }

    /** Method that shows a question on the screen. */
    showQuestion(question) {

        // Set question title.
        document.getElementById('question').innerHTML = question.question;
        this.questionOptions = question.choices;
        this.questionLoaded = true;
        let textArea = document.getElementsByClassName('answer-options');

        // For each question...
        for (let i = 0; i < question.choices.length; i++) {

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

    selectedOption() {
        this.nextQuestionDisabled = false;
    }
}