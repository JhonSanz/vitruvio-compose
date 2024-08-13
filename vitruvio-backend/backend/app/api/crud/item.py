from typing import List
from backend.app.api.schemas.item import ItemCreate, ItemUpdate
from neomodel import db
from backend.app.api.utils.node_format import extract_node_properties
from backend.app.api.schemas.item import Item


def get_item(*, item_label: str, item_id: str) -> Item:
    query = f"MATCH (n:{item_label} {{code: \"{item_id}\"}}) RETURN n"
    try:
        result, _ = db.cypher_query(query)
        if not result:
            return None
        node = result[0][0]
        return extract_node_properties(node)
    except Exception as e:
        print(f"Failed to fetch item: {str(e)}")
        return None


def get_item_by_code(*, item_id: str) -> Item:
    query = f"MATCH (n {{code: \"{item_id}\"}}) RETURN n"
    try:
        result, _ = db.cypher_query(query)
        if not result:
            return None
        node = result[0][0]
        return extract_node_properties(node)
    except Exception as e:
        print(f"Failed to fetch item: {str(e)}")
        return None


def get_items_by_code_or_name(*, item_id: str = "", item_name: str = "") -> Item:
    query = (
        "MATCH (n) "
        "WHERE n.name CONTAINS $name OR n.code CONTAINS $code "
        "RETURN n"
    )
    
    params = {
        "code": item_id,
        "name": item_name,
    }

    try:
        result, _ = db.cypher_query(query, params)
        print(result)
        nodes = [extract_node_properties(record[0]) for record in result]
        return nodes
    except Exception as e:
        print(f"Failed to fetch item: {str(e)}")
        return None


def get_items(*, entity: str, code: str | None) -> List[Item]:
    query = "MATCH (n)"
    conditions = []

    if entity:
        conditions.append(f"n:{entity}")
    if code:
        conditions.append(f"n.code = '{code}'")
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


def create_item(*, item: ItemCreate) -> Item:
    label = item.label.replace(" ", "")
    properties = {key:value for key, value in item.properties.items() if key and value}

    query = f"CREATE (n:{label} $properties) RETURN n"
    params = {"properties": {**properties, "code": item.code}}

    try:
        result, _ = db.cypher_query(query, params=params)
        print(result)
        return extract_node_properties(result[0][0])
    except Exception as e:
        print(f"Failed to create item: {str(e)}")
        return None


def delete_item(*, item_id: int) -> bool:
    pass