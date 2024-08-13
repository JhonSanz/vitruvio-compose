import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DynamicForm from './dynamicForm';
import SECTIONS from '@/utils/commonSections';


const GeneralForm = forwardRef(function GeneralForm({ currentForm, activeStep }, ref) {
  const [sectionForm, setSectionForm] = useState([]);

  useEffect(() => {
    console.log("currentForm", currentForm, activeStep)
    let res;
    if (Object.keys(currentForm).length === 0) {
      res = SECTIONS;
    } else {
      res = SECTIONS.map((item, index) => {
        const auxForm = [...item.form];
        const currentFormSection = currentForm[index]
        debugger;
        return {
          ...item,
          form: auxForm.map(subItem => {
            return {
              ...subItem,
              default: currentFormSection[subItem.name]
            }
          })
        }
      })
    }
    debugger;
    setSectionForm(res)
  }, [currentForm, activeStep])

  useImperativeHandle(ref, () => {
    return {
      getGeneralFormValues() {
        return getAllFormValues()
      }
    };
  }, []);

  function mergeArrayToObject(arr) {
    return arr.reduce((acc, obj) => {
      return { ...acc, ...obj };
    }, {});
  }

  function getAllFormValues() {
    const allValues = arrayRef.current.map(item => item.getFormValues());
    // return mergeArrayToObject(allValues)
    return allValues;
  }

  const arrayRef = useRef([]);
  useEffect(() => {
    arrayRef.current = arrayRef.current.slice(0, sectionForm.length);
  }, []);

  return (
    <div>
      {
        sectionForm.map((item, index) => (
          <Accordion key={`${item.name}${index}`}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              {item.name}
            </AccordionSummary>
            <AccordionDetails>
              <DynamicForm
                ref={el => arrayRef.current[index] = el}
                fields={item.form}
                submitFunction={() => { }}
              />
            </AccordionDetails>
          </Accordion>
        ))
      }
    </div>
  );
})

export default GeneralForm;
