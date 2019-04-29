var https = require('https');
var URL = require('url').URL;
module.exports = {
    command: function (bot, msg) {
        var phrases = ['!joke', '!laugh', '!funny'];
        if (msg.author.bot === false) {
            var wordsArr = msg.content.split(' ');
            wordsArr.map(function (word, index) {
                phrases.map(function (phrase) {
                    if (word.toLowerCase() === phrase) {
                        var n = wordsArr[index + 1];
                        console.log('in !joke with phrase "' + phrase + '" and where n = ' + n);
                        var url;
                        if (typeof parseInt(n, 10) === "number") {
                            url = 'https://wizardly-wing-66188a.netlify.com/.netlify/functions/server/many/' + wordsArr[index + 1];
                        } else {
                            url = 'https://wizardly-wing-66188a.netlify.com/.netlify/functions/server';
                        }
                        console.log(url);
                        url = new URL(url);
                        var options = {
                            timeout: 3000,
                            host: url.host,
                            path: url.pathname,
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
                                if (obj.joke && obj.punchline !== null) {
                                    message = obj.joke + ' || ' + obj.punchline + ' || ';
                                } else {
                                    message = obj.joke;
                                }
                                msg.channel.send(message);
                            });
                        }).on("error", (err) => {
                            msg.channel.send("Error: `" + err.message + "`");
                        });

                    }
                });
            });
        }
    },
    help: '`!joke` or `joke id=1` or `!joke 10` Will get a joke from one of two apis.'
};
