"use client";

import { forwardRef, useImperativeHandle, useRef, useContext } from 'react';
import { useState, useEffect } from 'react';
import { ThemeContext } from '@/components/providers';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import fetchBackend from "@/utils/commonFetch";
import AsyncAutocomplete from '@/components/prototype/asyncAutocomplete';
import Button from '@mui/material/Button';
import UnitsPicker from '@/components/prototype/unitsPicker';


function ParamsPicker({
  size = "medium",
  paramsForm,
  setParamsForm,
}) {
  const { setAlertContent, setIsAlertOpened } = useContext(ThemeContext);

  function removeNewProp() {
    const copied = [...paramsForm];
    copied.splice(-1, 1)
    setParamsForm(copied)
  }

  function handleAddNewItem(newItem) {
    setParamsForm([...paramsForm, newItem])
    setIsAlertOpened(false);
  }

  function showUnitsPicker() {
    setAlertContent(<UnitsPicker handleAddNewItem={handleAddNewItem} />)
  }

  return (
    <Box style={{ padding: "20px", border: "1px dotted gray" }}>
      {
        paramsForm.length > 0 && (
          <Box style={{ display: "flex", marginBottom: "15px", borderBottom: "1px solid #bfbfbf", paddingBottom: "13px" }}>
            <Box width="100%">Detail</Box>
            <Box width="100%">Value</Box>
          </Box>
        )
      }
      {
        paramsForm.map((item, index) => (
          <Box key={`${item.name}${index}`} style={{ display: "flex", marginBottom: "15px", borderBottom: "1px solid #e3e3e3", paddingBottom: "13px" }}>
            <Box width="100%">{item.name}</Box>
            <Box width="100%">{item.value}</Box>
          </Box>
        ))
      }
      <Button color="secondary" size='small' variant="contained" onClick={() => showUnitsPicker()}>Add</Button>
      {paramsForm.length >= 1 && <Button color="secondary" size='small' variant="contained" onClick={() => removeNewProp()}>Remove</Button>}
    </Box>
  )
}

const Mercar = forwardRef(function Mercar({ }, ref) {
  const [purchase, setPurchase] = useState([
    {
      related: {},
      params: []
    }
  ]);

  useImperativeHandle(ref, () => {
    return {
      getPurchases() {
        return purchase;
      }
    };
  }, [purchase]);

  function handleChangeAutocomplete(newValue, index) {
    const copiedData = [...purchase];
    const copiedItem = { ...copiedData[index] };
    copiedItem.related = newValue;
    copiedData.splice(index, 1, copiedItem);
    setPurchase(copiedData)
  }

  function updatePurchase(newValue, index) {
    const copiedData = [...purchase];
    const copiedItem = { ...copiedData[index] };
    copiedItem.params = newValue;
    copiedData.splice(index, 1, copiedItem);
    setPurchase(copiedData)
  }

  function addRelation() {
    setPurchase([
      ...purchase, {
        related: {},
        params: []
      }
    ])
  }

  function removeRelation() {
    const copied = [...purchase];
    copied.splice(-1, 1)
    setPurchase(copied)
  }

  return (
    <Box>
      <Box sx={{ padding: "25px", backgroundColor: "#fafafa" }}>
        {
          purchase.map((item, index) => (
            <Box key={`${item}${index}`}>
              <Box display="flex" mb={3}>
                <Box style={{ padding: 10, width: "100%" }}>
                  <AsyncAutocomplete
                    value={item.related}
                    setValue={(newValue) => handleChangeAutocomplete(newValue, index)}
                  />
                  <Box>
                    {item?.related && item?.related?.properties && Object.entries(item?.related.properties).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}</strong>: <span>{value}</span>
                      </div>
                    ))}
                  </Box>
                </Box>
                <Box style={{ padding: 10, width: "100%" }}>
                  <h4>Bind details</h4>
                  <ParamsPicker
                    size="small"
                    initialLabel="Relation"
                    paramsForm={item.params}
                    setParamsForm={(updatedValue) => updatePurchase(updatedValue, index)}
                  />
                </Box>
              </Box>
              <hr />
            </Box>
          ))
        }
      </Box>
      <Box display="flex">
        <Button color="secondary" size='small' variant="contained" onClick={() => addRelation()}>Add</Button>
        {purchase.length > 1 && <Button color="secondary" size='small' variant="contained" onClick={() => removeRelation()}>Remove</Button>}
      </Box>
    </Box>
  )
})
export { Mercar };

