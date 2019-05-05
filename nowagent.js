var amqp = require('amqplib/callback_api');
var request = require('request');
var channel;
var q = 'events';
amqp.connect('amqp://admin:admin@sumeet.life:5672/', function(err, conn) {
    if(err) throw err;
    conn.createChannel(function(err, ch) {
        channel = ch;
        ch.assertQueue(q, {durable: false});
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.sendToQueue(q, Buffer.from('CONN'));
        ch.consume(q, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
        if(msg.content.toString() != 'CONN')
            var obj = JSON.parse(msg.content.toString());
        request.post({
            "headers": { "content-type": "application/json" },
            "url": "https://dev67107.service-now.com//api/2230/rabbitevents/event",
            "body": msg.content.toString()
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            console.dir(JSON.parse(body));
        });
        }, {noAck: true});
    });
});

//export NVM_DIR="$HOME/.nvm"