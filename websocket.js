const ws = new WebSocket('ws://localhost:5000');

ws.onopen = function(e) {
    console.log("websocket is open");
    console.log(e);
};

ws.onmessage = function(e) {
    //console.log("message:", e)
    let res = JSON.parse(e.data)
    if( res.res == "pathFind") {  // response contains pathfinding data
        window.grid.data = res.data
    }
}