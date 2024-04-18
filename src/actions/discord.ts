'use server';

import crypto from 'crypto';
import nacl from 'tweetnacl';

// Import credentials
const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_TOKEN, DISCORD_PUBLIC_KEY } = process.env;

export async function discordValidateSignature(timestamp: string, body: string, signature: string): Promise<boolean> {
  try {
    return nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, "hex"),
      Buffer.from(DISCORD_PUBLIC_KEY as string, "hex"),
    );
  }
  catch (err) {
    console.error('Error validating signature: ', err);
    return false;
  }
}

// Function to get discord list of connected guilds
export async function getConnectedGuilds(accessToken: string) {
  const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  return data;
}

// Create Interaction Response
export async function createInteractionResponse(
  interactionId: string,
  token: string,
  response: any
) {
  await fetch(
    `https://discord.com/api/v10/interactions/${interactionId}/${token}/callback`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    }
  );
}

// Get Original Interaction Response
export async function getOriginalInteractionResponse(
  token: string
) {
  const response = await fetch(
    `https://discord.com/api/v10/webhooks/${DISCORD_CLIENT_ID}/${token}/messages/@original`,
  );

  const data = await response.json();

  return data;
}

// Edit Original Interaction Response
export async function editOriginalInteractionResponse(
  token: string,
  response: any
) {
  await fetch(
    `https://discord.com/api/v10/webhooks/${DISCORD_CLIENT_ID}/${token}/messages/@original`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    }
  );
}

// Delete Original Interaction Response
export async function deleteOriginalInteractionResponse(
  token: string
) {
  await fetch(
    `https://discord.com/api/v10/webhooks/${DISCORD_CLIENT_ID}/${token}/messages/@original`,
    {
      method: "DELETE",
    }
  );
}

// Create Followup Message
export async function createFollowupMessage(
  token: string,
  response: any
) {
  await fetch(
    `https://discord.com/api/v10/webhooks/${DISCORD_CLIENT_ID}/${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    }
  );
}

// Get Followup Message
export async function getFollowupMessage(
  token: string,
  messageId: string
) {
  const response = await fetch(
    `https://discord.com/api/v10/webhooks/${DISCORD_CLIENT_ID}/${token}/messages/${messageId}`,
  );

  const data = await response.json();

  return data;
}

// Edit Followup Message
export async function editFollowupMessage(
  token: string,
  messageId: string,
  response: any
) {
  await fetch(
    `https://discord.com/api/v10/webhooks/${DISCORD_CLIENT_ID}/${token}/messages/${messageId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    }
  );
}

// Delete Followup Message
export async function deleteFollowupMessage(
  token: string,
  messageId: string
) {
  await fetch(
    `https://discord.com/api/v10/webhooks/${DISCORD_CLIENT_ID}/${token}/messages/${messageId}`,
    {
      method: "DELETE",
    }
  );
}