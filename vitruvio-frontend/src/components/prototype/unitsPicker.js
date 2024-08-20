"use client";

import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import fetchBackend from "@/utils/commonFetch";


function UnitsSystem({
  setSelectedUnit,
  selectedUnit,
  handleFormChange,
  formValues
}) {
  const [unitTypes, setUnitTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(undefined);
  const [availableUnits, setAvailableUnits] = useState([]);

  async function getUnits() {
    try {
      const result = await fetchBackend(`/units/unit_by_type/${selectedType.id}`, "GET", {}, {}, "http://localhost:8001");
      return result
    } catch (error) {
      console.error('Error fetching root nodes:', error);
    }
  }

  async function getUnitTypes() {
    try {
      const result = await fetchBackend("/unit_type", "GET", {}, { filter_by: true }, "http://localhost:8001");
      return result
    } catch (error) {
      console.error('Error fetching root nodes:', error);
    }
  }

  useEffect(() => {
    async function init() {
      const unit_types = await getUnitTypes();
      if (unit_types) setUnitTypes(unit_types);
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      if (selectedType) {
        const units = await getUnits();
        if (units) setAvailableUnits(units);
      }
    }
    init();
  }, [selectedType]);

  return (
    <Box>
      <Box display="flex" marginBottom={5}>
        <Box width="100%">
          <h3>Tipos</h3>
          <List style={{ border: "1px dotted gray", marginRight: "30px" }}>
            {
              unitTypes.map(item => (
                <ListItem disablePadding key={item.name}>
                  <ListItemButton selected={selectedType?.name === item.name} onClick={() => setSelectedType(item)}>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              ))
            }
          </List>
        </Box>
        <Box width="100%">
          <h3>Unidades</h3>
          <List style={{ border: "1px dotted gray", marginRight: "30px" }}>
            {
              availableUnits.map(item => (
                <ListItem disablePadding key={item.name}>
                  <ListItemButton selected={selectedUnit?.name === item.name} onClick={() => setSelectedUnit(item)}>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              ))
            }
          </List>
        </Box>
      </Box>
      <Box display="flex" alignItems="center">
        <Box mr={1}>
          <TextField
            size="small"
            id="outlined-basic"
            label="Value"
            variant="outlined"
            type='number'
            name="value"
            value={formValues["value"]}
            onChange={(e) => handleFormChange(e)}
          />
        </Box>
        <Box>{selectedUnit?.symbol}</Box>
      </Box>
    </Box>
  )
}

function Scales({
  selectedScale,
  setSelectedScale,
}) {
  const [unitTypes, setUnitTypes] = useState([]);
  const [availableScales, setAvailableScales] = useState([]);
  const [selectedType, setSelectedType] = useState(undefined);

  async function getUnitTypes() {
    try {
      const result = await fetchBackend("/unit_type", "GET", {}, { filter_by: false }, "http://localhost:8001");
      return result
    } catch (error) {
      console.error('Error fetching root nodes:', error);
    }
  }

  async function getScales() {
    try {
      const result = await fetchBackend(`/scale/scale_by_type/${selectedType.id}`, "GET", {}, {}, "http://localhost:8001");
      return result
    } catch (error) {
      console.error('Error fetching root nodes:', error);
    }
  }

  useEffect(() => {
    async function init() {
      const unit_types = await getUnitTypes();
      if (unit_types) setUnitTypes(unit_types);
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      if (selectedType) {
        const scales = await getScales();
        if (scales) setAvailableScales(scales);
      }
    }
    init();
  }, [selectedType]);

  return (
    <Box>
      <Box display="flex" marginBottom={5}>
        <Box width="100%">
          <h3>Tipos</h3>
          <List style={{ border: "1px dotted gray", marginRight: "30px" }}>
            {
              unitTypes.map(item => (
                <ListItem disablePadding key={item.name}>
                  <ListItemButton selected={selectedType?.name === item.name} onClick={() => setSelectedType(item)}>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              ))
            }
          </List>
        </Box>
        <Box width="100%">
          <h3>Escalas</h3>
          <List style={{ border: "1px dotted gray", marginRight: "30px" }}>
            {
              availableScales.map(item => (
                <ListItem disablePadding key={item.value}>
                  <ListItemButton selected={selectedScale?.value === item.value} onClick={() => setSelectedScale(item)}>
                    <ListItemText primary={item.value} />
                  </ListItemButton>
                </ListItem>
              ))
            }
          </List>
        </Box>
      </Box>
    </Box>
  )
}

function NoUnits({
  formValues,
  handleFormChange
}) {
  return (
    <Box mt={3}>
      <TextField
        size="small"
        id="outlined-basic"
        label="Value"
        variant="outlined"
        type='number'
        name="value"
        value={formValues["value"]}
        onChange={(e) => handleFormChange(e)}
      />
    </Box>
  )
}

function UnitsPicker({ handleAddNewItem }) {
  const [selectedUnit, setSelectedUnit] = useState(undefined);
  const [selectedScale, setSelectedScale] = useState(undefined);
  const [formValues, setFormValues] = useState({
    name: "",
    value: 0
  });
  const [itemType, setItemType] = useState("uis");

  function handleFormChange(e) {
    const copiedForm = { ...formValues };
    copiedForm[e.target.name] = e.target.value;
    setFormValues(copiedForm);
  }

  function handleSubmit() {
    if (itemType === "uis") {
      if (formValues.name !== "" && selectedUnit !== undefined) handleAddNewItem({
        ...formValues, value: `${formValues.value}${selectedUnit.symbol}`
      });
    } else if (itemType === "scales") {
      if (formValues.name !== "" && selectedScale !== undefined) handleAddNewItem({
        name: formValues.name, value: selectedScale.value
      });
    } else if (itemType === "no_unit") {
      if (formValues.name !== "") handleAddNewItem({
        name: formValues.name, value: formValues.value
      });
    }
  }

  return (
    <Box>
      <Box display="flex" mr={1}>
        <TextField
          fullWidth
          size="small"
          id="outlined-basic"
          label="Name"
          variant="outlined"
          name="name"
          value={formValues["name"]}
          onChange={(e) => handleFormChange(e)}
          required
        />
        <FormControl size='small' fullWidth>
          <InputLabel id="demo-simple-select-label">Mode</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={itemType}
            label="itemType"
            onChange={(e) => setItemType(e.target.value)}
          >
            <MenuItem value={"uis"}>Sistema de unidades</MenuItem>
            <MenuItem value={"scales"}>Escalas</MenuItem>
            <MenuItem value={"no_unit"}>Sin unidades</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box>
        {
          itemType === "uis" && <UnitsSystem
            setSelectedUnit={setSelectedUnit}
            selectedUnit={selectedUnit}
            handleFormChange={handleFormChange}
            formValues={formValues}
          />
        }
        {
          itemType === "scales" && <Scales
            selectedScale={selectedScale}
            setSelectedScale={setSelectedScale}
          />
        }
        {
          itemType === "no_unit" && <NoUnits
            handleFormChange={handleFormChange}
            formValues={formValues}
          />
        }
      </Box>

      <Box mt={2}>
        <Button color="primary" size='small' variant="contained" onClick={() => handleSubmit()}>Ok</Button>
      </Box>
    </Box>
  )
}


export default UnitsPicker;