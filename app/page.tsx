'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { subYears, format } from 'date-fns';

export default function Home() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [packageName, setPackageName] = useState('');
  const [packages, setPackages] = useState<string[]>([
    '@sd-jwt/core',
    '@sd-jwt/types',
    '@sd-jwt/decode',
    '@sd-jwt/utils',
    '@sd-jwt/present',
    '@sd-jwt/sd-jwt-vc',
    '@sd-jwt/hash',
    '@sd-jwt/jwt-status-list',
    '@sd-jwt/crypto-nodejs',
    '@sd-jwt/crypto-browser',
  ]);
  const [startDate, setStartDate] = useState(subYears(new Date(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [totalDownloads, setTotalDownloads] = useState<number>(0); // 총 다운로드 수 상태 추가

  useEffect(() => {
    async function getData() {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      const newData: any = {};
      let newTotalDownloads = 0;

      for (const pkg of packages) {
        const response = await fetch(
          `https://api.npmjs.org/downloads/range/${formattedStartDate}:${formattedEndDate}/${pkg}`,
        );
        const result = await response.json();
        console.log('result', result, pkg);
        let cumulativeDownloads = 0;
        const cumulativeData = result.downloads.map((entry: any) => {
          cumulativeDownloads += entry.downloads;
          return {
            day: entry.day,
            downloads: cumulativeDownloads,
          };
        });
        newData[pkg] = cumulativeData;
        newTotalDownloads += cumulativeDownloads;
      }

      setData(newData);
      setTotalDownloads(newTotalDownloads);
      setLoading(false);
    }

    if (packages.length > 0) {
      getData();
    }
  }, [packages, startDate, endDate]);

  const handleAddPackage = async () => {
    if (!packageName) return;

    const response = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${packageName}`,
    );
    if (response.status === 200) {
      if (!packages.includes(packageName)) {
        setPackages([...packages, packageName]);
        setPackageName('');
      } else {
        alert('Package already added');
      }
    } else {
      alert('Package not found');
    }
  };

  const handleRemovePackage = (pkg: string) => {
    setPackages(packages.filter((packageName) => packageName !== pkg));
    setData((prevData: any) => {
      const newData = { ...prevData };
      delete newData[pkg];
      return newData;
    });
    setTotalDownloads((prevTotal) => {
      const newTotal =
        prevTotal - (data[pkg] ? data[pkg][data[pkg].length - 1].downloads : 0);
      return newTotal;
    });
  };

  const aggregatedData = () => {
    if (!packages.length || !data[packages[0]]) return [];
    if (packages.length !== Object.keys(data).length) return [];

    const days = data[packages[0]].map((entry: any) => entry.day);
    const aggregatedDownloads = days.map((day: string, index: number) => {
      let total = 0;
      console.log('data', data);
      for (const pkg of packages) {
        total += data[pkg][index]?.downloads || 0;
      }
      return { day, downloads: total };
    });

    return aggregatedDownloads;
  };

  const chartData = {
    labels: aggregatedData().map((entry: any) => entry.day),
    datasets: [
      {
        label: 'Cumulative Downloads',
        data: aggregatedData().map((entry: any) => entry.downloads),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h1>Cumulative Downloads for Selected Packages</h1>
      <h2>Total Downloads: {totalDownloads.toLocaleString()}</h2>{' '}
      {/* 총 다운로드 수 표시 */}
      <div>
        <label>Start Date: </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => date && setStartDate(date)}
        />
      </div>
      <Line data={chartData} />
      <input
        type="text"
        value={packageName}
        onChange={(e) => setPackageName(e.target.value)}
        placeholder="Enter package name"
      />
      <button onClick={handleAddPackage}>Add Package</button>
      <ul>
        {packages.map((pkg) => (
          <li key={pkg}>
            {pkg}{' '}
            <button onClick={() => handleRemovePackage(pkg)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
