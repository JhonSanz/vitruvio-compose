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
import Autocomplete from '@mui/material/Autocomplete';
import ForestIcon from '@mui/icons-material/Forest';


export default function FiltersSection({
  getFilteredData,
  setFormFilter,
  formFilter,
  filteredData
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
  }, [filteredData]);

  return (
    <Box style={{ backgroundColor: "#fafafa", padding: "20px" }}>
      <Box mb={2} display="flex">
        {
          labels && <Box width="100%" p={1}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={labels}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              fullWidth
              size='small'
              renderInput={(params) => <TextField {...params} label="Label" />}
              value={formFilter["label"] || null}
              onChange={(_, value) => handleFormFilterChange({
                target: {
                  name: "label",
                  value: { name: value?.name || "" }
                }
              })}
              name="label"
            />
          </Box>
        }
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
            sx={{ paddingBottom: 2 }}
            size="small"
            id="outlined-basic"
            label="Param name"
            variant="outlined"
            type='text'
            name="param_name"
            value={formFilter["param_name"]}
            onChange={(e) => handleFormFilterChange(e)}
          />
          <TextField
            fullWidth
            size="small"
            id="outlined-basic"
            label="Param value"
            variant="outlined"
            type='text'
            name="param_value"
            value={formFilter["param_value"]}
            onChange={(e) => handleFormFilterChange(e)}
          />
        </Box>
      </Box>
      <Button
        startIcon={<ForestIcon />}
        variant="contained"
        color="primary"
        onClick={() => getFilteredData()}
      >Buscar</Button>
    </Box>
  )
}
