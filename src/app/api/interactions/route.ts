'use server';

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
* @date   Created on 04/17/2024 00:41:43
*/

import { headers } from 'next/headers';
import { corsResponse } from '@/lib/api';
import { discordValidateSignature } from '@/actions/discord';
import { generateToken } from '@/lib/security';
import prisma from '@/lib/prisma';

// Interface
interface InteractionRequest {
  id: string;
  application_id: string;
  type: number;
  data?: any;
  guild_id?: string;
  channel?: any;
  channel_id?: string;
  member?: any;
  user?: any;
  token: string;
  version: number;
  message?: any;
  app_permissions?: string;
  locale?: string;
  guild_locale?: string;
  entitlments?: any;
  authorizing_integration_owners: any;
  context?: any;
}

interface InteractionResponseType {
  1: {
    value: 1;
    description: "ACK a Ping";
  };
  4: {
    value: 4;
    description: "respond to an interaction with a message";
  };
  5: {
    value: 5;
    description: "ACK an interaction and edit a response later, the user sees a loading state";
  };
  6: {
    value: 6;
    description: "for components, ACK an interaction and edit the original message later; the user does not see a loading state";
  };
  7: {
    value: 7;
    description: "for components, edit the message the component was attached to";
  };
  8: {
    value: 8;
    description: "respond to an autocomplete interaction with suggested choices";
  };
  9: {
    value: 9;
    description: "respond to an interaction with a popup modal";
  };
  10: {
    value: 10;
    description: "respond to an interaction with an upgrade button, only available for apps with monetization enabled";
  };
};

interface InteractionResponse {
  type: keyof InteractionResponseType;
  data: {
    tts?: boolean;
    content?: string;
    embeds?: any[];
    allowed_mentions?: any;
    flags?: number;
    components?: any[];
    attachments?: any[];
  }
}

interface SlashCommand {
  type: number;
  token: string;
  member: {
    user: {
      id: string;
      username: string;
      avatar: string;
      discriminator: string;
      public_flags: number;
    };
    roles: string[];
    premium_since: string | null;
    permissions: string;
    pending: boolean;
    nick: string | null;
    mute: boolean;
    joined_at: string;
    is_pending: boolean;
    deaf: boolean;
  };
  id: string;
  guild_id?: string;
  app_permissions?: string;
  guild_locale?: string;
  locale?: string;
  data: {
    options?: {
      type: number;
      name: string;
      value: string;
    }[];
    type: number;
    name: string;
    id: string;
  };
  channel_id?: string;
}

export async function POST(request: Request) {

  const headersList = headers();
  const body: InteractionRequest = await request.json();

  console.log('Interaction Request: ', body);

  // Validate the request signature
  const isValid: boolean = await discordValidateSignature(headersList.get('X-Signature-Timestamp') as string, JSON.stringify(body), headersList.get('X-Signature-Ed25519') as string);
  if (!isValid) {
    return corsResponse({ error: 'Invalid request' }, { status: 401 });
  }

  // Discord PING
  if (body.type === 1) {
    return corsResponse({ type: 1 }, { status: 200 });
  }
  // Type 2: Application Command
  else if (body.type === 2) {
    const command: SlashCommand = body as SlashCommand;

    // Get command name
    const commandName = command.data.name;

    switch (commandName) {
      case 'link':
        // Account Linking Command

        // Create token
        const token = await generateToken();

        // Create URL for account linking
        const url = `${process.env.NEXTAUTH_URL}/link?token=${token}`;

        // Create response
        return corsResponse({
          type: 4,
          data: {
            content: `Please click the following link to link your account: ${url}, this link will expire in 5 minutes.`,
          },
        } as InteractionResponse, { status: 200 });
        break;
      case 'pay':
        // Pay Command
        break;
      case 'request':
        // Request Command
        break;
      case 'balance':
        // Balance Command
        break;
      default:
        // Create default response
        return corsResponse({
          type: 4,
          data: {
            content: `You executed the command: ${commandName}`,
          },
        } as InteractionResponse, { status: 200 });
        break;
    }
  }
}