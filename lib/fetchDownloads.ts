import axios from 'axios';

export async function fetchDownloads(packageName: string) {
  const response = await axios.get(
    `https://api.npmjs.org/downloads/range/last-year/${packageName}`,
  );
  const data = response.data;
  return data;
}
