import colors from "@/lib/colors";
import { format } from "date-fns";

export async function fetchDownloads(packages: string[], startDate: Date, endDate: Date) {
  const formattedStartDate = format(startDate, "yyyy-MM-dd");
  const formattedEndDate = format(endDate, "yyyy-MM-dd");
  const data: any = {};
  let totalDownloads = 0;

  const promises = packages.map(async (pkg) => {
    const response = await fetch(
      `https://api.npmjs.org/downloads/range/${formattedStartDate}:${formattedEndDate}/${pkg}`,
      { next: { revalidate: 3600 } } // Revalidate once a day
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

  return { data, totalDownloads };
}

export async function fetchTotalDownloads(packages: string[], startDate: Date, endDate: Date) {
  const { totalDownloads } = await fetchDownloads(packages, startDate, endDate);
  return totalDownloads;
}

export async function fetchChartData(packages: string[], startDate: Date, endDate: Date) {
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
        label: "Total Downloads",
        data: aggregatedDownloads.map((entry: any) => entry.downloads),
        fill: false,
        borderColor: colors.orange,
        tension: 0.1,
      },
    ],
  };
}
