module.exports = {
    command: function(bot, msg) {
        var acromyn = require('acronym');
        var phrases = ['!ac', '!acroymn'];
        if (msg.author.bot === false) {
            var wordsArr = msg.content.split(' ');
            wordsArr.map(function(word, index) {
                phrases.map(function(phrase) {
                    if (word.toLowerCase() === phrase) {
                        var message = acromyn(word[index + 1]);
                        msg.channel.send(message);
                    }
                });
            });
        }
    },
    help: '`!ac` test'
};