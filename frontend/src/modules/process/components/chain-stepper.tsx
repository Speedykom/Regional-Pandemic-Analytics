export interface StepProps {
  title: string;
  icon: string;
  onClick: () => void;
  isLast?: boolean;
}

const Step = ({ isLast, onClick, icon, title }: StepProps) => {
  return (
    <div className="flex items-center space-x-2 flex-1">
      <div className="cursor-pointer flex space-x-2" onClick={onClick}>
        <i className="text-2xl text-green-700">{icon}</i>
        <p>{title}</p>
      </div>
      {isLast ? null : <hr className="flex-1" />}
    </div>
  );
};

interface Props {
  steps: any[];
}

export const ChainStepper = ({ steps }: Props) => {
  return (
    <div className="flex space-x-5">
      {steps.map((step, index) => (
        <Step
          title={step.title}
          key={index}
          icon={step.icon}
          onClick={step.onClick}
          isLast={steps.length - 1 === index}
        />
      ))}
    </div>
  );
};
