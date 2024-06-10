import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const packages = searchParams.get('packages')?.split(',') || [];
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!packages || !startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 },
    );
  }

  const formattedStartDate = format(
    new Date(startDate as string),
    'yyyy-MM-dd',
  );
  const formattedEndDate = format(new Date(endDate as string), 'yyyy-MM-dd');
  const data: any = {};
  let totalDownloads = 0;

  const promises = packages.map(async (pkg) => {
    const response = await fetch(
      `https://api.npmjs.org/downloads/range/${formattedStartDate}:${formattedEndDate}/${pkg}`,
    );
    const result = await response.json();
    let cumulativeDownloads = 0;
    const cumulativeData = result.downloads.map((entry: any) => {
      cumulativeDownloads += entry.downloads;
      return {
        day: entry.day,
        downloads: cumulativeDownloads,
      };
    });
    data[pkg] = cumulativeData;
    totalDownloads += cumulativeDownloads;
  });

  await Promise.all(promises);

  return NextResponse.json({
    data,
    totalDownloads,
  });
}
