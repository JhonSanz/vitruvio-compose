from neomodel import db
from backend.app.api.crud.item import create_item, get_item_by_code
from backend.app.api.crud.relation import create_relation_graph
from backend.app.api.schemas.graph import DataModel, DataInsumos, NodeUpdateRelations, NodeFiltering
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
    code = f"{clean_string(s=data_model.name)}_{'_'.join(labels)}"
    processed_labels = ":".join(labels)

    node = ItemCreate(label=processed_labels, code=code, name=data_model.name, properties=processed_params)

    item_found = get_item_by_code(item_id=code)
    if item_found:
        raise Exception(F"Item code {code} already exists")

    create_item(item=node)
    for rel in data_model.nodeRelations:
        create_relation_graph(relation=RelationCreateInsumo(
            relation_name="BELONGS",
            origin_code=node.code,
            target_code=rel.related,
            properties=rel.params
        ))
    print(data_model)


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


@db.transaction
def update_node_relations(*, data_model: NodeUpdateRelations):
    print(data_model)
    
    # delete_all_relations(code=data_model.node)
    # for rel in data_model.relations:
    #     create_relation_graph(relation=RelationCreateInsumo(
    #         relation_name="BELONGS",
    #         origin_code=data_model.node,
    #         target_code=rel.related,
    #         properties=rel.params
    #     ))


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
    query = "MATCH (n)"
    conditions = []

    if params.label:
        conditions.append(f"n:{params.label}")
    if params.code:
        conditions.append(f"n.code CONTAINS '{params.code}'")
    if params.name:
        conditions.append(f"n.name CONTAINS '{params.name}'")
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    query += " RETURN n"

    print(query)
    try:
        result, _ = db.cypher_query(query)
        nodes = [extract_node_properties(record[0]) for record in result]
        return nodes
    except Exception as e:
        print(f"Failed to fetch nodes: {str(e)}")
        return []
