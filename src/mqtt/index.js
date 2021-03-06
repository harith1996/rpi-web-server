const mqtt = require('mqtt')

let mqttconn

/**
 *
 * @param {Server} server - an express server
 * @returns a WebSocket server running on the same path as 'server'
 */
const init = (host, port, user, pwd) => {
    console.log(`ℹ︎ Connecting to mqtt://${host}:${port}`)
    mqttconn = mqtt.connect('mqtt://' + host, {
        port: port || 1883,
        username: user,
        password: pwd
    });
};

/**
 * Takes in a JSON (msg), stringifies it, and broadcasts it to all clients of wss
 * @param {WebSocketServer} wss - Websocket server
 * @param {object} msg - JSON
 */
const sendJSON2Broker = (topic, msg) => {
    payload = JSON.stringify(msg)
    mqttconn.publish(topic, payload);
};

/**
 * Subscribes to all topics in topicarr. Upon receving any new message, the corresponding 
 * callback method from cbarr is called for each topic.
 * @param {Array<String>} topicarr - array of topic names
 * @param {Array<Function>} cbarr - array of callback methods for each topic
 */
const subscribe = (topicarr, cbarr) => {
    mqttconn.subscribe(topicarr, undefined, (err, granted) => {
        if (err) {
            console.error("ⅹ Could not subscribe to topics :(");
            process.exit(1);
        } else {
            console.log("✔ Successfully connected to topics :D");
        }
    }) 
            
    mqttconn.on('message', (topic, payload) => {
        let index = topicarr.indexOf(topic);
        cbarr[index](payload)
    })
}

module.exports = {
    init,
    sendJSON2Broker,
    subscribe
};
