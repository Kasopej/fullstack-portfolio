import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isIanaTimezone', async: false })
export class IsIanaTimezoneConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (typeof value !== 'string') {
      return false;
    }

    try {
      Intl.DateTimeFormat(undefined, {
        timeZone: value,
      });

      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(_args: ValidationArguments) {
    return 'timezone must be a valid IANA timezone';
  }
}
