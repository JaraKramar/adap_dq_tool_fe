import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import { useQuery } from "react-query";
import axios from "axios";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

interface ValidationRun {
  expectation_suite_name: string;
  run_name: string;
  run_time: string;
  batch_identifier: string;
  value: string;
}

// const test : Pick<RowData, 'result'>['result'] = {
//   name:'sd', str: 'dsa'
// }

interface RowData {
  // 'meta' 'validation_time'
  meta: string;
  // "results": [{"exception_info": {"exception_message": null,
  //            "expectation_config": {"expectation_type": "expect_table_row_count_to_be_between", //--nazev
  expectation_type: string;
  //            "kwargs": {"min_value": 1000, // -- zobrazit cele 2-3 radky -- radeji popup -- copy button
  kwargs: string;
  //            "meta": {"SEVERITY":"A dalsi data"}}, ///--- zatim dat jako warning
  //            "success": true}, // --- podle meta severity viz vis
  success: boolean;
  //            "partial_unexpected_list": [], //--- zatim na klik rozbalit i zabalit
  //            "result": {"element_count": 332685, //--- jen u spadlych kontrol rozbalovaci -- copy button
  result: JSON;
  // statistics: object
}

function GetValidations() {
  /* const { isLoading, error, data } = useQuery("repoData", () =>
    fetch("https://adapdqweb.azurewebsites.net/validations/last").then((res) =>
      res.json()
    )
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: ";
 */
  const data = axios("https://adapdqweb.azurewebsites.net/validations/last");
  return data;
}

function Row(props: { row: RowData }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.expectation_type}
        </TableCell>
        <TableCell align="right">{row.kwargs}</TableCell>
        <TableCell align="right" color="error">
          {row.success ? "success" : "failed"}
        </TableCell>
        <TableCell align="right">{row.meta}</TableCell>
        <TableCell align="right">{JSON.stringify(row.result).substring(0,40)}</TableCell>
        <TableCell align="right">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              alert("Comming soon");
            }}
          >
            Mute
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Result
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                  {
                    Object.keys(row.result).map((key) =>
                        // if isinstance(row.result[key], dict)== False:
                        <TableCell>{key}</TableCell>
                      )
                  }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {row.result.map((resultRow: any) => (
                    <TableRow key={resultRow}>
                      <TableCell component="th" scope="row">
                        {resultRow}
                      </TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
export default function CollapsibleTable() {
  const [validations, setValidations] = useState<ValidationRun[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [data, setData] = useState({});

  function TimestampToISO(timestamp: string): string {
    console.log("timestamp", timestamp);
    //const selectedPlacement = "$1-$2-$3T$4:$5:$6";
    const selectedPlacement = "$1 $2 $3";
    const convertedTimestamp = timestamp.replace(
      /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(\.\d{6}Z)$/,
      selectedPlacement
    );
    return convertedTimestamp;
  }

  function ValidationRunFromResponse(resp: ValidationRun): RowData[] {
    // 'meta' 'validation_time'
    const metaTimestamp = TimestampToISO(resp.run_time);
    const value = JSON.parse(resp.value);
    let rows: RowData[] = [];

    console.log("---RESULT", value["results"][0]["partial_unexpected_count"]);

    rows = value["results"].map((expectation: any) => {
      return {
        meta: metaTimestamp,
        expectation_type: expectation["expectation_config"]["expectation_type"],
        kwargs: JSON.stringify(expectation.expectation_config.kwargs).substring(0,49),
        success: expectation["success"],
        result: expectation["result"],
      };
    });
    return rows;
  }

  useEffect(() => {
    const fetchData = async () => {
      setError(false);
      setLoading(true);

      try {
        const response = await axios(
          "https://adapdqweb.azurewebsites.net/validations/last"
        );
        setValidations(response.data);
        setData(response.data);
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  /*  let validation = GetValidations();
  console.log("Validation value ------", validation[0])
  let parsedValidation = ValidationRunFromResponse(validation[0]);
  console.log("Validation value ------", validation)
  let rows: RowData[] = parsedValidation; */

  return (
    <div>
      <h1>TickerInfo Validation</h1>
      {isError && <div> Error occured </div>}
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {validations.map((validation) => (
            <TableContainer component={Paper}>
              <Table aria-label="TickerInfo">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>
                      expectation_type suite-{validation.expectation_suite_name}
                    </TableCell>
                    <TableCell align="left">kwargs</TableCell>
                    <TableCell align="right">success</TableCell>
                    <TableCell align="right">meta</TableCell>
                    <TableCell align="right">result</TableCell>
                    <TableCell align="right">Mute</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {console.log("VALIDATION====", validation)}
                  {ValidationRunFromResponse(validation).map((row) => (
                    <Row key={row.expectation_type} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ))}
        </ul>
      )}
    </div>
  );
}
