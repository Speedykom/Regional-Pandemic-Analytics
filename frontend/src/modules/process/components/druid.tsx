import { Modal } from "antd";
import {
  useGetDruidChainMutation,
  useUpdateDruidChainMutation,
} from "../process";
import { useEffect, useState } from "react";
import {
  Button,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { toast } from "react-toastify";
import { Loading } from "@/common/components/Loading";
import { Loader } from "@/common/components/Loader";

interface Props {
  state: boolean;
  onClose: () => void;
  process: any;
}

const formatBytes = (bytes: number) => {
  if (!+bytes) return "0 Bytes";

  const decimals = 2;

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const DruidModal = ({ state, onClose, process }: Props) => {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [getData] = useGetDruidChainMutation();
  const [updateDruid] = useUpdateDruidChainMutation();
  const [rollup, setRollup] = useState<any>("False");
  const [segiment, setSegiment] = useState<any>("day");
  const [query, setQuery] = useState<any>("none");
  const [data, setData] = useState<any>();

  const queries = [
    "all",
    "none",
    "second",
    "minute",
    "five_minute",
    "ten_minute",
    "fifteen_minute",
    "thirty_minute",
    "hour",
    "six_hour",
    "eight_hour",
    "day",
    "week",
    "month",
    "quarter",
    "year",
  ];
  const segments = ["hour", "day", "week", "month", "year", "all"];
  const rollups = [
    { name: "True", value: "True" },
    { name: "False", value: "False" },
  ];

  useEffect(() => {
    if (state && process) {
      getData(process.id).then(({ data }: any) => {
        setData(data.data);
        setIsLoading(false);
      });
    }
  }, [getData, process, state]);

  const submit = () => {
    const body: any = { id: process.id, query, rollup, segiment };
    setLoading(true);
    updateDruid(body).then((res) => {
      toast.success("Druid  successfully on process chain", {
        delay: 200,
        position: "top-right",
      });
      onClose();
      setLoading(false);
    });
  };

  return (
    <Modal
      open={state}
      title="Analytics Data Model"
      width={800}
      onCancel={onClose}
      maskClosable={false}
      footer
    >
      {isLoading ? (
        <div className="h-52 flex items-center justify-center border-t">
          <div className="h-16 w-16">
          <Loader />
          </div>
        </div>
      ) : (
        <div className="mb-3 border-t py-3">
          <div className="rounded-md border pt-3 mb-2">
            <h2 className="px-4 font-bold border-b pb-2">Injections</h2>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>DataSource</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.tasks.map((task: any) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.dataSource}</TableCell>
                    <TableCell>
                      {new Date(task.createdTime).toLocaleString()}
                    </TableCell>
                    <TableCell>{task.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="rounded-md border pt-3 mb-2">
            <h2 className="px-4 font-bold border-b pb-2">Segments</h2>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>DataSource</TableHeaderCell>
                  <TableHeaderCell>Version</TableHeaderCell>
                  <TableHeaderCell>Size</TableHeaderCell>
                  <TableHeaderCell>Dimensions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.segments.map((task: any) => (
                  <TableRow key={task.version}>
                    <TableCell>{task.dataSource}</TableCell>
                    <TableCell>{task.version}</TableCell>
                    <TableCell>{formatBytes(task.size)}</TableCell>
                    <TableCell>{task.dimensions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="rounded-md border pt-3">
            <h2 className="px-4 font-bold border-b pb-2">
              Update Granularity Spec
            </h2>
            <div className="flex space-x-3 p-4">
              <div className="flex-1">
                <p className="text-sm mb-1">
                  Query Granularity <span className="text-red-500">*</span>
                </p>
                <Select
                  value={query}
                  onChange={(q) => setQuery(q)}
                  placeholder="Select query granularity"
                >
                  {queries.map((e, index) => (
                    <SelectItem key={index} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex-1">
                <p className="text-sm mb-1">
                  Segment Granularity <span className="text-red-500">*</span>
                </p>
                <Select
                  value={segiment}
                  onChange={(q) => setSegiment(q)}
                  placeholder="Select segment granularity"
                >
                  {segments.map((e, index) => (
                    <SelectItem key={index} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex-1">
                <p className="text-sm mb-1">
                  Segment Roll Up <span className="text-red-500">*</span>
                </p>
                <Select
                  value={rollup}
                  onChange={(q) => setRollup(q)}
                  placeholder="Select roll up"
                >
                  {rollups.map((e, index) => (
                    <SelectItem key={index} value={e.value}>
                      {e.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={submit}
                  loading={loading}
                  className="bg-prim text-white rounded-md border-0 hover:bg-green-700"
                  size="lg"
                >
                  Update Chain
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
