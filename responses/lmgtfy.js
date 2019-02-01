module.exports = {
    command: function(bot) {
        var phrase = '!lmgtfy';

        bot.on('ready', () => { // When the bot is ready
            console.log(phrase + ' Ready!'); // Log "Ready!"
        });
        bot.on("messageCreate", function(msg) {
          if(msg.author.bot === false){
            var wordsArr = msg.content.split(' ');
            wordsArr.map(function(word, index) {
                if (word.toLowerCase() === phrase) {
                    var message = 'http://lmgtfy.com/?s=d&q=' + encodeURI(wordsArr.join(' ').replace(word, '').trim());
                    bot.createMessage(msg.channel.id, message);
                }
            });
          }
        });
    },
    help: '`!lmgtfy string` let me google that for you.'
};