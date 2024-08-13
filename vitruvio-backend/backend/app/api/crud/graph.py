from neomodel import db
from backend.app.api.crud.item import create_item, get_item_by_code
from backend.app.api.crud.relation import create_relation_graph
from backend.app.api.schemas.graph import DataModel, DataInsumos, NodeUpdateRelations
from backend.app.api.schemas.item import ItemCreate
from backend.app.api.schemas.relation import RelationCreateInsumo
from backend.app.api.utils.node_format import extract_node_properties


def create_graph(data_model: DataModel):
    for item in data_model.data:
        label = item.name        
        for i, node in enumerate(item.data):
            if node:
                create_item(item=ItemCreate(label=label, code=f"{label}{node["name"]}{i}", properties=node))


@db.transaction
def create_insumo(data_model: DataInsumos):
    processed_params = {item.name:item.value for item in data_model.nodeParams}
    processed_params["name"] = data_model.name
    node = ItemCreate(label=data_model.type, code=data_model.code, name=data_model.name, properties=processed_params)
    
    item_found = get_item_by_code(item_id=data_model.code)
    if item_found:
        raise Exception(F"Item code {data_model.code} already exists")

    create_item(item=node)
    for rel in data_model.nodeRelations:
        create_relation_graph(relation=RelationCreateInsumo(
            relation_name="BELONGS",
            origin_code=node.code,
            target_code=rel.related,
            properties=rel.params
        ))


def show_nodes(*, direction: str):
    query = (
        "MATCH (n) "
        "WHERE NOT (n)-->() "
        "RETURN n "
    )

    try:
        result, _ = db.cypher_query(query)
        nodes = [extract_node_properties(record[0]) for record in result]
        return nodes
    except Exception as e:
        print(f"Failed to fetch nodes: {str(e)}")
        return []


def get_node_children(*, code: str):
    query = (
        "MATCH (n {code: $code})"
        "<-[*1]-(m) "
        "RETURN DISTINCT m"
    )
    params = { "code": code }
    try:
        result, _ = db.cypher_query(query, params)
        nodes = [extract_node_properties(record[0]) for record in result]
        return nodes
    except Exception as e:
        print(f"Failed to fetch nodes: {str(e)}")
        return []


def get_node_incoming_edges(*, code: str):
    query = (
        "MATCH (n {code: $code}) "
        "MATCH (n)<-[r]-(m) "
        "RETURN r, m"
    )
    params = { "code": code }
    try:
        result, _ = db.cypher_query(query, params)
        return [{"relation": record[0], "source": record[1]} for record in result]
    except Exception as e:
        print(f"Failed to fetch nodes: {str(e)}")
        return []


def delete_all_relations(*, code: str):
    query = (
        "MATCH (n {code: $code})<-[r]-() "
        "DELETE r "
    )
    params = { "code": code }
    try:
        result, _ = db.cypher_query(query, params)
    except Exception as e:
        print(f"Failed to delete relations of node {code} \n {str(e)}")
        return []


@db.transaction
def update_node_relations(*, data_model: NodeUpdateRelations):
    delete_all_relations(code=data_model.node)
    for rel in data_model.relations:
        create_relation_graph(relation=RelationCreateInsumo(
            relation_name="BELONGS",
            origin_code=data_model.node,
            target_code=rel.related,
            properties=rel.params
        ))


def delete_node(*, node_code: str):
    query = (
        "MATCH (n {code: $code}) "
        "DETACH DELETE n "
    )
    params = { "code": node_code }
    try:
        result, _ = db.cypher_query(query, params)
    except Exception as e:
        print(f"Failed to delete node {node_code} \n {str(e)}")
        return []
