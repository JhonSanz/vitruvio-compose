"""Added scale table

Revision ID: 9d7de5ac30de
Revises: 8cf77c2d200c
Create Date: 2024-08-15 09:24:44.439637

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9d7de5ac30de'
down_revision: Union[str, None] = '8cf77c2d200c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('scale',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('value', sa.String(length=100), nullable=False),
    sa.Column('order', sa.Integer(), nullable=False),
    sa.Column('unit_type_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['unit_type_id'], ['unit_type.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('scale')
    # ### end Alembic commands ###
