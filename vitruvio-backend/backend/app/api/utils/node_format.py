from typing import Dict


def extract_node_properties(node) -> Dict[str, Dict[str, str]]:
    labels = list(node.labels)
    properties = dict(node)
    return {"labels": labels, "properties": properties}
