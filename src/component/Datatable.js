import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Chart } from "react-google-charts";
import { Grid, Button } from "@mui/material";
import { Box, Container } from "@mui/system";
import { styled } from "@mui/material/styles";
import Navbar from "./Navbar";
import Position from "rsuite/esm/Overlay/Position";
import { BorderAll } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontWeight: "600",
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}));
export const options = {
  title: "Total Screens",
    is3D: true,
  };

function Data() {
  const [data, setdata] = useState([]);
  const [alldate, setAllDate] = useState([]);
  const [state1, setState1] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  const [data1, setdata1] = useState(
    //use for charts... 
    // ["Employee", "1234"]

  );

  const setChartData = (data) => {
    let dates = new Set(data.map(d => {
      return new Date(d.creation_date).toDateString()
    }))
    let obj = {};
    let arr = data.map((d)=> {
      var a = new Date(d.creation_date).toDateString();
      if(dates.has(a)){
        // console.log(a)
        if(obj.hasOwnProperty(a)){
          obj[a] = [...obj[a], d.campaign_name];
          // console.log(obj[a])
        }
        else {
          obj[a] = new Array(d.campaign_name);
        }
        return true;
      }
      return false;
    })
     let keys = Object.keys(obj);
     let b = keys.map((k) => {
      return [k, Object.values(obj[k]).length];
     })
    // console.log(b);
    // setdata1(prev => [...prev, b])
    setdata1([["Date", "No. of Screens"],...b])
  }

  useEffect(() => {
    fetch("http://localhost:8010/campaign/2023-01-10/2023-01-19")
      //fetch("https://63d2501f06556a0fdd39187f.mockapi.io/employee")   //Fetch data from FakeAPI...
      .then((response) => response.json())
      .then((data) => {
        setdata(data);
        setAllDate(data);
        setChartData(data);
      });
      
  }, []);
  const handleSelect = (date) => {
    let filtered = alldate.filter((data) => {
      let employeedate = new Date(data["creation_date"]);
      //console.log(employeedate);                    
      return (
        new Date(employeedate) >= new Date(date.selection.startDate) &&
        new Date(employeedate) <= new Date(date.selection.endDate).setSeconds(86399)
      );
    });
    setdata(filtered);
  };

  const printTable = (id) => {
    var printWindow = window.open('','','width=800,height=500');
    printWindow.document.write('<html><head><title>Table Contents</title></head>');

    var styles = 'body{font-family:Arial;font-size:10pt}table{border:1px solid #ccc;border-collapse:collapse}table th{background-color:#f7f7f7;color:#333;font-weight:700}table td,table th{padding:5px;border:1px solid #ccc}';
    printWindow.document.write('<style type="text/css">' + styles + '</style>')
    printWindow.document.write('</head>');
    printWindow.document.write('<body>');
    var data = document.getElementById(id).innerHTML;
    printWindow.document.write(data);
    printWindow.document.write('</body>');
    printWindow.document.write('</html>');
    printWindow.print();
  }

  return (
    <>
      <Navbar setState1={setState1} state1={state1} filterFn={handleSelect} />
      <>
        <Container className="Box" maxWidth='xl'>
          <Grid container spacing={2} marginY={5}>
            <Grid item xs={12}>
              <Box>
                <TableContainer component={Paper} sx={{maxHeight: "60vh"}} id='table1'>
                  <Table stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Id</StyledTableCell>
                        <StyledTableCell align="right">VersionID</StyledTableCell>                                                 
                        <StyledTableCell align="right">CampaignName</StyledTableCell>                                                  
                        <StyledTableCell align="right">OrgID</StyledTableCell>
                        <StyledTableCell align="right">CreatedBy</StyledTableCell>                                                
                        <StyledTableCell align="right"> UpdatedBy</StyledTableCell>                                                 
                        <StyledTableCell align="right">Deleted</StyledTableCell>
                        <StyledTableCell align="right">CreationDate</StyledTableCell>                                                 
                        <StyledTableCell align="right">LastUpdate</StyledTableCell>                                                  
                      </TableRow>
                    </TableHead>
                    <TableBody className="Tb">                     
                    {data && data.map((d) => (
                          <TableRow
                            key={d.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">{d.id}</TableCell>
                                                          
                            <TableCell align="right">{d.version_id}</TableCell>
                            <TableCell align="right">{d.campaign_name}</TableCell>
                            <TableCell align="right">{d.org_id}</TableCell>
                            <TableCell align="right">{d.created_by}</TableCell>
                            <TableCell align="right">{d.updated_by}</TableCell>
                            <TableCell align="right">{d.deleted}</TableCell>
                            <TableCell align="right">{new Date(d.creation_date).toLocaleDateString()}</TableCell>                                                  
                            <TableCell align="right">{new Date(d.last_update).toLocaleDateString()}</TableCell>                                                   
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button type='button' variant="contained" onClick={() => printTable('table1')} sx={{'&:hover': { background: 'green'},float: 'right', marginBlock: '10px'}}>Print</Button>
              </Box>
            </Grid>
          </Grid>
          <h1 border="dotted"></h1>
          <Grid container marginY={10}>
            <Grid item xs={6}>
            <Chart //pieCharts
              chartType="PieChart"
              data={data1}
              options={options}
              width={"100%"}
              height={"400px"}
            />
            </Grid>
            <Grid item xs={6}>
            <Chart //lineCharts
              chartType="Line"
              width="100%"
              height="400px"
              data={data1}
              options={options}
            />           
          </Grid>  
          </Grid>   
        </Container>
      </>
    </>
  );
}
export default Data;