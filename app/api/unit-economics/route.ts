import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = '/tmp/unit-economics-data.json';

interface UnitEconomicsData {
  monthlyRevenue: { month: string; value: number }[];
  grossMargin: number;
  netMargin: number;
  revenueTarget: number;
  costPerLead: number;
  closeRate: number;
  costPerClose: number;
  leadsPerDay: number;
  currentAdSpend: number;
  targetAdSpend: number;
  revenuePerStaff: number;
  staffCost: number;
  totalRevenue: number;
  dealsNeededFor100k: number;
  staffNeededFor100k: number;
  bottleneck: 'marketing' | 'sales' | 'delivery' | 'onboarding' | 'none';
  lastUpdated: string;
}

const DEFAULT_DATA: UnitEconomicsData = {
  monthlyRevenue: [
    { month: 'Jan', value: 7000 },
    { month: 'Feb', value: 14000 },
    { month: 'Mar', value: 40000 },
  ],
  grossMargin: 90,
  netMargin: 55,
  revenueTarget: 100000,
  costPerLead: 18.50,
  closeRate: 11,
  costPerClose: 168,
  leadsPerDay: 12.5,
  currentAdSpend: 160,
  targetAdSpend: 250,
  revenuePerStaff: 40000,
  staffCost: 22000,
  totalRevenue: 40000,
  dealsNeededFor100k: 100,
  staffNeededFor100k: 3,
  bottleneck: 'sales',
  lastUpdated: new Date().toISOString(),
};

function loadData(): UnitEconomicsData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading unit economics data:', err);
  }
  return DEFAULT_DATA;
}

function saveData(data: UnitEconomicsData) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving unit economics data:', err);
  }
}

export async function GET() {
  try {
    const data = loadData();
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch unit economics data' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const currentData = loadData();

    // Merge with new data
    const updatedData: UnitEconomicsData = {
      ...currentData,
      ...body,
      lastUpdated: new Date().toISOString(),
    };

    // Recalculate derived metrics if base numbers changed
    if (body.currentAdSpend) {
      updatedData.currentAdSpend = body.currentAdSpend;
    }
    if (body.closeRate && body.leadsPerDay) {
      updatedData.costPerClose = Math.round(
        (updatedData.currentAdSpend * 30) / (body.leadsPerDay * 30 * body.closeRate / 100)
      );
    }

    saveData(updatedData);

    return NextResponse.json(updatedData, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update unit economics data' },
      { status: 400 }
    );
  }
}
