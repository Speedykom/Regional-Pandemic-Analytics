import { Table } from "antd";
import { ColumnType } from "antd/es/table";
import { IGADCard } from "./card";
import { EditableCellProps, EditableRowProps } from "./edit-table-row";

interface props {
	rows: any[];
	columns: ColumnType<any>[];
	loading?: boolean;
	rowKey?: string;
	onRow?: any;
	components?: {
		body: {
			row: React.FC<EditableRowProps>;
			cell: React.FC<EditableCellProps>;
		};
	};
	scroll?:
		| ({
				x?: string | number | true | undefined;
				y?: string | number | undefined;
		  } & {
				scrollToFirstRowOnChange?: boolean | undefined;
		  })
		| undefined;
	pagination?: any;
}

export const IGADTable = ({
	rows,
	columns,
	loading,
	scroll,
	components,
	onRow,
	pagination,
}: props) => {
	return (
        <div className="border bg-white rounded-md p-1 mt-5">
			<Table
				className="cursor-pointer"
				components={components}
				onRow={onRow}
				rowKey={"id"}
				loading={loading}
				dataSource={rows}
				columns={columns}
				scroll={scroll}
				style={{ width: "100%" }}
				pagination={pagination}
			/>
		</div>
	);
};

// {(record, index) => {
//   return {
//     onClick: event => {}
//   }
// }}
