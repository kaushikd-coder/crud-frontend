'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const PRIORITY = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];

export function PrioritySelect() {
    const { control } = useFormContext(); 

    return (
        <Controller
            name="priority"
            control={control}
            defaultValue="medium"
            render={({ field }) => (
                <div className="relative">
                    <Listbox value={field.value} onChange={field.onChange}>
                        <Listbox.Button className="w-full rounded-md border px-3 py-2 text-left border-gray-300 bg-white text-gray-900 dark:border-zinc-700 dark:bg-[#0F1624] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400">
                            {PRIORITY.find(p => p.value === field.value)?.label ?? 'Select…'}
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-gray-200 bg-white text-gray-900 shadow-lg dark:border-zinc-700 dark:bg-[#0F1624] dark:text-gray-100">
                                {PRIORITY.map(p => (
                                    <Listbox.Option
                                        key={p.value}
                                        value={p.value}
                                        className={({ active }) =>
                                            `cursor-pointer px-3 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-zinc-800' : ''}`
                                        }
                                    >
                                        {p.label}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </Listbox>
                </div>
            )}
        />
    );
}
