import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { MyPipelineList } from "@/modules/pipeline/views/list";

export const LoadHops = () => {
  return (
    <DashboardFrame title="My Pipeline">
      <MyPipelineList />
    </DashboardFrame>
  );
};

export default function Hops() {
  return <LoadHops />;
}
