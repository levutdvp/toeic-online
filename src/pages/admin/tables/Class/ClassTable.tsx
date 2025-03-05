import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from "@aws-amplify/ui-react";
import "./ClassTable.css";

export interface ClassTable {
  id?: number;
  class_code: string;
  class_type: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  days: string;
  number_of_students: number;
  teacher: string;
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
            <TableCell as="th">Teacher</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {classes?.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>{item.class_code}</TableCell>
                <TableCell>{item.class_type}</TableCell>
                <TableCell>{item.start_date}</TableCell>
                <TableCell>{item.end_date}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default ClassTable;
