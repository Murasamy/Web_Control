document.onkeydown = updateKey;
document.onkeyup = resetKey;

var server_port = 65432;
var server_addr = "192.168.119.171";   // the IP address of your Raspberry PI

var nodeConsole = require('console')
var myConsole = new nodeConsole.Console(process.stdout,process.stderr)

myConsole.log('Hello World')

function update_recieved_data(data){
    data_str = data.toString();
    myConsole.log('data:', data_str);
    // load the json data
    var json_data = JSON.parse(data_str);
    document.getElementById("cpu_temperature").innerHTML = json_data["cpu_temperature"];
    document.getElementById("gpu_temperature").innerHTML = json_data["gpu_temperature"];
    document.getElementById("disk").innerHTML = json_data["disk"];
    document.getElementById("ram").innerHTML = json_data["ram"];
}

function client(){
    const net = require('net');
    var input = document.getElementById("message").value;
    console.log(input);
    const client = net.createConnection({ port: server_port, host: server_addr }, () => {
        // 'connect' listener.
        console.log('connected to server!');
        // send the message
        // client.write(`${input}\r\n`);
        client.write("Hello from Electron!");
    });
    
    // get the data from the server
    client.on('data', (data) => {
        update_recieved_data(data);
        client.end();
        client.destroy();
    });

    client.on('end', () => {
        console.log('disconnected from server');
    });

}

function update_recvd_data(data){
    console.log("Data received: ");
}

function send_data(input){
    const net = require('net');
    // var input = document.getElcementById("message").value;
    console.log(input);

    const client = net.createConnection({ port: server_port, host: server_addr }, () => {
        // 'connect' listener.
        console.log('connected to server!');
        // send the message
        // client.write(`${input}\r\n`);
        client.write(input);
    });
    
    // get the data from the server
    client.on('data', (data) => {
        update_recvd_data(data);
    });

    client.on('end', () => {
        console.log('disconnected from server');
    });
}

// for detecting which key is been pressed w,a,s,d
function updateKey(e) {
    e = e || window.event;

    if (e.keyCode == '87') {
        // up (w)
        document.getElementById("upArrow").style.color = "green";
        send_data("87");
    }
    else if (e.keyCode == '83') {
        // down (s)
        document.getElementById("downArrow").style.color = "green";
        send_data("83");
    }
    else if (e.keyCode == '65') {
        // left (a)
        document.getElementById("leftArrow").style.color = "green";
        send_data("65");
    }
    else if (e.keyCode == '68') {
        // right (d)
        document.getElementById("rightArrow").style.color = "green";
        send_data("68");
    }
    // ijkl
    else if (e.keyCode == '73') {
        // up (i)
        send_data("73");
    }
    else if (e.keyCode == '74') {
        // down (j)
        send_data("74");
    }
    else if (e.keyCode == '75') {
        // left (k)
        send_data("75");
    }
    else if (e.keyCode == '76') {
        // right (l)
        send_data("76");
    }
}

// reset the key to the start state 
function resetKey(e) {

    e = e || window.event;

    document.getElementById("upArrow").style.color = "grey";
    document.getElementById("downArrow").style.color = "grey";
    document.getElementById("leftArrow").style.color = "grey";
    document.getElementById("rightArrow").style.color = "grey";
}


// update data for every 50ms
function update_data(){
    setInterval(function(){
        // get image from python server
        client();
    }, 1000);
    client()
}