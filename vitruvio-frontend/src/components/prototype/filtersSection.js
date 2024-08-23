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


export default function FiltersSection({
    getFilteredData,
    setFormFilter,
    formFilter
  }) {
    const [labels, setLabels] = useState([]);
  
    function handleFormFilterChange(e) {
      const copiedForm = { ...formFilter };
      copiedForm[e.target.name] = e.target.value;
      setFormFilter(copiedForm);
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
        <Button variant="contained" color="primary" onClick={() => getFilteredData()}>Buscar</Button>
      </Box>
    )
  }
  