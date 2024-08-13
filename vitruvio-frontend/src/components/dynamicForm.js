import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dynamic from 'next/dynamic';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';


// import FormControlLabel from '@mui/material/FormControlLabel';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
// import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
// import Slider from '@mui/material/Slider';
// import AsynchronousAutocomplete from './asynchronousAutocomplete';
// import MaxHeightTextarea from './textArea';


const FormControlLabel = dynamic(() => import('@mui/material/FormControlLabel'), { ssr: false });
const TextField = dynamic(() => import('@mui/material/TextField'), { ssr: false });
const Autocomplete = dynamic(() => import('@mui/material/Autocomplete'), { ssr: false });
const MobileDateTimePicker = dynamic(() => import('@mui/x-date-pickers/MobileDateTimePicker').then(mod => mod.MobileDateTimePicker), { ssr: false });
const DatePicker = dynamic(() => import('@mui/x-date-pickers/DatePicker').then(mod => mod.DatePicker), { ssr: false });
const DateTimePicker = dynamic(() => import('@mui/x-date-pickers/DateTimePicker').then(mod => mod.DateTimePicker), { ssr: false });
const MobileDatePicker = dynamic(() => import('@mui/x-date-pickers/MobileDatePicker').then(mod => mod.MobileDatePicker), { ssr: false });
const StaticDateTimePicker = dynamic(() => import('@mui/x-date-pickers/StaticDateTimePicker').then(mod => mod.StaticDateTimePicker), { ssr: false });
const Slider = dynamic(() => import('@mui/material/Slider'), { ssr: false });
const AsynchronousAutocomplete = dynamic(() => import('./asynchronousAutocomplete'), { ssr: false });
const MaxHeightTextarea = dynamic(() => import('./textArea'), { ssr: false });
const CountrySelect = dynamic(() => import('./countrySelect'), { ssr: false });



const CustomSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: 3,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&::before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
  },
}));


