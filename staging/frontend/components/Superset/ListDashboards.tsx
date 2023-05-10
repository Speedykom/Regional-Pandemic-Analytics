import {
    Card,
    Title,
    Text,
    Flex,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableBody,
    Badge,
    Button,
    Color,
} from "@tremor/react";

interface Props {
    
}

const colors: { [key: string]: Color } = {
    Draft: "gray",
    Published: "emerald",
};

const transactions = [
    {
        dashboardName: "IGAD: Covid-19 Dashboard",
        modifiedBy: "Superset Admin",
        status: "Published",
        modified: "1 day ago",
        createdBy: "Foday SN Kamara",
        link: "#",
    },
    {
        dashboardName: "IGAD: Ebola Dashboard",
        modifiedBy: "Superset Admin",
        status: "Published",
        modified: "2 days ago",
        createdBy: "Foday SN Kamara",
        link: "#",
    },
    {
        dashboardName: "IGAD: Dengue Fever Dashboard",
        modifiedBy: "Superset Admin",
        status: "Draft",
        modified: "3 days ago",
        createdBy: "Foday SN Kamara",
        link: "#",
    },
    {
        dashboardName: "IGAD Covid-19 Dashboard Public",
        modifiedBy: "Superset Admin",
        status: "Published",
        modified: "7 days ago",
        createdBy: "Foday SN Kamara",
        link: "#",
    },
    {
        dashboardName: "IGAD: Covid-19 Dashboard",
        modifiedBy: "Superset Admin",
        status: "Draft",
        modified: "12 days ago",
        createdBy: "Foday SN Kamara",
        link: "#",
    },
];

export default function ListDashboards(props: Props) {
    return (
        <Card>
            <Flex justifyContent="start" className="space-x-2">
                <Title>Total Dashboard(s)</Title>
                <Badge color="gray">5</Badge>
            </Flex>
            <Text className="mt-2">Created on Apache Superset</Text>

            <Table className="mt-6">
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Title</TableHeaderCell>
                        <TableHeaderCell>Modified By</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell>Modified</TableHeaderCell>
                        <TableHeaderCell>Created By</TableHeaderCell>
                        <TableHeaderCell>Link</TableHeaderCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {transactions.map((item) => (
                        <TableRow key={item.dashboardName}>
                            <TableCell>{item.dashboardName}</TableCell>
                            <TableCell>{item.modifiedBy}</TableCell>
                            <TableCell>
                                <Badge color={colors[item.status]} size="xs">
                                    {item.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{item.modified}</TableCell>
                            <TableCell>{item.createdBy}</TableCell>
                            <TableCell>
                                {item.status == "Published" && (<Button size="xs" variant="secondary" color="gray">
                                    View
                                </Button>)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}