var https = require('https');
var URL = require('url').URL;
module.exports = {
    command: function(bot, msg) {
        var phrases = ['!joke', '!laugh', '!funny'];
        if (msg.author.bot === false) {
            var wordsArr = msg.content.split(' ');
            wordsArr.map(function(word, index) {
                phrases.map(function(phrase) {
                    if (word.toLowerCase() === phrase) {
                        // curl -H "Accept: application/json" https://icanhazdadjoke.com/
                        // {"joke": "..."}//look for ? if it exists, wrap with spoiler
                        // https://official-joke-api.appspot.com/random_joke
                        // {"setup":"...", "punchline": "..."}
                        var url = rand([
                            'https://official-joke-api.appspot.com/random_joke',
                            'https://icanhazdadjoke.com/',
                            'http://api.icndb.com/jokes/random?limitTo=[nerdy]'
                        ]);
                        console.log(url);
                        var options = {
                            timeout: 3000,
                            url: url,
                            headers: {
                                'Accept': 'application/json'
                            }
                        }
                        https.get(options, (resp) => {
                            var data = '';
                            resp.on('data', (chunk) => {
                                data += chunk;
                            });
                            // The whole response has been received. Print out the result.
                            resp.on('end', () => {
                                //console.log(JSON.parse(data).explanation);
                                var message;
                                var obj = JSON.parse(data);
                                if(obj.joke){
                                    message = obj.joke;
                                } else if (obj.value.joke) {
                                    message = obj.value.joke;
                                } else{
                                    message = obj.setup + ' || ' + obj.punchline + '||';
                                }
                                bot.createMessage(msg.channel.id, message);
                            });
                        }).on("error", (err) => {
                            bot.createMessage(msg.channel.id, "Error: `" + err.message + "`");
                        });
                    }
                });
            });
        }
    },
    help: '`!joke` Will get a joke from one of two apis.'
};

var rand = function(arr) {
    //console.log('in random.');
    var random_choice = Math.floor(Math.random() * arr.length);
    return arr[random_choice];
}