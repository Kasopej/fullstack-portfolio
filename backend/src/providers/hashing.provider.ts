import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

const saltRounds = 20;
@Injectable()
export class HashingProvider {
  public async hashValue(value: string | Buffer) {
    const salt = await genSalt(saltRounds);
    return hash(value, salt);
  }

  public async compare(value: string | Buffer, hashedValue: string) {
    return compare(value, hashedValue);
  }
}
