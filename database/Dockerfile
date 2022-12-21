FROM postgres:latest

# copy init.sql
COPY ./init.sql /docker-entrypoint-initdb.d/

# copy config files
COPY ./pg_hba.conf /etc/postgresql/15/main/pg_hba.conf
COPY ./postgresql.conf /etc/postgresql/15/main/postgresql.conf