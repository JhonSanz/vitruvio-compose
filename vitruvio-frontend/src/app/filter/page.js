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
import FiltersSection from '@/components/prototype/filtersSection';


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
  const [filteredData, setFilteredData] = useState([]);
  const [formFilter, setFormFilter] = useState({
    label: "",
    name: "",
    code: "",
  });

  async function getFilteredData() {
    try {
      const result = await fetchBackend("/graph/filter-nodes", "GET", {}, formFilter, "http://localhost:8000");
      setFilteredData(result);
    } catch (error) {
      console.error('Error fetching root nodes:', error);
    }
  }

  return (
    <Box p={5}>
      <Box mt={4}>
        <FiltersSection
          getFilteredData={getFilteredData}
          setFormFilter={setFormFilter}
          formFilter={formFilter}
        />
        <DenseTable data={filteredData} />
      </Box>
    </Box>
  )
}