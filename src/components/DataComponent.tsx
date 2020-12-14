import React, { useState, useEffect } from "react";
import axios from "axios";

interface ValidationsList {
  expectation_suite_name: string;
  run_name: string;
  run_time: string;
  batch_identifier: string;
  value: string;
}

function ValidationsListShow() {
  const [validations, setValidations] = useState<ValidationsList[]>([]);
  const [isLoading, setLoading] = useState(false)
  const [isError, setError] = useState(false)
  const [data, setData] = useState({});
 
  useEffect(() => {
    const fetchData = async () => {
      setError(false);
      setLoading(true);
  
      try {
        const response = await axios('https://adapdqweb.azurewebsites.net/validations/last');
        setValidations(response.data);
        setData(response.data);
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    };
    fetchData()
  }, []);

  function TimestampToTime(timestamp: string) {
    const selectedPlacement = "$1-$2-$3T$4:$5:$6";
    const convertedTimestamp = timestamp.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(\.\d{6}Z)$/, selectedPlacement);
    return new Date(convertedTimestamp);
  }

  function getExpectationName(valueJson: string){
    const values = JSON.parse(valueJson);
    return values["results"][0]["expectation_config"]["expectation_type"]
  }

  return (
      <div>
        <h1>Validations List</h1>
        {isError && <div> Error occured </div>}
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <pre>{JSON.stringify(data, null, 2)}
          </pre>
        )}
      <ul>
        {validations.map((validation) => (
          <div key={validation.run_time}>
            <li>{validation.expectation_suite_name}</li>
            <li>{TimestampToTime(validation.run_time).toDateString()}</li>
            <li>{validation.value}</li>
            <li>{getExpectationName(validation.value)}</li>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default ValidationsListShow;