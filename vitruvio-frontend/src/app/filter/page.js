"use client"

import { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import fetchBackend from "@/utils/commonFetch";
import Button from '@mui/material/Button';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



function DenseTable({ data }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell><b>label</b></TableCell>
            <TableCell><b>name</b></TableCell>
            <TableCell><b>code</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.properties.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{row.labels[0]}</TableCell>
              <TableCell>{row.properties.name}</TableCell>
              <TableCell>{row.properties.code}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


export default function Filter() {
  const [labels, setLabels] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [formFilter, setFormFilter] = useState({
    label: "",
    name: "",
    code: "",
  });

  function handleFormFilterChange(e) {
    const copiedForm = { ...formFilter };
    copiedForm[e.target.name] = e.target.value;
    setFormFilter(copiedForm);
  }

  async function getFilteredData() {
    try {
      const result = await fetchBackend("/graph/filter-nodes", "GET", {}, formFilter, "http://localhost:8000");
      setFilteredData(result);
    } catch (error) {
      console.error('Error fetching root nodes:', error);
    }
  }

  async function getLabels() {
    try {
      const result = await fetchBackend("/entity", "GET", {}, {}, "http://localhost:8000");
      return result
    } catch (error) {
      console.error('Error fetching root nodes:', error);
    }
  }

  useEffect(() => {
    async function init() {
      const unit_types = await getLabels();
      setLabels(unit_types);
    }
    init();
  }, []);

  return (
    <Box p={5}>
      <Box mb={2} display="flex">
        <Box width="100%" p={1}>
          <FormControl size='small' fullWidth>
            <InputLabel id="demo-simple-select-label">Label</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formFilter["label"]}
              name="label"
              label="itemType"
              onChange={(e) => handleFormFilterChange(e)}
            >
              <MenuItem value={""}>Cualquiera</MenuItem>
              {
                labels.map((item) => (
                  <MenuItem value={item.name} key={item.name}>{item.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Box>
        <Box width="100%" p={1}>
          <TextField
            fullWidth
            size="small"
            id="outlined-basic"
            label="Name"
            variant="outlined"
            type='text'
            name="name"
            value={formFilter["name"]}
            onChange={(e) => handleFormFilterChange(e)}
          />
        </Box>
        <Box width="100%" p={1}>
          <TextField
            fullWidth
            size="small"
            id="outlined-basic"
            label="Code"
            variant="outlined"
            type='text'
            name="code"
            value={formFilter["code"]}
            onChange={(e) => handleFormFilterChange(e)}
          />
        </Box>
      </Box>
      <Button variant="contained" color="primary" onClick={() => getFilteredData()}>Buscar</Button>
      <Box mt={4}>
        <DenseTable data={filteredData} />
      </Box>
    </Box>
  )
}