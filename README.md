# Genesis currency rate project

### Note
for some reason when I running MySQL from docker compose I can't get access to it. Because of this I am setting up containers using bash scripts

## Description
This app can be fully containerised, or you can run server locally for the quicker debugging. 

## Env
- Most of the fields you need to fill with your private data
- DB_HOST should have the value of the data base host. When you run the serer locally this value should equal to `"127.0.0.1"` and when you run the server from the container, change it to `"mysqlContainer"`

## How to run
- Insure you are in the root of project
- Create server image by running `sh ./scripts/create-server-image.sh`
- Create mysql cotainer by running `sh ./scripts/create-mysql-container.sh`
- Create server container by running `sh ./scripts/create-server-container.sh`

After starting the server migrations will start automatically and will create required table.
That's it! Your are good to use it!

## Examples of usage
### Get the rurrent rate
![getRate](img/getRate.png)
### Subscribe new email
![subscribe](img/subscribe.png)
### Try to subscribe same email twice
![subscribeFail](img/subscribeFail.png)
### Subscribe different email
![subscribeSecond](img/subscribeSecond.png)
### Sent email manually (it gets sent automatically every day at 12:00)
![emailSent](img/emailSent.png)
### How email looks
![email](img/email.png)

## Examples of good setup
![goodLogs](img/goodLogs.png)