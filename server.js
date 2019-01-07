const express = require('express');
const Gelth=require('gelth'); // file watcher module
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
var watcher;
var iswatcherInitialized = false;
var connectedUser =0;

app.use('/public',express.static(path.join('public')));



/**
 * SocketIO INCOMMING Events
 * 
 * 1. Connection event: Connection event is fired when client accesses index.html page or refreshes the page.
 *                   Connection count is maintained to track the number of connection.
 * 
 * 2. Disconnect event: Disconnect event is fired when client is fired when index.html page is closed or refreshed
 *                      Connection count is decremented as and when client is closed.
 *                      Ultimately when there is no client connected, File watcher is closed.
 * 
 * 3. event_tail_f_start event: This event is raised when tail-f button is pressed on client.
 *                              THis event starts the file watcher.
 * 
 * SocketIO OUTGOIN Events
 * 
 * 1. event_new_line: Socket emits this event to indicate clients that a new line is written to log file.
 */
io.on('connection', function(socket){
    console.log('Users connected:'+(++connectedUser));
    
    /**Socket Disconnect Event */
    socket.on('disconnect',function(){        
        connectedUser--;
        /** Stop watching log file*/
        endTailf();

        if(connectedUser==0)
        {
            iswatcherInitialized = false;
            console.log('watcher terminated...');
        }                    
    })

    /**Start watching log file when this event is raised by client */
    socket.on('event_tail_f_start',function(data){
        startFileWatcher(path.join(__dirname,'/Logs/logger.txt'))
    })
  });



/** 
 * ROUTES
 * Get Route for index.html page
*/
app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'/index.html'));
})



/**
 * Start Server, listen on port 8080
 * */
http.listen(8080, function() {
    console.log('listening on port: 8080');
  })




/**
 * FILE WATCHER FUNCTIONS
 * 1. startFileWatcher(file): This function Initializes file watcher and hooks up On Data and on Error events.
 *                         As soon as watcher is initalized, new line(from bottom) event is raised 10 times.
 *                         Subsequently, a new line event is raised whenever there is new line added in log files.
 *                         This function is called only once when 1st client raises event_tail_f_start event.
 *                         PLEASE NOTE: this function also emits socket io event - event_new_line which all connected clients are listening on.
 *                            
 * 
 * 2.  endTailf(): This function ends the file watcher.
 *                 This function is called when the last last client is disconnected and UserCount is 0.  
*/

  function startFileWatcher(file)
  { 
      if(!iswatcherInitialized)
      {
        console.log('watcher Initialized...')  
        watcher = new Gelth(file, {follow:true,separator: '\n',lines: '10'}); 
        
        //watcher's On new Data(Line) event
        watcher.on('data', function(newline) {
          io.sockets.emit('event_new_line',newline);
        });
  
        //watcher's Error Event
        watcher.on('error', function(error) {
            console.error(error);
            });
       iswatcherInitialized = true;     
      }     
      
        
  }

  function endTailf()
  {
     if(watcher != undefined)
       watcher.end();   
  }
  