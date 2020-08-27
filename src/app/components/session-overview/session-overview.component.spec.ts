/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 *  within the Software Project course. © Copyright Utrecht University (Department of Information and
 *  Computing Sciences)
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionOverviewComponent } from './session-overview.component';

describe('SessionOverviewComponent', () => {
	let component: SessionOverviewComponent;
	let fixture: ComponentFixture<SessionOverviewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SessionOverviewComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SessionOverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
