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
* @file   route.ts
* @author Anthony Kung <hi@anth.dev> (anth.dev)
* @date   Created on 04/17/2024 13:10:11
*/

import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const res: {
    email: string;
  } = await request.json();

  // Check if email is valid
  if (!res.email || !res.email.includes('@') || !res.email.includes('.')) {
    return new Response('Email is required', { status: 400 });
  }

  // Check if email is already registered
  const user = await prisma.user.findUnique({
    where: {
      email: res.email,
    },
  });

  if (user) {
    return new Response('Email already registered', { status: 400 });
  }

  // TODO: Verify email

  // Create user
  await prisma.user.create({
    data: {
      email: res.email,
      balance: 0,
    },
  });

  return new Response('User created', { status: 201 });
}