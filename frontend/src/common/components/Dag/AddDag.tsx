import { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  hopFilePath: string;
  hopProjectFolder: string;
  hopProjectName: string;
  hopEnvName: string;
  hopEnvConfigFileNamePaths: string;
  hopRunConfig: string;
  scheduleInterval: number;
  scheduleIntervalBy: string;
}

const AddDag: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    hopFilePath: '',
    hopProjectFolder: '',
    hopProjectName: '',
    hopEnvName: '',
    hopEnvConfigFileNamePaths: '',
    hopRunConfig: '',
    scheduleInterval: 1,
    scheduleIntervalBy: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement> | any | null) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Submit form data to server or do something else with it
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="my-4">
        <label htmlFor="hopFilePath" className="block font-medium mb-1">
          Hop File Path
        </label>
        <input
          type="text"
          name="hopFilePath"
          value={formData.hopFilePath}
          onChange={handleChange}
          className="block w-full px-1 py-3  rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div className="my-4">
        <label htmlFor="hopProjectFolder" className="block font-medium mb-1">
          Hop Project Folder
        </label>
        <input
          type="text"
          name="hopProjectFolder"
          value={formData.hopProjectFolder}
          onChange={handleChange}
          className="block w-full px-1 rounded-md py-3  border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div className="my-4">
        <label htmlFor="hopProjectName" className="block font-medium mb-1">
          Hop Project Name
        </label>
        <input
          type="text"
          name="hopProjectName"
          value={formData.hopProjectName}
          onChange={handleChange}
          className="block w-full px-1 py-3  rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div className="my-4">
        <label htmlFor="hopEnvName" className="block font-medium mb-1">
          Hop Envrionment Name
        </label>
        <input
          type="text"
          name="hopEnvName"
          value={formData.hopEnvName}
          onChange={handleChange}
          className="block w-full px-1 py-3 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div className="my-4">
        <label
          htmlFor="hopEnvConfigFileNamePaths"
          className="block font-medium mb-1"
        >
          Hop Environment Config File Name Paths
        </label>
        <input
          type="text"
          name="hopEnvConfigFileNamePaths"
          value={formData.hopEnvConfigFileNamePaths}
          onChange={handleChange}
          className="block w-full px-1 py-3 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div className="my-4">
        <label htmlFor="hopRunConfig" className="block font-medium mb-1">
          Hop Run Config
        </label>
        <input
          type="text"
          name="hopRunConfig"
          value={formData.hopRunConfig}
          onChange={handleChange}
          className="block w-full px-1 py-3 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div className="flex justify-between">
        <div className="relative mt-2 rounded-md shadow-sm">
          <label htmlFor="scheduleInterval" className="block font-medium mb-1">
            Cron Interval
          </label>
          <input
            type="number"
            name="scheduleInterval"
            id="scheduleInterval"
            value={formData.scheduleInterval}
            onChange={handleChange}
            className="block w-full px-1 rounded-md border-0 pl-3 py-3 pb-1.5 pt-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="0.00"
          />
        </div>
        <div className=" relative mt-2 rounded-md shadow-sm">
          <label htmlFor="scheduleIntervalBy" className="">
            By
          </label>
          <select
            id="scheduleIntervalBy"
            name="scheduleIntervalBy"
            value={formData.scheduleIntervalBy}
            onChange={handleChange}
            className="block w-full rounded-md border-0 pl-2 pr-7 py-3 pb-3.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          >
            <option>Hours</option>
            <option>Days</option>
            <option>Weeks</option>
            <option>Months</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 mt-7 rounded-md"
        style={{ background: '#3c81f6' }}
      >
        Save
      </button>
    </form>
  );
};

export default AddDag;
