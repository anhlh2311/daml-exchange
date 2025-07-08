"use client";

import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { mockParties, Party } from '@/types/party';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function PartySelector() {
  const [selected, setSelected] = useState(mockParties[0]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-4 pr-12 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-base leading-6">
              <span className="flex items-center">
                <span className="h-7 w-7 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">{selected.displayName[0]}</span>
                </span>
                <span className="ml-3 block truncate">{selected.displayName}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-80 w-64 overflow-auto rounded-md bg-white py-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {mockParties.map((party) => (
                  <Listbox.Option
                    key={party.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-3 pl-4 pr-9'
                      )
                    }
                    value={party}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span className={classNames(
                            'h-7 w-7 flex-shrink-0 rounded-full flex items-center justify-center',
                            active ? 'bg-indigo-300' : 'bg-indigo-100'
                          )}>
                            <span className={classNames(
                              'text-sm font-medium',
                              active ? 'text-white' : 'text-indigo-600'
                            )}>
                              {party.displayName[0]}
                            </span>
                          </span>
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {party.displayName}
                            <span className="ml-2 text-sm text-gray-500">({party.role})</span>
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-6 w-6" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
