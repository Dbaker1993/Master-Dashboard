import { NextResponse } from 'next/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const AIRWALLEX_API_KEY = process.env.AIRWALLEX_API_KEY;

export async function GET() {
  try {
    let stripeIncome = 0;
    let stripeTransactions = 0;
    let airwallexExpenses = 0;

    // Fetch Stripe data (Personal + DB Enterprises)
    if (STRIPE_SECRET_KEY) {
      try {
        const stripeResponse = await fetch('https://api.stripe.com/v1/charges?limit=100', {
          headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        if (stripeResponse.ok) {
          const stripeData = await stripeResponse.json();
          stripeTransactions = stripeData.data?.length || 0;
          stripeIncome = (stripeData.data || []).reduce((sum: number, charge: any) => {
            return sum + (charge.paid ? (charge.amount / 100) : 0);
          }, 0);
        }
      } catch (stripeError) {
        console.error('Stripe error:', stripeError);
      }
    }

    // Fetch Airwallex data (Expenses)
    if (AIRWALLEX_API_KEY) {
      try {
        const airwallexResponse = await fetch(
          'https://api.airwallex.com/v1/transactions',
          {
            headers: {
              'Authorization': `Bearer ${AIRWALLEX_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (airwallexResponse.ok) {
          const airwallexData = await airwallexResponse.json();
          airwallexExpenses = (airwallexData.data || []).reduce((sum: number, tx: any) => {
            return sum + (tx.amount || 0);
          }, 0);
        }
      } catch (airwallexError) {
        console.error('Airwallex error:', airwallexError);
      }
    }

    // Calculate totals
    const totalIncome = stripeIncome; // GBP
    const totalExpenses = airwallexExpenses;
    const netRevenue = totalIncome - totalExpenses;

    return NextResponse.json({
      totalIncome: Math.round(totalIncome),
      totalExpenses: Math.round(totalExpenses),
      netRevenue: Math.round(netRevenue),
      stripeTransactions,
      airwallexExpenses: Math.round(airwallexExpenses),
      lastUpdated: new Date().toISOString(),
      connected: {
        stripe: !!STRIPE_SECRET_KEY,
        airwallex: !!AIRWALLEX_API_KEY,
      }
    });
  } catch (error) {
    console.error('Error fetching finance data:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        totalIncome: 0,
        totalExpenses: 0,
        netRevenue: 0,
        stripeTransactions: 0,
        airwallexExpenses: 0,
      },
      { status: 200 }
    );
  }
}
