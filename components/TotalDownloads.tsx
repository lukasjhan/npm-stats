"use client";

import { useAppContext } from "@/context/AppContext";
import { fetchTotalDownloads } from "@/lib/fetchDownloads";
import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";

const SlotMachineNumber = ({ number }: { number: number }) => {
  const [displayNumber, setDisplayNumber] = useState("");

  useEffect(() => {
    const finalNumber = number.toLocaleString();
    const maxLength = finalNumber.length;
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex += 1;
      let newDisplayNumber = "";

      for (let i = 0; i < maxLength; i++) {
        if (finalNumber[i] === ",") {
          newDisplayNumber += ",";
        } else if (i < currentIndex) {
          newDisplayNumber += finalNumber[i];
        } else {
          newDisplayNumber += Math.floor(Math.random() * 10);
        }
      }

      setDisplayNumber(newDisplayNumber);

      if (currentIndex === maxLength) {
        clearInterval(interval);
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [number]);

  return <span className="font-sans font-semibold slashed-zero tabular-nums">{displayNumber}</span>;
};

export default function TotalDownloads() {
  const { packages, startDate, endDate } = useAppContext();
  const [totalDownloads, setTotalDownloads] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const downloads = await fetchTotalDownloads(packages, startDate, endDate);
      setTotalDownloads(downloads);
    };

    fetchData();
  }, [packages, startDate, endDate]);

  return (
    <Transition appear show={totalDownloads !== null} enter="transition duration-300 ease-in" enterFrom="translate-y-5 opacity-0" enterTo="translate-y-0 opacity-100">
      <h2 className="text-3xl">
        Total Downloads: <SlotMachineNumber number={totalDownloads} />
      </h2>
    </Transition>
  );
}
