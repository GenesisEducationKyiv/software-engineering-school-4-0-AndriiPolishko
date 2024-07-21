docker network create mynetwork

docker run --name mysqlContainer --network mynetwork -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -v $(pwd)/mysqlSetup/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql -d mysql

echo "Waiting 10sec for mysql to start..."

sleep 10
