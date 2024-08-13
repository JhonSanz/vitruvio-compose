docker run --interactive --tty --rm --volume=vitruvio_neo4j_data:/data --volume=$HOME/neo4j/backups:/data/dumps neo4j:5.5 neo4j-admin database dump neo4j
