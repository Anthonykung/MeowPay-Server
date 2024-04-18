/**
* Copyright (c) 2024 Anthony Kung (anth.dev)
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     https://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* @file   security.ts
* @author Anthony Kung <hi@anth.dev> (anth.dev)
* @date   Created on 04/16/2024 19:35:26
*/

import { scrypt, randomBytes } from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex'); // Generate a random salt
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, {
      // N: 131072,  // N = 2 ^ 17
      // r: 8,
      // p: 1,
      // maxmem: 134220800,  // 128 * 1 * 8 + 128 * (2+131072) * 8
    }, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, key] = hashedPassword.split(':');
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, {
      // N: 131072,  // N = 2 ^ 17
      // r: 8,
      // p: 1,
      // maxmem: 134220800,  // 128 * 1 * 8 + 128 * (2+131072) * 8
    }, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

export async function generateToken(length?: number): Promise<string> {
  length = length || 32;
  return randomBytes(length).toString('hex');
}