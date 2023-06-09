import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { HopList } from "@/src/modules/hops/views/List";

export const LoadHops = () => {
  return (
    <DashboardFrame title="List(s) of Hops">
      <HopList />
    </DashboardFrame>
  );
};

export default function Hops() {
  return <LoadHops />;
}
