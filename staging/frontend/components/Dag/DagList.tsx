import { Switch } from '@headlessui/react';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Flex } from '@tremor/react'
interface IDag {
  [key: string]: unknown;
}

export default function DagList({ dag }: any) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(dag?.is_active);
  }, [dag]);

  return (
    <Flex className='w-full space-y-5 '>
      <div>
        <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white">
          Load Data
        </button>
      </div>
      <div>
        <h4>{dag?.dag_id}</h4>
      </div>
      <div>
        <h6>{dag?.description}</h6>
      </div>
      <div className="flex space-x-2">
        <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white">
          Edit
        </button>
        <button
          className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white focus:outline-none focus:bg-green-500 focus:text-white"
        >
          Run
        </button>
        <button className="px-3 py-1 border border-purple-500 text-purple-500 rounded-md hover:bg-purple-500 hover:text-white focus:outline-none focus:bg-purple-500 focus:text-white">
          View pipeline
        </button>
        <button className="px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white focus:outline-none focus:bg-red-500 focus:text-white">
          Delete
        </button>
      </div>
      <div>
        <label className="flex items-center">
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${enabled ? 'bg-teal-900' : 'bg-red-600'}
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          <span className="ml-2">Auto run</span>
        </label>
      </div>
      <div>
        <h4>Status: ok</h4>
      </div>
    </Flex>
  );
}
