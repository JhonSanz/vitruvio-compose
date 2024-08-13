import { useRef, useState, useEffect } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import Box from '@mui/material/Box';
import DynamicForm from './dynamicForm';
import Paper from '@mui/material/Paper';
import GeneralForm from './generalForm';


const EntityFactory = forwardRef(function EntityFactory({ activeStep, collectedData, setCollectedData }, ref) {
  const arrayRef = useRef([]);

  function getAllFormValues() {
    return arrayRef.current.map(item => item.getGeneralFormValues())
  }

  useImperativeHandle(ref, () => {
    return {
      getStepValues() {
        return getAllFormValues()
      }
    };
  }, []);

  function appendNewForm() {
    const copied = { ...collectedData };
    copied[activeStep.label].push({})
    setCollectedData(copied)
  }

  // useEffect(() => {
  //   debugger;
  // }, [activeStep]);


  useEffect(() => {
    arrayRef.current = arrayRef.current.slice(0, collectedData[activeStep.label].length);
  }, [collectedData]);

  return (
    <Box>
      {
        collectedData[activeStep.label] && collectedData[activeStep.label].map((item, index) => <Paper
          variant="elevation"
          style={{ backgroundColor: "#fafafa" }}
          key={item}
        >
          <Box p={3} m={2} >
            <h4>{activeStep.label} {index + 1}</h4>
            <GeneralForm
              ref={el => arrayRef.current[index] = el}
              currentForm={item}
              activeStep={activeStep}
            />
          </Box>
        </Paper>
        )
      }
      <Box style={{ display: "flex" }}>
        <button onClick={() => appendNewForm()}>+</button>
        <button onClick={() => { }}>-</button>
      </Box>
    </Box>
  )
})

export default EntityFactory;