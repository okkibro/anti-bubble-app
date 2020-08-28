/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
	imports: [
		CommonModule,
		MatToolbarModule,
		MatButtonModule,
		MatCardModule,
		MatInputModule,
		MatDialogModule,
		MatTableModule,
		MatMenuModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatExpansionModule,
		MatSnackBarModule,
		MatRadioModule,
		MatGridListModule,
		MatButtonToggleModule
	],
	exports: [
		CommonModule,
		MatToolbarModule,
		MatButtonModule,
		MatCardModule,
		MatInputModule,
		MatDialogModule,
		MatTableModule,
		MatMenuModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatExpansionModule,
		MatSnackBarModule,
		MatRadioModule,
		MatGridListModule,
		MatButtonToggleModule
	]
})
export class CustomMaterialModule {
}