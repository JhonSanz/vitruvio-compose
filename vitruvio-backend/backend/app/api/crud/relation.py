import json
from typing import List
from backend.app.api.schemas.item import ItemCreate, Item
from backend.app.api.schemas.relation import RelationCreate, RelationCreateInsumo
from neomodel import db
from backend.app.api.utils.node_format import extract_node_properties
from backend.app.api.schemas.relation import Relation
from backend.app.api.crud.item import create_item, get_item, get_item_by_code


def create_relation(*, relation: RelationCreate) -> bool:
    target_node = get_item(item_label=relation.target_label, item_id=relation.target_code)
    if not target_node:
        node_created = create_item(item=ItemCreate(**{
            "label": relation.target_label,
            "code": relation.target_code,
            "properties": relation.properties,
        }))
        if not node_created:
            return None

    origin_node = get_item(item_label=relation.origin_label, item_id=relation.origin_code)
    if not origin_node:
        return None
    
    relation_query = (
        f"MATCH (origin:{relation.origin_label} {{code: '{relation.origin_code}'}}), "
        f"(destination:{relation.target_label} {{code: '{relation.target_code}'}}) "
        f"CREATE (origin)<-[:{relation.relation_name}]-(destination) "
        "RETURN origin, destination"
    )
    
    result, _ = db.cypher_query(relation_query)
    return True


def get_related_nodes(*, origin_code: str) -> List[Item]:
    relation_query = (
        f"MATCH (n {{ code: '{origin_code}' }})<-[*1]-(related)"
        "RETURN related"
    )
    try:
        result, _ = db.cypher_query(relation_query)
        nodes = [extract_node_properties(record[0]) for record in result]
        return nodes
    except Exception as e:
        print(f"Failed to fetch nodes: {str(e)}")
        return []


def create_relation_graph(*, relation: RelationCreateInsumo) -> bool:
    target_node = get_item_by_code(item_id=relation.target_code)
    if not target_node:
        return None

    origin_node = get_item_by_code(item_id=relation.origin_code)
    if not origin_node:
        return None
    
    processed_properties = {}
    for item in relation.properties:
        if item.name and item.value:
            processed_properties[item.name] = item.value

    relation_query = (
        "MATCH (origin {code: $origin_code}), "
        "(destination {code: $destination_code}) "
        f"CREATE (origin)<-[:{relation.relation_name} $properties]-(destination) "
        "RETURN origin, destination"
    )
    
    params = {
        'origin_code': relation.origin_code,
        'destination_code': relation.target_code,
        # 'relation_name': relation.relation_name,
        'properties': processed_properties
    }
    
    result, _ = db.cypher_query(relation_query, params)
    return True