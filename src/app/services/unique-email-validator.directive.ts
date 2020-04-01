import { Directive } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

export function uniqueEmailValidator(authenticationService: AuthenticationService): AsyncValidatorFn {
    return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        return authenticationService.checkEmailTaken(c.value).pipe(
            map(users => {
                return users.hasOwnProperty('emailTaken') ? { 'emailTaken': true } : null;
            })
        );
    };
}

@Directive({
    selector: '[emailTaken]',
    providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: UniqueEmailValidatorDirective, multi: true }]
})

export class UniqueEmailValidatorDirective implements AsyncValidator {
    constructor(private authenticationService: AuthenticationService) { }

    validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return uniqueEmailValidator(this.authenticationService)(c);
    }
}