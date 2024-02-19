import React from 'react';
import JoyRide, { Step } from 'react-joyride';

const TOUR_STEPS: Step[] = [
  {
    target: '.home',
    spotlightClicks: true,
    title: 'Home',
    content:
      "The home page displays the user's favorite dashboards. To add or remove a dashboard from favorites, kindly navigate to the Dashboards section and click on the star icon.",
    disableBeacon: true,
  },
  {
    target: '.dashboards',
    spotlightClicks: true,
    title: 'Dashboards',
    content:
      'The Dashboards section displays all available dashboards, showcasing only those set to publish on Superset. When creating a dashboard in Superset, ensure that its status is changed from draft to published.',
  },
  {
    target: '.charts',
    spotlightClicks: true,
    title: 'Charts',
    content: 'The charts section is showing all available charts.',
  },
  {
    target: '.process-chains',
    spotlightClicks: true,
    title: 'Process Chains',
    content:
      'The Process Chains section is the core functionality of the RePan application. Users can either create a new process chain or view existing ones. A process chain is a sequence of steps executed in a specific order. To create a new process chain, click on the "Create Process Chain" button. It\'s important to note that before running a process chain, users should first create a pipeline within the "My Pipelines" section.',
  },
  {
    target: '.pipelines',
    spotlightClicks: true,
    title: 'My Pipelines',
    content:
      'The Pipelines section displays all available pipelines. Users can create a new pipeline by clicking on the "Create Pipeline" button. Selecting one of the predefined templates is an option when creating a pipeline. It\'s important to note that at least one pipeline must be created to run a process chain.',
  },
  {
    target: '.accounts',
    spotlightClicks: true,
    title: 'Accounts',
    content:
      'The Accounts section displays all available accounts and is accessible only to admin users.',
  },
];

const Tour: React.FC = () => {
  return (
    <>
      <JoyRide
        steps={TOUR_STEPS}
        continuous={true}
        showSkipButton={true}
        spotlightClicks={true}
        showProgress={true}
        styles={{
          tooltipContainer: {
            textAlign: 'left',
          },
          buttonNext: {
            backgroundColor: 'green',
          },
          buttonBack: {
            marginRight: 10,
          },
        }}
      />
    </>
  );
};

export default Tour;
