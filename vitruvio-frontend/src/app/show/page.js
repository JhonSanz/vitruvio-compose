"use client"

import { useEffect, useState, useContext, useRef } from 'react';
import Box from '@mui/material/Box';
import fetchBackend from "@/utils/commonFetch";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ThemeContext } from '@/components/providers';
import { Mercar } from '../prototype/page';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import convertObject from '@/utils/transformObject';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

function ShowNodeDetails({ data, incomingEdges, setIncomingEdges }) {
  const mercarRef = useRef(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!data || typeof data !== 'object') {
    return <p>No data available</p>;
  }

  const entries = Object.entries(data);

  async function handleSetNewRelations() {
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
    const final_data = { node: data.code, relations: [...result, ...result2] };
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
        <h4>Detailed node</h4>
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
      <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        {entries.map(([key, value]) => (
          <div key={key} style={{ display: 'flex', marginBottom: '8px' }}>
            <div style={{ flex: 1, fontWeight: 'bold' }}>{key.charAt(0).toUpperCase() + key.slice(1)}:</div>
            <div style={{ flex: 2 }}>{value}</div>
          </div>
        ))}
      </div><br />
      <h4>Relaciones actuales</h4>
      <div style={{ border: "1px dotted black" }}>
        {
          incomingEdges.map((item, index) => (
            <div>
              <div style={{ display: "flex", padding: "30px" }}>
                <div style={{ width: "100%" }}>
                  <div><b>source</b></div><br />
                  <div>{item.source.code} {item.source.name}</div>
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
      </div><br />
      <h4>Relaciones nuevas</h4>
      <Mercar ref={mercarRef} />
      <br />
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
  const { setAlertContent } = useContext(ThemeContext);

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
        data={node.properties}
        incomingEdges={incomingEdges}
        setIncomingEdges={setIncomingEdges}
      />)
    }
  }, [incomingEdges, modalReady])

  return (
    <div style={{ marginLeft: '30px', padding: "10px", width: "400px" }}>
      <div style={{ display: "flex", justifyContent: "start" }}>
        <div style={{ marginRight: "10px" }}><b>{theIndex}</b></div>
        <div><small>{node.properties.code}</small> {node.properties.name}</div>
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
    </div>
  );
};

// Componente principal
const TreeView = () => {
  const [rootNodes, setRootNodes] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  useEffect(() => {
    const fetchRootNodes = async () => {
      try {
        const result = await fetchBackend("/graph/", "GET");
        setRootNodes(result);
      } catch (error) {
        console.error('Error fetching root nodes:', error);
      }
    };

    fetchRootNodes();
  }, []);

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

  return (
    <div>
      <h1>Árbol de Datos</h1>
      {rootNodes.map((node, index) => (
        <TreeNode
          key={node.properties.code}
          node={node}
          onToggle={handleToggle}
          expandedNodes={expandedNodes}
          theIndex={`${index + 1}.`}
        />
      ))}
    </div>
  );
};
export default TreeView;