import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { ChartList } from "@/modules/superset/views/ListChart";

export default function Charts() {

  
  return (
    <DashboardFrame title="List of Chart(s)">
      <ChartList />
    </DashboardFrame>
  );
}
