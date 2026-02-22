import { NextResponse } from 'next/server';

const GHL_API_KEY = process.env.NEXT_PUBLIC_GHL_API_KEY;
const GHL_LOCATION_ID = process.env.NEXT_PUBLIC_GHL_LOCATION_ID || 'pit-0756dec1-87e2-4b68-8981-46c4035f9937';

export async function GET() {
  try {
    if (!GHL_API_KEY) {
      return NextResponse.json(
        { error: 'GHL API key not configured' },
        { status: 500 }
      );
    }

    // Fetch leads from GHL API
    const leadsResponse = await fetch(
      `https://api.gohighlevel.com/v1/contacts?locationId=${GHL_LOCATION_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${GHL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!leadsResponse.ok) {
      console.error('GHL API error:', leadsResponse.status, leadsResponse.statusText);
      return NextResponse.json(
        { 
          error: `GHL API returned ${leadsResponse.status}`,
          leads: 0,
          appointments: 0,
          conversions: 0
        },
        { status: 200 } // Return 200 with mock data on error
      );
    }

    const leadsData = await leadsResponse.json();
    const leads = leadsData.contacts?.length || 0;

    // Fetch appointments from GHL API
    const appointmentsResponse = await fetch(
      `https://api.gohighlevel.com/v1/appointments?locationId=${GHL_LOCATION_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${GHL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let appointments = 0;
    if (appointmentsResponse.ok) {
      const appointmentsData = await appointmentsResponse.json();
      appointments = appointmentsData.appointments?.length || 0;
    }

    // Mock conversion data (can be enhanced with actual GHL conversion tracking)
    const conversions = Math.floor(leads * 0.18); // Estimate 18% conversion

    return NextResponse.json({
      leads,
      appointments,
      conversions,
      locationId: GHL_LOCATION_ID,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching GHL data:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        leads: 0,
        appointments: 0,
        conversions: 0
      },
      { status: 200 } // Return 200 with error message so UI can display it
    );
  }
}
