import { Table } from "antd";
import { ColumnType } from "antd/es/table";
import { IGADCard } from "./card";
import { EditableCellProps, EditableRowProps } from "./edit-table-row";

interface Role {
	id?: string;
	name: string;
	description: string;
	composite: boolean;
	clientRole: boolean;
}

interface props {
	rows: Role[];
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
		<IGADCard className="">
			<Table
				className="cursor-pointer px-2"
				components={components}
				onRow={onRow}
				size="small"
				rowKey={"id"}
				loading={loading}
				dataSource={rows}
				columns={columns}
				scroll={scroll}
				style={{ width: "100%" }}
				pagination={pagination}
			/>
		</IGADCard>
	);
};

// {(record, index) => {
//   return {
//     onClick: event => {}
//   }
// }}
