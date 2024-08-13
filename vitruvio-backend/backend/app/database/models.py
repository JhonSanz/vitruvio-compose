# crud/entity/models.py

from neomodel import StructuredNode, StringProperty, RelationshipTo


class Item(StructuredNode):
    name = StringProperty(required=True)

    # Relación de ejemplo, puedes adaptar según tus necesidades
    # Ejemplo: relación uno a muchos con otro tipo de nodo
    # other_node = RelationshipTo('OtherNode', 'RELATIONSHIP_NAME')
