
// app/api/newsletter/route.ts - Newsletter API endpoint
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return Response.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Add your newsletter service integration here
    // Examples: Mailchimp, ConvertKit, EmailOctopus, etc.
    
    // Example with Mailchimp
    if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID) {
      const response = await fetch(
        `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}/members`,
        {
          method: 'POST',
          headers: {
            'Authorization': `apikey ${process.env.MAILCHIMP_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to subscribe to newsletter');
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return Response.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
