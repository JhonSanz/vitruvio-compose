"use client"

import { useEffect, useState, useContext, useRef } from 'react';
import Box from '@mui/material/Box';
import fetchBackend from "@/utils/commonFetch";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ThemeContext } from '@/components/providers';
import Prototype, { Mercar } from '../prototype/page';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import convertObject from '@/utils/transformObject';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ModalApp from '@/components/modal';
import FiltersSection from '@/components/prototype/filtersSection';
import TextField from '@mui/material/TextField';
import { ParamsPicker } from '../prototype/page';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';


function ShowNodeDetails({ label, data, incomingEdges, setIncomingEdges }) {
  const mercarRef = useRef(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [labelPicker, setLabelPicker] = useState(label.join(","));
  const [paramsForm, setParamsForm] = useState([]);
  const [currentDetails, setCurrentDetails] = useState(
    Object.entries(data).map(([key, value]) => {
      return { name: key, value }
    })
  );

  if (!data || typeof data !== 'object') {
    return <p>No data available</p>;
  }

  async function handleSetNewRelations() {
    const allDetails = [...currentDetails, ...paramsForm];
    const result = incomingEdges.map(item => {
      return {
        related: item.source.code,
        ...convertObject(item.relation)
      }
    })
    const result2 = mercarRef.current.getPurchases().map(item => {
      if (item.related?.properties) {
        return {
          related: item.related.properties.code,
          params: item.params,
        }
      }
    }).filter(item => item !== undefined)
    console.log(labelPicker)
    const final_data = {
      node: data.code,
      labels: labelPicker.split(","),
      details: allDetails,
      relations: [...result, ...result2]
    };
    try {
      const result = await fetchBackend("/graph/update-node-relations", "POST", final_data);
      window.location.reload()
    } catch (error) {
      console.error('Error fetching root nodes:', error);
    }
  }

  function handleDeleteRelation(index) {
    const copied = [...incomingEdges];
    copied.splice(index, 1);
    setIncomingEdges(copied);
  }

  function handleDeleteDetail(index) {
    const copied = [...currentDetails];
    copied.splice(index, 1);
    setCurrentDetails(copied);
  }

  async function handleDeleteNode() {
    try {
      const result = await fetchBackend("/graph/delete-node", "POST", { node_code: data.code });
      window.location.reload()
    } catch (error) {
      console.error('Error fetching root nodes:', error);
    }
  }

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h1>{data.name}</h1>
        {
          confirmDelete && <div style={{ display: "flex" }}>
            <IconButton aria-label="delete" color="error">
              <CloseIcon onClick={() => setConfirmDelete(false)} />
            </IconButton>
            <IconButton aria-label="delete" color="success">
              <CheckIcon onClick={() => handleDeleteNode()} />
            </IconButton>
          </div>
        }
        {
          !confirmDelete && <IconButton aria-label="delete" color="error">
            <DeleteIcon onClick={() => setConfirmDelete(true)} />
          </IconButton>
        }
      </div>
      <div style={{ fontStyle: "italic" }}>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Labels"
          name="name"
          variant="outlined"
          value={labelPicker}
          onChange={(e) => setLabelPicker(e.target.value)}
        />
      </div>
      <br />
      <hr />
      <h4>Details</h4>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div style={{ backgroundColor: "#fafafa", padding: "25px" }}>
          {
            currentDetails.map((item, index) => (
              <div key={item.name} style={{ display: 'flex', marginBottom: '8px', height: "40px", borderBottom: "1px dotted gray" }}>
                <div style={{ width: "100%", fontWeight: 'bold' }}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}:</div>
                <div style={{ width: "100%" }}>{item.value}</div>
                <div style={{ width: "100%" }}>
                  {
                    item.name !== "code" && <IconButton aria-label="delete" color="secondary">
                      <DeleteIcon onClick={() => handleDeleteDetail(index)} />
                    </IconButton>
                  }
                </div>
              </div>
            ))
          }
        </div>
        <Box mb={2}>
          <h4>New Details</h4>
          <ParamsPicker
            initialLabel="Param"
            paramsForm={paramsForm}
            setParamsForm={setParamsForm}
          />
        </Box>
      </div>
      <hr />
      <h4>Current bindings</h4>
      {
        incomingEdges.length === 0 && <div>
          <h5>{data.name} no tiene relaciones</h5>
        </div>
      }
      <br />
      {
        incomingEdges.length > 0 && (
          <div style={{ border: "1px dotted gray", backgroundColor: "#fafafa" }}>
            {
              incomingEdges.map((item, index) => (
                <div key={`${item.source.code}${index}`}>
                  <div style={{ display: "flex", padding: "30px" }}>
                    <div style={{ width: "100%" }}>
                      <div><b>source</b></div><br />
                      <div><span style={{ fontStyle: "italic" }}>{item.source.label}</span> {item.source.name}</div>
                    </div>
                    <div style={{ width: "100%" }}>
                      <div><b>relation</b></div><br />
                      {Object.entries(item.relation).map(([key, value]) => (
                        <div key={key} style={{ display: 'flex', marginBottom: '8px' }}>
                          <div style={{ flex: 1 }}>{key.charAt(0).toUpperCase() + key.slice(1)}:</div>
                          <div style={{ flex: 2 }}>{value}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <IconButton aria-label="delete" color="secondary">
                        <DeleteIcon onClick={() => handleDeleteRelation(index)} />
                      </IconButton>
                    </div>
                  </div>
                  {index < incomingEdges.length - 1 && <hr />}
                </div>
              ))
            }
          </div>
        )
      }
      <h4>New bindings</h4>
      <Mercar ref={mercarRef} />
      <br />
      <hr />
      <Button color="primary" variant="contained" onClick={() => handleSetNewRelations()}>Guardar</Button>
    </div>
  );
}



// Componente para renderizar un nodo del árbol
const TreeNode = ({ node, onToggle, theIndex }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [children, setChildren] = useState([]);
  const [incomingEdges, setIncomingEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalReady, setModalReady] = useState(false);
  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [alertContent, setAlertContent] = useState(null);

  useEffect(() => {
    if (isExpanded) {
      const fetchChildren = async () => {
        setLoading(true);
        try {
          // const response = [{ properties: { code: "test", name: "Aqui estoy" } }]
          const response = await fetchBackend("/graph/node-children", "GET", {}, { node_code: node.properties.code });

          setChildren(response);
        } catch (error) {
          console.error('Error fetching children:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchChildren();
    }
  }, [isExpanded, node.properties.code]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onToggle(node.properties.code);
  };

  async function getNodeDetail() {
    setModalReady(false)
    try {
      const response = await fetchBackend("/graph/node-incoming-edges", "GET", {}, { node_code: node.properties.code });
      setIncomingEdges(response);
    } catch (error) {
      console.error('Error fetching children:', error);
    }
    setModalReady(true)
  }

  useEffect(() => {
    if (modalReady) {
      setAlertContent(<ShowNodeDetails
        label={node.labels}
        data={node.properties}
        incomingEdges={incomingEdges}
        setIncomingEdges={setIncomingEdges}
      />)
      setIsAlertOpened(true);
    }
  }, [incomingEdges, modalReady])

  return (
    <div style={{ marginLeft: '30px', padding: "10px", width: "400px" }}>
      <div style={{ display: "flex", justifyContent: "start" }}>
        <div style={{ marginRight: "10px" }}><b>{theIndex}</b></div>
        <div><small style={{ fontStyle: "italic" }}>{node.labels.join(", ")}</small> {node.properties.name}</div>
        <div style={{ cursor: 'pointer', marginLeft: "10px", display: "flex" }}>
          <div><InfoOutlinedIcon onClick={() => getNodeDetail()} fontSize='small' color='primary' /></div>
          <div onClick={handleToggle}>{isExpanded ? '[-]' : '[+]'}</div>
        </div>
      </div>
      {isExpanded && (
        <div>
          {loading ? <p>Cargando...</p> : (
            <div>
              {children.map((child, index) => (
                <TreeNode
                  key={child.id}
                  node={child}
                  onToggle={onToggle}
                  // expandedNodes={expandedNodes}
                  theIndex={`${theIndex}${index + 1}.`}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <ModalApp
        isOpen={isAlertOpened}
        setIsOpen={setIsAlertOpened}
        children={alertContent}
      />
    </div>
  );
};

// Componente principal
const TreeView = () => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [filteredData, setFilteredData] = useState([]);
  const [formFilter, setFormFilter] = useState({
    label: "",
    name: "",
    code: "",
    param_name: "",
    param_value: "",
  });
  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [alertContent, setAlertContent] = useState(null);


  async function getFilteredData() {
    try {
      const finalFilters = {
        ...formFilter,
        label: formFilter.label.name || ""
      };
      const result = await fetchBackend("/graph/filter-nodes", "GET", {}, finalFilters, "http://localhost:8000");
      setFilteredData(result);
    } catch (error) {
      console.error('Error fetching root nodes:', error);
    }
  }

  const handleToggle = (nodeId) => {
    setExpandedNodes(prev => {
      const newExpandedNodes = new Set(prev);
      if (newExpandedNodes.has(nodeId)) {
        newExpandedNodes.delete(nodeId);
      } else {
        newExpandedNodes.add(nodeId);
      }
      return newExpandedNodes;
    });
  };

  function handleOpenCreateModal() {
    setAlertContent(<Prototype />)
    setIsAlertOpened(true);
  }

  return (
    <div>
      <Box p={5}>
        <FiltersSection
          getFilteredData={getFilteredData}
          setFormFilter={setFormFilter}
          formFilter={formFilter}
        />
      </Box>
      {
        filteredData.length === 0 && <Box textAlign="center">
          <h3>Filtra los nodos iniciales para la visualización</h3>
        </Box>
      }
      {filteredData.map((node, index) => (
        <TreeNode
          key={node.properties.code}
          node={node}
          onToggle={handleToggle}
          expandedNodes={expandedNodes}
          theIndex={`${index + 1}.`}
        />
      ))}
      <ModalApp
        isOpen={isAlertOpened}
        setIsOpen={setIsAlertOpened}
        children={alertContent}
      />
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => handleOpenCreateModal()}
        style={{
          position: 'absolute',
          bottom: 36,
          right: 36,
        }}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};
export default TreeView;