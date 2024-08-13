import * as Yup from 'yup';


const SECTIONS = [
  {
    name: "Estructura",
    form: [
      {
        "alias": "Nombre",
        "name": "name",
        "type": "string",
        "default": "",
        "validators": Yup.string().required("required")
      },
      {
        "alias": "Transparencia",
        "name": "transparency",
        "type": "string",
        "default": "",
        "validators": Yup.string().required("required")
      },
      {
        "alias": "Volume",
        "name": "volume",
        "type": "number",
        "default": "",
        "validators": Yup.string().required("required")
      },
    ]
  },
  {
    name: "Desarrollo",
    form: [

      {
        "alias": "Evolution",
        "name": "evolution",
        "type": "number",
        "default": "",
        "validators": Yup.string().required("required")
      },
    ]
  },
  {
    name: "Bioquímica",
    form: [
      {
        "alias": "Elemento",
        "name": "element",
        "type": "string",
        "default": "",
        "validators": Yup.string().required("required")
      },
      {
        "alias": "Size",
        "name": "size",
        "type": "number",
        "default": "",
        "validators": Yup.string().required("required")
      },
    ]
  },
  {
    name: "Fisiología",
    form: [
      {
        "alias": "Shape",
        "name": "shape",
        "type": "string",
        "default": "",
        "validators": Yup.string().required("required")
      },
    ]
  },
]

export default SECTIONS;