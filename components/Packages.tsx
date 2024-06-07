// components/Packages.tsx
"use client";

import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";

export default function Packages() {
  const { packages, setPackages } = useAppContext();
  const [packageName, setPackageName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddPackage = async () => {
    if (!packageName) return;

    const response = await fetch(`https://api.npmjs.org/downloads/point/last-week/${packageName}`);
    if (response.status === 200) {
      if (!packages.includes(packageName)) {
        setPackages([...packages, packageName]);
        setPackageName("");
      } else {
        alert("Package already added");
      }
    } else {
      alert("Package not found");
    }
  };

  const handleRemovePackage = (pkg: string) => {
    setPackages(packages.filter((packageName) => packageName !== pkg));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddPackage();
    }
  };

  return (
    <Button onClick={() => setIsOpen(true)} className="bg-neutral-800 text-app-white px-4 py-2 rounded-md hover:bg-app-orange transition duration-200">
      Edit Packages
      <Transition appear show={isOpen}>
        <Dialog as="div" className="relative z-10 focus:outline-none" onClose={() => setIsOpen(false)}>
          {/* backdrop */}
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

          {/* fullscreen container */}
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <TransitionChild enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <DialogPanel className="w-full max-w-md bg-neutral-800/80 rounded-xl p-6 shadow-lg backdrop-blur-md">
                <DialogTitle className="text-2xl mb-4 text-white">Packages</DialogTitle>
                <div className="mb-4 flex space-x-2">
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter package name"
                    className="border border-neutral-600 bg-neutral-700 text-white rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-app-orange"
                  />
                  <button onClick={handleAddPackage} className="bg-app-orange text-white px-4 py-2 rounded-md hover:bg-app-orange/70 transition duration-200">
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {packages.map((pkg) => (
                    <div key={pkg} className="flex items-center justify-between bg-neutral-700 p-2 rounded-md">
                      {pkg}
                      <button onClick={() => handleRemovePackage(pkg)} className="bg-neutral-900 text-white px-2 py-1 rounded-md ml-2 hover:bg-neutral-800 transition duration-200">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </Button>
  );
}