const DynamicForm = forwardRef(function DynamicForm({
  fields,
  submitFunction,
  setIsSubmitting = () => { },
  width,
  triggerSubmit
}, ref) {
  const refPlanAutoSchedule = useRef(null);
  const refMediaUpload = useRef(null);
  const refGenericFile = useRef(null);
  const refColumnsMatchSelector = useRef(null);

  function generateInitial(field) {
    const result = [];
    for (const val of fields) {
      if (["planAutoSchedule", "fileUpload"].includes(val.type)) continue;
      if (val.type === "passwordPicker") {
        if (field === "default") {
          result.push(["password", ""])
          result.push(["passwordConfirmation", ""])
        }
        if (field === "validators") {
          result.push(["password", Yup.string()
            .required('Password is required')
            .min(8, 'Your password is too short.')
            .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
          ])
          result.push(["passwordConfirmation", Yup.string()
            .required('Password confirmation is required')
            .oneOf([Yup.ref('password')], 'Passwords must match')
          ])
        }
      } else if (val.type === "daterange") {
        result.push([
          `${val.name}-start`,
          field === "default" ? val[field][0] : val[field]
        ])
        result.push([
          `${val.name}-end`,
          field === "default" ? val[field][1] : val[field]
        ])
      } else {
        result.push([val.name, val[field]])
      }
    }
    return result;
  }

  const validationSchema = Yup.object({
    ...Object.fromEntries(generateInitial("validators"))
  })
  const initialValues = Object.fromEntries(generateInitial("default"))

  async function valuesAfterUploadFile(values) {
    if (refMediaUpload && refMediaUpload.current) {
      const result = await refMediaUpload.current.handleUploadFile();
      values[result.fieldName] = result;
    }
    return values;
  }

  async function valuesGenericFile(values) {
    if (refGenericFile && refGenericFile.current) {
      const file = await refGenericFile.current.handleUploadFile();
      values["file"] = file;
    }
    return values;
  }

  function valuesPlanAutoSchedule(values) {
    if (refPlanAutoSchedule && refPlanAutoSchedule.current) {
      const subFormValues = refPlanAutoSchedule.current.getDynamicPlanValues();
      values["autoScheduled"] = subFormValues["autoschedule"];
      values["numClasses"] = subFormValues["numClasses"];
      values["expirationDays"] = subFormValues["expirationDays"];
      values["planType"] = subFormValues["planType"];
      delete subFormValues["numClasses"];
      delete subFormValues["expirationDays"];
      values["availability"] = JSON.stringify(subFormValues);
      values["validForm"] = subFormValues["validForm"];
    }
    return values;
  }

  function valuesColumnsMatchSelector(values) {
    if (refColumnsMatchSelector && refColumnsMatchSelector.current) {
      const subFormValues = refColumnsMatchSelector.current.getColumnsMatchSelector();
      values[subFormValues.fieldName] = subFormValues["data"];
      values["ok"] = subFormValues["ok"];
    }
    return values;
  }

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      values = valuesPlanAutoSchedule(values);
      values = valuesColumnsMatchSelector(values);
      values = await valuesAfterUploadFile(values);
      values = await valuesGenericFile(values);
      submitFunction(values);
      setIsSubmitting(false);
    },
  });

  useImperativeHandle(ref, () => {
    return {
      submit() {
        formik.handleSubmit();
      },
      isValid() {
        return formik.isValid;
      },
      resetForm() {
        formik.resetForm()
      },
      getFormValues() {
        return formik.values
      }
    };
  }, [formik.values]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && triggerSubmit) {
      triggerSubmit();

    }
  };

  return (
    <Grid container sx={{ width: "100%" }}>
      {
        fields.map((item) => {
          return (
            <Grid item xs={12} md={item.md || 12} key={item.name} justifyContent="center">
              {
                item.type === "choices" && item.choices && (
                  <Autocomplete
                    disablePortal
                    options={item.choices}
                    getOptionLabel={option => option.name}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    onChange={(_, value) => {
                      formik.setFieldValue(item.name, value)
                      if (item.extraState) item.extraState(value)
                    }}
                    onBlur={formik.handleBlur}
                    disabled={item.disabled}
                    value={formik.values[item.name]}
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
                )
              }
              {
                item.type === "asyncChoices" && (
                  <AsynchronousAutocomplete
                    item={item}
                    formik={formik}
                  />
                )
              }
              {
                item.type === "multiple" && (
                  <Autocomplete
                    required
                    disablePortal
                    options={item.multiple}
                    getOptionLabel={option => option.name}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    onChange={(_, value) => formik.setFieldValue(item.name, value)}
                    onBlur={formik.handleBlur}
                    multiple
                    disabled={item.disabled}
                    value={formik.values[item.name]}
                    renderInput={(params) => <TextField
                      required
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
                )
              }
              {
                item.type === "boolean" && (
                  <FormControlLabel
                    value="start"
                    control={<Switch
                      name={item.name}
                      id={item.name}
                      type="checkbox"
                      onChange={formik.handleChange}
                      value={formik.values[item.name]}
                      checked={formik.values[item.name]}
                      disabled={item.disabled}
                    />}
                    label={item.alias}
                    labelPlacement="start"
                  />
                )
              }
              {
                item.type === "datetime" && (
                  <Box style={{ marginTop: "8px", marginBottom: "4px" }}>
                    <MobileDateTimePicker
                      sx={{ width: "100%" }}
                      label={item.alias}
                      name={item.name}
                      id={item.name}
                      onChange={(newValue) => formik.setFieldValue(item.name, newValue)}
                      value={formik.values[item.name]}
                      views={['year', 'month', 'day', 'hours']}
                      maxDate={item.maxDate || null}
                      minDate={item.minDate || null}
                    />
                  </Box>
                )
              }
              {
                item.type === "staticdatetimepicker" && (
                  <Box style={{ display: "flex", justifyContent: "center" }}>
                    <StaticDateTimePicker
                      disabled={item.disabled}
                      label={item.alias}
                      name={item.name}
                      id={item.name}
                      onChange={(newValue) => formik.setFieldValue(item.name, newValue)}
                      onMonthChange={(newValue) => {
                        if (item.extraState) item.extraState(newValue)
                      }}
                      value={formik.values[item.name]}
                      views={['year', 'month', 'day', 'hours']}
                      maxDate={item.maxDate || null}
                      minDate={item.minDate || null}
                      slotProps={{ actionBar: { actions: [] } }}
                    />
                  </Box>
                )
              }
              {
                item.type === "daterange" && (
                  <Box display="flex" justifyContent="space-between" style={{ marginTop: "8px", marginBottom: "4px" }}>
                    <MobileDatePicker
                      label={`${item.alias}-start`}
                      name={`${item.name}-start`}
                      id={`${item.name}-start`}
                      onChange={(newValue) => formik.setFieldValue(`${item.name}-start`, newValue)}
                      value={formik.values[`${item.name}-start`]}
                      sx={{ width: "90%" }}
                    />
                    <p style={{ marginLeft: "5px", marginRight: "5px" }}>-</p>
                    <MobileDatePicker
                      label={`${item.alias}-end`}
                      name={`${item.name}-end`}
                      id={`${item.name}-end`}
                      onChange={(newValue) => formik.setFieldValue(`${item.name}-end`, newValue)}
                      value={formik.values[`${item.name}-end`]}
                      sx={{ width: "90%" }}
                    />
                  </Box>
                )
              }
              {
                item.type === "basicDatetime" && (
                  <Box>
                    <DateTimePicker
                      sx={{ width: "100%" }}
                      label={item.alias}
                      name={item.name}
                      value={formik.values[item.name]}
                      onChange={(newValue) => formik.setFieldValue(item.name, newValue)}
                    />
                  </Box>
                )
              }
              {
                item.type === "basicDate" && (
                  <Box>
                    <DatePicker
                      sx={{ width: "100%" }}
                      label={item.alias}
                      name={item.name}
                      value={formik.values[item.name]}
                      views={item.views}
                      onChange={(value) => formik.setFieldValue(item.name, value)}
                    />
                  </Box>
                )
              }
              {
                item.type === "range" && (
                  <Box>
                    <Typography id="input-slider" gutterBottom>
                      {item.alias}
                    </Typography>
                    <CustomSlider
                      getAriaLabel={() => item.alias}
                      name={item.name}
                      value={formik.values[item.name]}
                      onChange={formik.handleChange}
                      valueLabelDisplay="on"
                      max={item.max}
                      aria-labelledby="input-slider"
                      step={item.step}
                    />
                  </Box>
                )
              }
              {
                item.type === "textArea" && (
                  <MaxHeightTextarea
                    required
                    label={item.alias}
                    name={item.name}
                    id={item.name}
                    placeholder={item.alias}
                    onChange={formik.handleChange}
                    value={formik.values[item.name]}
                  />
                )
              }
              {
                item.type === "countryPicker" && (
                  <CountrySelect
                    item={item}
                    formik={formik}
                  />
                )
              }
              {
                ![
                  "choices", "asyncChoices", "boolean", "date",
                  "multiple", "datetime", "range", "daterange",
                  "basicDatetime", "basicDate", "planAutoSchedule",
                  "fileUpload", "textArea", "staticdatetimepicker",
                  "passwordPicker", "genericfilepicker", "columnsMatchSelector", "countryPicker"
                ].includes(item.type) && (
                  <TextField
                    margin='dense'
                    required={item.required === undefined ? true : item.required}
                    label={item.alias}
                    type={item.type}
                    name={item.name}
                    id={item.name}
                    placeholder={item.name}
                    onChange={formik.handleChange}
                    value={formik.values[item.name]}
                    fullWidth
                    disabled={item.disabled}
                    error={formik.touched[item.name] && formik.errors[item.name] !== undefined}
                    helperText={formik.errors[item.name]}
                    onKeyDown={handleKeyDown}
                    size='small'
                  />
                )
              }
            </Grid >
          )
        })
      }
    </Grid>
  );
});

export default DynamicForm;