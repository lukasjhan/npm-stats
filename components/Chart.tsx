'use client';

import 'chart.js/auto';
import 'react-datepicker/dist/react-datepicker.css';
import { Line } from 'react-chartjs-2';
import { fetchChartData } from '@/lib/fetchDownloads';
import { use, useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Transition } from '@headlessui/react';

const chartOptions = {
  responsive: true,
  scales: {
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)', // Set Y-axis grid color to white (transparency 0.1)
      },
    },
  },
};

export default function Chart() {
  const { packages, startDate, endDate } = useAppContext();

  //refactor to use useEffect Way
  const [chartData, setChartData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchChartData(packages, startDate, endDate);
      setChartData(data);
    };

    fetchData();
  }, [packages, startDate, endDate]);

  return (
    <div className="w-full">
      <Transition
        appear
        show={chartData.datasets?.length > 0}
        enter="transition-all duration-1000"
        enterFrom="opacity-0 translate-y-20"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all duration-500"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-20"
      >
        <div className="chart-container">
          <Line
            data={chartData}
            options={{
              ...chartOptions,
              animation: { duration: 500, easing: 'easeOutQuart' },
            }}
          />
        </div>
      </Transition>
    </div>
  );
}
