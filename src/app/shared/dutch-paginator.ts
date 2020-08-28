/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 *  within the Software Project course. © Copyright Utrecht University (Department of Information and
 *  Computing Sciences)
 */

/**
 * This file contains the method used in the MatPaginatorIntl provider in app.module.ts for making the
 * tooltips of the paginator on the session-overview page Dutch instead of English.
 * @packageDocumentation
 */

import { MatPaginatorIntl } from '@angular/material/paginator';

export function getDutchPaginatorIntl() {
	const paginatorIntl = new MatPaginatorIntl();
	paginatorIntl.itemsPerPageLabel = 'Items per pagina:';
	paginatorIntl.nextPageLabel = 'Volgende pagina';
	paginatorIntl.previousPageLabel = 'Vorige pagina';
	return paginatorIntl;
}