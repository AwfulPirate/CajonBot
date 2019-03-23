module.exports = {
    command: function(bot, msg) {
        var phrase = '!ping';
        if (msg.author.bot === false) {
            var wordsArr = msg.content.split(' ');
            wordsArr.map(function(word, index) {
                if (word.toLowerCase() === phrase) {
                    var url = msg.content.replace(phrase, '').trim();
                    var https;
                    if(url.indexOf('https')>=0){
                        https = require('https');
                    } else if(url.indexOf('http')>=0){
                        https = require('http');        
                    } else {
                        https = require('https');
                        url = 'https://' + url;
                    }
                    var URL = require('url').URL;
                    //var myURL = new URL('http://www.example.com/foo?bar=1#main');
                    var url = new URL(url);
                    var options = {
                        timeout: 3000,
                        host: url.host,
                        path: url.pathname
                    }
                    https.get(options, (resp) => {
                        var data = '';
                        resp.on('data', (chunk) => {
                            data += chunk;
                        });
                        // The whole response has been received. Print out the result.
                        resp.on('end', () => {
                            //console.log(JSON.parse(data).explanation);
                            var message = "`" + url + "` has a status of " + resp.statusCode;
                            if(resp.statusCode === 200){
                                message = "`" + url + "` is up with a status of " + resp.statusCode;
                            }
                            bot.createMessage(msg.channel.id, message);
                        });
                    }).on("error", (err) => {
                        bot.createMessage(msg.channel.id, "Error: `" + err.message + "`");
                    });
                }
            });
        }
    },
    help: '`!ping` `dev69973.service-now.com`'
};
