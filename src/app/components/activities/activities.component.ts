/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * @packageDocumentation
 * @module Components
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data-exchange.service';
import { SessionService } from 'src/app/services/session.service';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { beforeUnload } from '../../../../constants';
import { Log } from '../../models/log';
import { User } from '../../models/user';
import { ClassesService } from '../../services/classes.service';
import { MilestoneUpdatesService } from '../../services/milestone-updates.service';
import { UserService } from '../../services/user.service';

/**
 * This class handles all the logic during a session on the student's side. Methods for receving questions,
 * team members and sending questions can be found here.
 */
@Component({
	selector: 'activities-component',
	templateUrl: './activities.component.html',
	styleUrls: ['./activities.component.css',
		'../../shared/general-styles.css']
})

export class ActivitiesComponent implements OnInit {
	private pin;
	private userDetails: User;
	private sessionData = new Log();
	private questions: string[] = [];
	private answers: string[] = [];
	public enableAnswer: boolean = false;
	public team;
	public leaders;
	public selected;
	public isLeader: boolean = true;
	public submitted: boolean = false;
	public article;
	public allowedSites: string[] = ['Facebook',
		'Instagram',
		'NOS.nl',
		'Telegraaf',
		'Reddit'
	];
	public gameFinished: boolean = false;
	public timedOut: boolean = false;
	public gameData;

	/**
	 * ActivitiesComponent constructor.
	 * @param socketService
	 * @param router
	 * @param data
	 * @param fb
	 * @param sessionService
	 * @param userService
	 * @param classesService
	 * @param milestoneUpdates
	 * @param snackBar
	 */
	constructor(
		private socketService: SocketIOService,
		private router: Router,
		private data: DataService,
		private fb: FormBuilder,
		private sessionService: SessionService,
		private userService: UserService,
		private classesService: ClassesService,
		private milestoneUpdates: MilestoneUpdatesService,
		private snackBar: MatSnackBar
	) { }

	/**
	 * Initialization method.
	 * @return
	 */
	public ngOnInit(): void {
		this.gameData = this.getGameData();

		if (this.gameData != undefined) {
			this.sessionData.activity = this.gameData.game._id;
		}

		this.userService.profile().subscribe(user => {
			this.userDetails = user;
			this.sessionData.user = this.userDetails;
			this.classesService.getClass().subscribe(data => {
				if (data.succes) {
					this.sessionData.class = data.class;
				}
			});
		});

		this.data.currentMessage.subscribe(message => {
			if (message) {
				this.pin = message;
				this.socketService.pin = message;
			}
		});

		window.addEventListener('beforeunload', beforeUnload);

		if (this.gameData == undefined) {
			this.router.navigate(['home']);
		}

		// Check whether or not a teacher has sent a question.
		this.receiveQuestion();

		// Get teams from teacher's input.
		this.receiveTeam();

		// Check whether the game has been ended, either by teacher stopping it or time running out.
		this.disableInput();

		// Get players in the current session.
		this.getSessionPlayers();

		// Record submitted answer.
		this.recordAnswer();

		// Delete previously recorded answer.
		this.deleteAnswer();

		// Delete previously recorded player.
		this.deletePlayer();
	}

	/**
	 * Method that returns the game data.
	 * @return
	 */
	private getGameData(): any {
		return this.socketService.gameData;
	}

	/**
	 * Method that listens for incoming questions.
	 * @return
	 */
	private receiveQuestion(): void {

		// Students listen for incoming questions.
		// Receive question.
		this.socketService.listenForQuestion((question: string) => {
			let questionDisplay = document.getElementById('receiveQuestion');
			questionDisplay.innerHTML = question;
			this.questions.push(question);

			// Student can only answer after the teacher has submitted a question.
			this.enableAnswer = true;
		});
	}

	/**
	 * Method that listens for team members.
	 * @return
	 */
	private receiveTeam(): void {
		this.socketService.listenForTeam((team, article, leaders) => {
			this.leaders = leaders;
			this.article = article;
			if (leaders.find(x => x.email === this.userDetails.email) == undefined) {
				this.isLeader = false;
			}
			this.team = team;
			let articleSpace = document.getElementsByClassName('article')[0];
			let image = document.createElement('img');
			image.setAttribute('src', article.image);
			image.setAttribute('height', '200px');
			articleSpace.appendChild(image);
		});
	}

	/**
	 * Method that submits an answer and data to the teacher when the game mode is 'Naamloos Nieuws'.
	 * @param data Article chosen by student.
	 * @return
	 */
	public submit(data: any): void {
		this.submitted = true;
		this.socketService.studentSubmit({ answer: this.selected, data: data });
	}

	/**
	 * Method that listens whether the game has ended, either by time running out or by the teacher manually
	 * stopping it.
	 * @return
	 */
	private disableInput(): void {

		// Students listen for the signal that is sent when the session has ended, either by time running out or
		// when the teacher presses the 'Stop activiteit' button.
		this.socketService.listenForFinishGame((timedOut: boolean) => {

			// Record final answers and questions in sessionData and save these in the database.
			this.sessionData.questions = this.questions;
			this.sessionData.answers = this.answers;
			this.sessionService.recordSession(this.sessionData).subscribe();

			// Finish game so correct information can be displayed to the student.
			this.gameFinished = true;
			this.timedOut = timedOut;
		});
	}

	/**
	 * Method that listens for the starting of the game so the players participating can be recorded.
	 * @return
	 */
	private getSessionPlayers(): void {

		// Listener for getting all the players in the session and recording this in the sessionData.
		this.socketService.listenForGetPlayers((sessionPlayers: any) => {

			// Get email from all sessionPlayers and save these in the sessionData so they can later be converted
			// to Users when the sessionData is saved.
			let sessionPlayerEmails = [];
			for (let player of sessionPlayers) {
				sessionPlayerEmails.push(player.email)
			}
			this.sessionData.students = sessionPlayerEmails;
		});
	}

	/**
	 * Method that listens for answers being submitted so they can be recorded.
	 * @return
	 */
	private recordAnswer(): void {

		// Listener for recording a submitted answer by a student.
		this.socketService.listenForRecordAnswer((answer: string) => {
			this.answers.push(answer);
		});
	}

	/**
	 * Method that listens for answers being removed by the teacher so they can be deleted from the student's
	 * already recorded answers.
	 * @return
	 */
	private deleteAnswer(): void {

		// Listener for removing an answer from a student that was already recorded.
		this.socketService.listenForRemoveAnswer(() => {
			this.answers.pop();
		});
	}

	/**
	 * Method that listens for a player leaving the session so he can be removed from the already recorded players in
	 * the session.
	 * @return
	 */
	private deletePlayer(): void {

		// Listener for a player leaving the session so he can be removed from the recorded students in the session.
		this.socketService.listenForLeavePlayer((student: { email: string; }) => {
			this.sessionData.students = this.sessionData.students.filter(e => e !== student.email);
		});
	}
}

