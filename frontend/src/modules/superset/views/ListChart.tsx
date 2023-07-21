import { IGADTable } from "@/common/components/common/table";
import { useCharts } from "../hooks/chart";
import { useGetChartsQuery } from "../superset";
 
export const ChartList = () => {
  const { data, isFetching } = useGetChartsQuery()
  const { columns } = useCharts();

  return (
    <div className="">
      <nav>
        <div className="flex justify-between">
          <div>
            <h2 className="text-3xl">Superset Charts</h2>
            <p className="mt-2 text-gray-600">
              Chart list created on Apache Superset.
            </p>
          </div>
        </div>
      </nav>
      <section className="mt-2">
        <div className="py-2">
          <IGADTable
            key={"id"}
            loading={isFetching}
            rows={data ? data.result : []}
            columns={columns}
          />
        </div>
      </section>
    </div>
  );
};
