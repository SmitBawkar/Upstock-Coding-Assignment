# Tail -f Simulation

## Getting started:
- Download zip from github or do a pull
- Open root folder(Upstock-Coding-Assignment-master) and run *npm install* to install node dependencies
- Run *npm run dev* or *node server.js* to start the server
- Open *http://localhost:8080/* in browser
- Click tail -f to view log contents in real time
- Please go through the code, code is heavily commented.



## Simulating process that modifies log.txt:
- Open log file from *Upstock-Coding-Assignment-master\Logs\logger.txt*
- Add new lines and hit save. Newly added lines will be sent to the client
Please Note: Blank lines will be sent to client if there are empty lines in log



## Working/Features
- File watcher is used on server to watch new lines that are added to the log file.
- Socket.io is used for real-time sending real-time updates to client
- Fw is started whenever 1st client is connected and stopped when the last client is disconnected(Usercount = 0)
- Queue is maintained at client which holds new lines sent by server. Queue poller polls the queue evey 20 ms until its empty and displays the latest 10 lines in the browser



## Further enhancement: 

- Code can be refactored and segregated in differnt modules for maintainability. Client side code can also be sperated to differnt files - js, css, html
- As of now due to time contraints,  the application is developed keeping in mind only a single client will connect to server. Hence only the 1st client will get the top 10 rows, if more clients are connected - they will only get the new lines that are added in the log file.
- This can be  extended to support multiple clients by implementing a singleton pattern to access log file and maintaining a queue on the server. 
- No exception handling done for invalid routes. 
  Please Note: Server will stop whenever there is unhabdled exception, however this can be easily handled by listening on 'uncaughtException' - process.on('uncaughtException', function(err) { })

