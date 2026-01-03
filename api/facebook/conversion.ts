import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const PIXEL_ID = '1406183214178910';
const ACCESS_TOKEN = 'EABopOtc87S0BPZCHz1Xkw5WkHLHppZCiCzMAs51jzYUIE6yJ5LZA7VcRcRIs49oZCk7kxTH0ilZC5vfJIFp0MSZC3kLq8NbIhkrgj7dAJYVZAjxR7LonQOA7uisnGnhz20qjstq57It7X08ufCAyEqbDfggWqNNYpbZCfpFYovDsX0Bu6YvZAg9ZBZB9Vpqo8OKOuYOYwZDZD';

interface ConversionEvent {
  event_name: string;
  event_time: number;
  user_data: {
    em?: string;
    ph?: string;
    client_ip_address?: string;
    client_user_agent?: string;
    fbp?: string;
    fbc?: string;
  };
  custom_data?: any;
  event_source_url?: string;
  action_source: string;
}

// Hash data for privacy
function hashData(data: string): string {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { 
      event_name, 
      email, 
      phone, 
      fbp, 
      fbc,
      event_source_url,
      custom_data 
    } = req.body;

    const event: ConversionEvent = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      user_data: {
        client_ip_address: req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress,
        client_user_agent: req.headers['user-agent'],
        fbp,
        fbc
      },
      event_source_url: event_source_url || 'https://xperiencewave.com/vsltraining',
      action_source: 'website'
    };

    // Add Facebook browser cookies
    if (fbp) event.user_data.fbp = fbp;
    if (fbc) event.user_data.fbc = fbc;

    // Hash email and phone
    if (email) {
      event.user_data.em = hashData(email);
    }
    if (phone) {
      event.user_data.ph = hashData(phone);
    }

    if (custom_data) {
      event.custom_data = custom_data;
    }

    // Send to Facebook Conversion API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [event]
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Facebook Conversion API Error:', result);
      throw new Error('Failed to send conversion event');
    }

    return res.status(200).json({
      success: true,
      facebook_response: result
    });

  } catch (error: any) {
    console.error('Conversion API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}