'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const STATUS_OPTIONS = [
    { value: 'todo', label: 'To do' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'done', label: 'Done' },
];

export function StatusSelect() {
    const { control } = useFormContext();

    if (!control) {
        throw new Error('StatusSelect must be used inside a FormProvider');
    }

    return (
        <Controller
            name="status"
            control={control}
            defaultValue="todo"
            render={({ field }) => (
                <div className="relative">
                    <Listbox value={field.value} onChange={field.onChange}>
                        <Listbox.Button
                            className="w-full rounded-md border px-3 py-2 text-left
                         border-gray-300 bg-white text-gray-900
                         dark:border-zinc-700 dark:bg-[#0F1624] dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            {STATUS_OPTIONS.find((s) => s.value === field.value)?.label ??
                                'Select status'}
                        </Listbox.Button>

                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options
                                className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border
                           border-gray-200 bg-white text-gray-900 shadow-lg
                           dark:border-zinc-700 dark:bg-[#0F1624] dark:text-gray-100"
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <Listbox.Option
                                        key={s.value}
                                        value={s.value}
                                        className={({ active }) =>
                                            `cursor-pointer px-3 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-zinc-800' : ''
                                            }`
                                        }
                                    >
                                        {s.label}
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
