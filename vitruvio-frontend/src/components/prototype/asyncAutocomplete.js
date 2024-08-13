"use client"

import { useState, useEffect, Fragment } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import fetchBackend from "@/utils/commonFetch";


export default function AsyncAutocomplete({ value, setValue }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [doFetchBackend, setDoFetchBackend] = useState(false);

  useEffect(() => {
    if (currentText === "") {
      setOpen(false);
    }
  }, [currentText]);

  useEffect(() => {
    async function init() {
      if (doFetchBackend && currentText !== "") {
        setLoading(true)
        const data = await fetchBackend("/item/by_code", "GET", {}, { item_label: currentText, item_id: currentText });
        setOptions(data);
        setLoading(false)
      }
    }
    init();
  }, [doFetchBackend]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
      setDoFetchBackend(false);
    }
  }, [open]);

  return (
    <Autocomplete
      sx={{ marginBottom: "15px" }}
      id="asynchronous-demo"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option?.properties?.code === value?.properties?.code}
      getOptionLabel={(option) => option.properties ? `${option?.properties?.code} ${option?.properties?.name}` : ""}
      options={options}
      loading={loading}
      value={value}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setDoFetchBackend(true);
        }
      }}
      onChange={(_, value) => setValue(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={(e) => {
            setCurrentText(e.target.value)
          }}
          name="nodeRelated"
          label="Relacion"
          value={value}
          helperText="Presione ENTER para buscar"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
}