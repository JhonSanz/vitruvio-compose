"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';


export default function VerticalLinearStepper({ activeStep, setActiveStep, steps, submitGraph }) {
  return (
    <Box sx={{ maxWidth: 200, borderRight: "1px solid #d9d9d9" }}>
      <Stepper activeStep={activeStep === undefined ? steps.length : steps.findIndex(item => item.label === activeStep.label)} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(steps[index + 1])}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'End' : 'Next'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={() => setActiveStep(index === 0 ? 0 : steps[index - 1])}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === undefined && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>Save?</Typography>
          <Button
            onClick={() => setActiveStep(steps[steps.length - 2])}
            sx={{ mt: 1, mr: 1 }}
          >
            Back
          </Button>
          <Button onClick={() => submitGraph()} variant="contained" color='success' sx={{ mt: 1, mr: 1 }}>
            Save
          </Button>
        </Paper>
      )}
    </Box>
  );
}
