import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PasswordHasher } from '../../domain/ports/password-hasher';

/**
 * Unica pieza del proyecto que conoce el paquete `argon2`. El string PHC que
 * devuelve `argon2.hash` ya incluye salt y parametros de coste, asi que se
 * guarda tal cual en users.password_hash (sin columna de salt aparte).
 */
@Injectable()
export class Argon2PasswordHasher implements PasswordHasher {
  hash(plainPassword: string): Promise<string> {
    return argon2.hash(plainPassword, { type: argon2.argon2id });
  }
}
