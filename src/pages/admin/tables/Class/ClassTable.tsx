import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from "@aws-amplify/ui-react";
import "./ClassTable.css";

export interface ClassTable {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  image?: string;
}

export interface ClassTableProps {
  classes?: ClassTable[];
}

const ClassTable = ({ classes }: ClassTableProps) => {
  return (
    <>
      <Table caption="" highlightOnHover={false}>
        <TableHead>
          <TableRow>
            <TableCell as="th">Name</TableCell>
            <TableCell as="th">Start Time</TableCell>
            <TableCell as="th">End Time</TableCell>
            <TableCell as="th">img</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {classes?.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.start_time}</TableCell>
                <TableCell>{item.end_time}</TableCell>
                <TableCell>
                  <img
                    className="user-table-img"
                    src={item.image}
                    alt="profile"
                  ></img>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default ClassTable;
