import { useState, Fragment } from 'react';
import { Switch, Transition } from '@headlessui/react';
import { MoonIcon, SunIcon } from "@heroicons/react/outline";

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`bg-gradient-to-r from-orange-500 to-blue-500 relative inline-flex h-6 w-14 items-center rounded-full`}
    >
      <span className="sr-only">Enable Dark Mode</span>
      <span
        className={`${
          enabled ? 'translate-x-8' : 'translate-x-0'
        } transition-transform ease-in flex h-7 w-7 transform rounded-full bg-white dark:bg-slate-800 items-center justify-center`}
      >
        <Transition
          as={Fragment}
          show={enabled}
          enter="transition-opacity duration-75 "
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <MoonIcon className="h-5 w-5 dark:stroke-white" />
        </Transition>
        <Transition
          as={Fragment}
          show={!enabled}
          enter="transition-opacity duration-75 "
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <SunIcon className="h-5 w-5  dark:stroke-white" />
        </Transition>
      </span>
    </Switch>
  )
}