export default function Prototype() {
  const mercarRef = useRef(null);
  const [disabledButton, setDisabledButton] = useState(false);
  const [itemType, setItemType] = useState("fundamental");
  const [formInsumo, setFormInsumo] = useState({
    name: "",
    // code: "",
    type: "",
  });

  const handleChange = (event) => {
    setItemType(event.target.value);
  };

  function handleChangeInsumoForm(e) {
    const copiedFormInsumo = { ...formInsumo };
    copiedFormInsumo[e.target.name] = e.target.value;
    setFormInsumo(copiedFormInsumo);
  }

  const [paramsForm, setParamsForm] = useState([]);

  async function handleSubmitFullForm() {
    setDisabledButton(true);
    const finalBody = {
      ...formInsumo,
      type: formInsumo["type"].split(","),
      nodeParams: [...paramsForm, { name: "itemType", value: itemType }],
      nodeRelations: []
    }
    switch (itemType) {
      case "shopping":
        let dataPurchases = mercarRef.current.getPurchases();
        dataPurchases = dataPurchases.map((item) => {
          if (item.related.properties.code) {
            return {
              related: item.related.properties.code,
              params: item.params
            }
          }
        })
        finalBody["nodeRelations"] = dataPurchases;
        break;
      default:
        break;
    }

    const result = await fetchBackend("/graph/insumo/", "POST", finalBody)
    if (result.ok === false) {
      alert(result.data);
      setDisabledButton(false);
      return;
    }
    setDisabledButton(false);
    window.location.reload()
  }

  return (
    <Box
      sx={{ padding: "50px", border: "1px dotted black", borderRadius: "5px" }}
    >
      <h2>CREACION DE INSUMOS</h2>
      <Box mb={2}>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Name"
          name="name"
          variant="outlined"
          value={formInsumo["name"]}
          onChange={handleChangeInsumoForm}
        />
      </Box>
      <Box mb={2}>
        <h4>Details</h4>
        <ParamsPicker
          initialLabel="Param"
          paramsForm={paramsForm}
          setParamsForm={setParamsForm}
        />
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Label"
          name="type"
          variant="outlined"
          value={formInsumo["type"]}
          onChange={handleChangeInsumoForm}
        />
      </Box>
      {/* <Box mb={2}>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Code"
          name="code"
          variant="outlined"
          value={formInsumo["code"]}
          onChange={handleChangeInsumoForm}
        />
      </Box> */}
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Mode</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={itemType}
          label="itemType"
          onChange={handleChange}
        >
          <MenuItem value={"fundamental"}>Supply</MenuItem>
          <MenuItem value={"shopping"}>Mercar</MenuItem>
          {/* <MenuItem value={"int_std"}>Estándar internacional</MenuItem>
          <MenuItem value={"formula_optional"}>Fórmula a veces</MenuItem>
          <MenuItem value={"formula_mandatory"}>Fórmula</MenuItem> */}
          {/* // grilla */}
          {/* sinonimos */}
          {/* <MenuItem value={"homologacion"}>Homologacion</MenuItem> */}
        </Select>
      </FormControl>
      {
        itemType === "shopping" && <Mercar ref={mercarRef} />
      }
      <Box pt={5}>
        <Button color="primary" variant="contained" disabled={disabledButton} onClick={() => handleSubmitFullForm()}>Save</Button>
      </Box>
    </Box>
  )
}