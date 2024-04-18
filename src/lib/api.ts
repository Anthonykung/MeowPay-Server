'use server';

import { NextResponse } from 'next/server';

export async function corsResponse(data: any, responseConfig: any): Promise<any> {
  return NextResponse.json(
    data,
    {
      ...responseConfig,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}