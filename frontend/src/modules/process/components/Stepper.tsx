import { BiChart, BiGitMerge, BiTable } from 'react-icons/bi';
import { AiOutlineSchedule } from 'react-icons/ai';
import React, { useState } from 'react';
import DataSourceSelection from './StepperElements/DataSourceSelection';
import Orchestration from './StepperElements/Orchestration';
import { PipelineList } from '@/modules/pipeline/interface';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import AnalyticsDataModel from './StepperElements/AnalyticsDataModel';
import Charts from './StepperElements/Charts';

interface StepperProps {
  pipeline: string;
  pipelineList: PipelineList;
  dagId: string;
  refetch: () => QueryActionCreatorResult<any>;
  description: string;
  nextDagRun: string;
  lastParsedTime: string;
  createChartUrl: string | null;
  data_source_name: string;
}

export default function Stepper({
  pipeline,
  pipelineList,
  dagId,
  refetch,
  description,
  nextDagRun,
  lastParsedTime,
  createChartUrl,
  data_source_name,
}: StepperProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      title: 'Data Source Selection',
      icon: <BiGitMerge size={24} />,
      content: (
        <DataSourceSelection
          dagId={dagId}
          pipeline={pipeline}
          pipelineList={pipelineList}
          refetch={refetch}
        />
      ),
    },
    {
      title: 'Orchestration',
      icon: <AiOutlineSchedule size={24} />,
      content: (
        <Orchestration
          dagId={dagId}
          description={description}
          lastParsedTime={lastParsedTime}
          nextDagRun={nextDagRun}
        />
      ),
    },
    {
      title: 'Analytics Data Model',
      icon: <BiTable size={24} />,
      content: <AnalyticsDataModel dataSourceName={data_source_name} />,
    },

    {
      title: 'Charts',
      icon: <BiChart size={24} />,
      content: <Charts createChartUrl={createChartUrl} dagId={dagId} />,
    },
  ];

  const handleStepClick = (index: number) => {
    setActiveStep(activeStep === index ? null : index);
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="stepper-container">
      <div className="flex justify-center items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <div className="flex items-center">
              <div
                className="flex flex-col items-center justify-center text-center focus:outline-none cursor-pointer"
                onClick={() => handleStepClick(index)}
              >
                {/* Outer circle: bg-prim when active, otherwise no background */}
                <div
                  className={`rounded-full ${
                    activeStep === index ? 'bg-prim' : 'bg-prim'
                  } flex items-center justify-center w-16 h-16`}
                >
                  {/* Inner circle: bg-prim-hover when active, bg-white when inactive. Text black */}
                  <div
                    className={`rounded-full ${
                      activeStep === index ? 'bg-prim' : 'bg-white'
                    } flex items-center justify-center w-12 h-12 text-black`}
                  >
                    {step.icon}
                  </div>
                </div>
                {/* Step title: text-black */}
                <span className="text-black mt-2 text-sm">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-24 h-1 bg-prim mx-2"></div> // Connector line
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="step-content">
        {activeStep !== null && steps[activeStep].content}
      </div>
    </div>
  );
}
