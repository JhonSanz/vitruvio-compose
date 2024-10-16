import uuid
from neomodel import db
from typing import List
from backend.app.api.crud.item import create_item, get_item_by_code, get_item_by_name
from backend.app.api.crud.relation import create_relation_graph
from backend.app.api.schemas.graph import (
    DataModel,
    DataInsumos,
    NodeUpdateRelations,
    NodeFiltering,
    NodeDetails,
    Direction
)
from backend.app.api.schemas.item import ItemCreate
from backend.app.api.schemas.relation import RelationCreateInsumo
from backend.app.api.utils.node_format import extract_node_properties
from backend.app.api.utils.clean_string import clean_string


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

    labels = [clean_string(s=l) for l in data_model.type]
    code = str(uuid.uuid4())
    processed_labels = ":".join(labels)

    node = ItemCreate(label=processed_labels, code=code, name=data_model.name, properties=processed_params)

    item_found_by_name = get_item_by_name(item_name=data_model.name)
    if item_found_by_name:
        raise Exception(F"Item name {data_model.name} already exists")

    item_found_by_code = get_item_by_code(item_id=code)
    if item_found_by_code:
        raise Exception(F"Item code {code} already exists")

    created_item = create_item(item=node)
    for rel in data_model.nodeRelations:
        create_relation_graph(relation=RelationCreateInsumo(
            relation_name="BELONGS",
            origin_code=node.code,
            target_code=rel.related,
            properties=rel.params
        ))
    print(data_model)
    return created_item


def show_nodes(*, direction: str):
    # query = (
    #     "MATCH (n) "
    #     "WHERE NOT (n)-->() "
    #     "RETURN n "
    # )
    
    query = "MATCH (n) OPTIONAL MATCH (n)<-[r]-() RETURN n AS node, COUNT(r) AS numRelations"

    try:
        result, _ = db.cypher_query(query)
        print(result)
        nodes = []
        for record in result:
            node = extract_node_properties(record[0])
            node["is_leaf"] = record[1] == 0
            nodes.append(node)
        # nodes = [extract_node_properties(record[0]) for record in result]
        return nodes
    except Exception as e:
        print(f"Failed to fetch nodes: {str(e)}")
        return []


def get_node_children(*, code: str, direction: Direction):
    if direction == Direction.down:
        query = (
            "MATCH (n {code: $code})<-[*1]-(m) "
            "OPTIONAL MATCH (m)<-[r]-() "
            "RETURN DISTINCT m, COUNT(r) AS numRelations"
        )
    else:
        query = (
            "MATCH (n {code: $code})-[*1]->(m) "
            "OPTIONAL MATCH (m)<-[r]-() "
            "RETURN DISTINCT m, COUNT(r) AS numRelations"
        )
    params = { "code": code }
    try:
        result, _ = db.cypher_query(query, params)
        nodes = []
        for record in result:
            node = extract_node_properties(record[0])
            node["is_leaf"] = record[1] == 0
            nodes.append(node)
        # nodes = [extract_node_properties(record[0]) for record in result]
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
        answer = []
        for record in result:
            source_values = extract_node_properties(record[1])
            answer.append({
                "relation": record[0],
                "source": {**source_values["properties"], "label": source_values["labels"][0]}
            })
        return answer
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


def remove_all_labels_from_node(*, node_code: str):
    query = """
    MATCH (n {code: $code})
    RETURN labels(n) AS labels
    """
    result, metadata = db.cypher_query(query, {'code': node_code})
    
    if result:
        labels = result[0][0]
        if labels:
            labels_str = ':'.join(labels)
            remove_labels_query = f"""
                MATCH (n {{code: $code}})
                REMOVE n:{labels_str}
            """

            db.cypher_query(remove_labels_query, {'code': node_code})
            return
        raise Exception(f"No labels found on node with code: {node_code}")
    raise Exception(f"No node found with code: {node_code}")


def update_node_labels(*, code: str, labels: List[str]):
    try:
        remove_all_labels_from_node(node_code=code)
    except Exception as e:
        raise Exception(f"Failed to update node: {e}")
    
    query = "MATCH (n {code: $code}) "
    query += "SET " + ", ".join(f"n:{label}" for label in labels)
    params = { "code": code }
    
    try:
        result, _ = db.cypher_query(query, params)
    except Exception as e:
        raise Exception(f"Failed to delete relations of node {code} \n {str(e)}")


def update_node_props(*, code: str, details: List[NodeDetails]):
    remove_props_query = """
        MATCH (n {code: $code})
        set n = {}
        return n
    """
    
    set_props_query = "MATCH (n) "
    set_props_query += "WHERE id(n) = $id "
    set_props_query += " SET "
    set_props_query += ", ".join(f"n.{prop.name} = ${prop.name}" for prop in details)

    params = { prop.name: prop.value for prop in details }

    try:
        result, _ = db.cypher_query(remove_props_query, { "code": code })        
        params = { **params, "id": result[0][0].id }
        result, _ = db.cypher_query(set_props_query, params)
        return result
    except Exception as e:
        print(f"Failed to update details of node {code} \n {str(e)}")
        return []


@db.transaction
def update_node_relations(*, data_model: NodeUpdateRelations):
    labels = [clean_string(s=l) for l in data_model.labels]

    update_node_labels(code=data_model.node, labels=labels)
    update_node_props(code=data_model.node, details=data_model.details)
    
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


def filter_nodes(*, params: NodeFiltering):
    query = (
        "MATCH (n) "
    )
    conditions = []

    if params.label:
        conditions.append(f"n:{params.label}")
    if params.name:
        conditions.append(f"(n.name CONTAINS '{params.name}' OR n.synonym CONTAINS '{params.name}')")
    if params.param_name and params.param_value:
        conditions.append(f"n.{params.param_name} CONTAINS '{params.param_value}'")

    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    
    query += " OPTIONAL MATCH (n)<-[r]-() "
    query += " RETURN n, COUNT(r) AS numRelations"

    print(params)
    print(query)
    try:
        result, _ = db.cypher_query(query)
        print(result)
        nodes = []
        for record in result:
            node = extract_node_properties(record[0])
            node["is_leaf"] = record[1] == 0
            nodes.append(node)
        return nodes
    except Exception as e:
        print(f"Failed to fetch nodes: {str(e)}")
        return []


def convert_code_to_uuid():
    cypher_query = """
        MATCH (n)
        RETURN n
    """
    result, _ = db.cypher_query(cypher_query)
    
    updates = []
    for record in result:
        node = record[0]
        new_uuid = str(uuid.uuid4())
        updates.append((node.id, new_uuid))
    
    for node_id, new_uuid in updates:
        update_query = """
            MATCH (n)
            WHERE ID(n) = $node_id
            SET n.code = $new_uuid
        """
        db.cypher_query(update_query, {'node_id': node_id, 'new_uuid': new_uuid})
    return True