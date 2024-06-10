import colors from '@/lib/colors';
import { format } from 'date-fns';

export async function fetchDownloads(
  packages: string[],
  startDate: Date,
  endDate: Date,
) {
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');

  const response = await fetch(
    `/api/downloads?packages=${packages.join(
      ',',
    )}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch downloads');
  }

  const { data, totalDownloads } = await response.json();
  return { data, totalDownloads };
}

export async function fetchTotalDownloads(
  packages: string[],
  startDate: Date,
  endDate: Date,
) {
  const { totalDownloads } = await fetchDownloads(packages, startDate, endDate);
  return totalDownloads;
}

export async function fetchChartData(
  packages: string[],
  startDate: Date,
  endDate: Date,
) {
  const { data } = await fetchDownloads(packages, startDate, endDate);

  const days = data[packages[0]].map((entry: any) => entry.day);
  const aggregatedDownloads = days.map((day: string, index: number) => {
    let total = 0;
    for (const pkg of packages) {
      total += data[pkg][index]?.downloads || 0;
    }
    return { day, downloads: total };
  });

  return {
    labels: aggregatedDownloads.map((entry: any) => entry.day),
    datasets: [
      {
        label: 'Total Downloads',
        data: aggregatedDownloads.map((entry: any) => entry.downloads),
        fill: false,
        borderColor: colors.orange,
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  };
}
