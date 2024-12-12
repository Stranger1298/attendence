import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Schedule() {
  const location = useLocation();
  const { id } = location.state || {};

  console.log('Received Teacher ID:', id);

  const [scheduleData, setScheduleData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!id) {
        console.error('Teacher ID is not provided');
        setError('Teacher ID is not provided');
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/schedule/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setScheduleData(data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setError('Error fetching schedule: ' + error.message);
      }
    };

    fetchSchedule();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!scheduleData) {
    return <div>Loading...</div>;
  }

  const { Schedule, Timings } = scheduleData;

  return (
    <div style={{ margin: "50%" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Day</StyledTableCell>
              {Timings.map((time, index) => (
                <StyledTableCell key={index}>{time}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Schedule.map((day) => (
              <StyledTableRow key={day.Day}>
                <StyledTableCell>{day.Day}</StyledTableCell>
                {day.Periods.map((period, index) => (
                  <StyledTableCell key={index}>{period || ""}</StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
