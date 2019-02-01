var MongoClient = require('mongodb').MongoClient;
var mongoURI = process.env.MONGOLAB_URI; // || require('./.env').uri;
var rand = function(arr) {
    //console.log('in random.');
    var random_choice = Math.floor(Math.random() * arr.length);
    return arr[random_choice];
}
var compliments = function(user, points) {
    var responses = [
        'Congrats ' + user + ' you now have ' + points + ' points',
        'Good work ' + user + ' you now have ' + points + ' points',
        'Good going ' + user + ' you now have ' + points + ' points',
        'Way to help out ' + user + ' you now have ' + points + ' points',
        'Give a hear-hear for ' + user + ' you now have ' + points + ' points',
        'Who has two thumbs and one more point? ' + user + ' does.  You now have ' + points + ' points',
        'https://xkcd.com/1543/'
    ];
    return responses;
}
module.exports = {
    command: function(bot) {
        var phrase = '++';
        bot.on('ready', () => { // When the bot is ready
            console.log(phrase + ' Ready!'); // Log "Ready!"
        });
        bot.on("messageCreate", function(msg) {
            if (msg.author.bot === false) {
                //console.log(msg)
                console.log(msg.channel.guild.name + '#' + msg.channel.name + ': ' + msg.author.username + ': ' + msg.content);
                //bot.createMessage(msg.channel.id, msg);
                //var regex = /((([^\s])+|([^\s])+(\s)+)(\+){2})/gm;
                var regex = /((([^\s])+|([^\s])+(\s)+)((\+){2})|(thanks|thank)\s([^\s]+))/gmi;
                var m;
                while ((m = regex.exec(msg.content)) !== null) {
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                    // The result can be accessed through the `m`-variable.
                    m.forEach(function(match, groupIndex) {
                        if (groupIndex === 0) {
                            msg.addReaction('💯');
                            var thing = match.replace(/(\+)+|(thanks|thank)/gmi, '').trim();
                            console.log(`Found match, group ${groupIndex}: ${match}`);
                            MongoClient.connect(mongoURI, function(err, client) {
                                console.log('connected to mongo');
                                if (err) console.log(err);
                                var db = client.db('cajonbot');
                                // look for user in db
                              var queryObj = {'thing': thing};
                                db.collection('points').findOne(queryObj, function(err, result) {
                                    if(result){
                                    console.log(result);
                                    console.log(result.thing + ': ' + result.points);
                                    result.points = parseInt(result.points, 10) + 1;
                                    console.log(result.thing + ': ' + result.points);
                                    db.collection('points').updateOne(queryObj, { $set: result },
                                        function(err, writeResult) {
                                            if (err) {
                                                console.log(err);
                                            }
                                          client.close();
                                          console.log('Updating points: ' + thing);
                                          var message = rand(compliments(thing, result.points));
                                      console.log(message);
                                          bot.createMessage(msg.channel.id, message);
                                        });
                                    } else {
                                      var myObj = {
                                        thing: thing,
                                        points: 1
                                      };
                                      db.collection('points').insertOne(myObj, function(err, res) {
                                        if (err) {
                                          console.log(err);
                                        }
                                        console.log('Insreting points: ' + thing);
                                        var message = rand(compliments(thing, 1));
                                        bot.createMessage(msg.channel.id, message);
                                        client.close();
                                });
                                    }
                                });
                            });
                        }
                    });
                }
            }
        });
    },
    help: '` ++ string` Give points away[wip]'
};