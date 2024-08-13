import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


export default function CountrySelect({
  item,
  formik,
}) {
  return (
    <Autocomplete
      disablePortal
      options={item.choices}
      getOptionLabel={option => `${option.label} (${option.name}) +${option.phone}`}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      onChange={(_, value) => {
        formik.setFieldValue(item.name, value)
        if (item.extraState) item.extraState(value)
      }}
      onBlur={formik.handleBlur}
      disabled={item.disabled}
      value={formik.values[item.name]}
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          <img
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/${option.name.toLowerCase()}.png 2x`}
            src={`https://flagcdn.com/w20/${option.name.toLowerCase()}.png`}
            alt=""
          />
          {option.label} ({option.name}) +{option.phone}
        </Box>
      )}
      // renderOption={(props, option) => (
      //   <Box component="li" {...props}>{option.label} ({option.name}) +{option.phone}</Box>
      // )}
      renderInput={(params) => <TextField
        {...params}
        margin='dense'
        id={item.name}
        name={item.name}
        label={item.alias}
        disabled={item.disabled}
        value={formik.values[item.name]}
        onBlur={formik.handleBlur}
      />}
    />

  );
}