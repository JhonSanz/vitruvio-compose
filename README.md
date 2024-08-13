
### TUTORIAL

##### dump neo4j database from docker container
1. detener el contenedor de la base de datos neo4j
2. correr `docker run --interactive --tty --rm --volume=vitruvio_neo4j_data:/data --volume=$HOME/neo4j/backups:/data/dumps neo4j:5.5 neo4j-admin database dump neo4j` teniendo en cuenta que el volumen que relacionemos con `:/data` contiene la información de nuestra base de datos, el otro volumen se encargará de que el dump quede en `$HOME/neo4j/backups`

--- 

##### Add alembic to fastapi
1. desde /backend correr `alembic init app/alembic`
2. ir a `app/alembic/env.py` y agregar el siguiente código, para traer la DATABASE_URL de variables de entorno
```python
# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
DATABASE_URL = os.getenv("DATABASE_URL")

config = context.config
config.set_main_option('sqlalchemy.url', DATABASE_URL)
```
3. donde esté nuestro alembic.ini correr `alembic revision --autogenerate -m "Initial migration"` para generar las migraciones
4. correr `alembic upgrade head` para aplicar las migraciones