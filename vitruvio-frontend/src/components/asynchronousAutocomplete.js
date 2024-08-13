"use client"

import { useState, useEffect, Fragment } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';


export default function AsynchronousAutocomplete({
  item,
  formik,
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchBackend, setFetchBackend] = useState(false);

  useEffect(() => {
    if (currentText === "") {
      setOpen(false);
    }
  }, [currentText]);

  useEffect(() => {
    setOptions(item.choices);
  }, [item.choices]);

  useEffect(() => {
    async function init() {
      if (fetchBackend && currentText !== "") {
        setLoading(true)
        await item.optionsGetter(currentText);
        setLoading(false)
      }
    }
    init();
  }, [fetchBackend]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
      setFetchBackend(false);
    }
  }, [open]);

  useEffect(() => {
    if (!formik.values[item.name] && item.extraActions) item.extraActions(null);
  }, [formik.values[item.name]]);

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
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      value={formik.values[item.name]}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setFetchBackend(true);
        }
      }}
      onChange={(_, value) => {
        if (item.extraActions) item.extraActions(value);
        formik.setFieldValue(item.name, value)
      }}
      disabled={item.disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={(e) => {
            setCurrentText(e.target.value)
          }}
          id={item.name}
          name={item.name}
          label={item.alias}
          disabled={item.disabled}
          value={formik.values[item.name]}
          onBlur={formik.handleBlur}
          helperText={item.disabled ? "" : "Presione ENTER para buscar"}
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