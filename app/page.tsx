import TotalDownloads from '@/components/TotalDownloads';
import Packages from '@/components/Packages';
import Chart from '@/components/Chart';
import AppProvider from '@/context/AppContext';
import { Title } from '@/components/Title';

export default function Home() {
  return (
    <AppProvider>
      <div className="flex flex-col max-w-[1440px] w-full mx-auto p-4 dark:bg-black dark:text-white">
        <div className="flex justify-between items-center mb-2">
          <Title />
          <Packages />
        </div>
        <TotalDownloads />
        <Chart />
      </div>
    </AppProvider>
  );
}
