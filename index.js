const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '624682416:AAEt-SmF1AMaBBhPdX1HyOxBPgUOcAbZBms';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const request = require('request');

bot.onText(/\/movie (.+)/, (msg, match) => {
    const movie = match[1];
    const chatId = msg.chat.id;
    request(`http://www.omdbapi.com/?apikey=e63c5c15&t=${movie}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            bot.sendMessage(chatId, '_Looking for _' + movie + '...', { parse_mode: 'Markdown' })
                .then(function (msg) {
                    var res = JSON.parse(body);
                    bot.sendPhoto(chatId, res.Poster, { caption: 'Result: \nTitle: ' + res.Title + '\nYear: ' + res.Year + '\nRated: ' + res.Rated + '\nReleased: ' + res.Released })
                    // we can get more data actually, just continue the title of the json body
                    // Send poster and the sypnosis as caption

                })

        }
    });
});


bot.onText(/\/git (.+)/, (msg, match) => {
    const project = match[1];
    const chatId = msg.chat.id;
    var table = '';
    var message;

    var options = {
        url: `https://api.github.com/repos/nemtech/${project}/issues`,
        headers: {
            'User-Agent': 'request'
        }
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            bot.sendMessage(chatId, '_Looking for _' + project + '...', { parse_mode: 'Markdown' })
                .then(function (msg) {
                    var rep = JSON.parse(body);

                    for (var i = 0; i < rep.length; i++) {
                        var counter = rep[i];
                        if (!counter.html_url.includes("pull")) {
                            message = 'Issue Title: ' + counter.title + '\nURL: ' + counter.html_url + '\nCreated by: ' + counter.user.login + '\nNo. of Comments: ' + counter.comments + '\n\n';
                            table = table + '\n' + message;
                        }
                    }
                    bot.sendMessage(chatId, table);

                })
        } else {
            bot.sendMessage(chatId, "Too many request to the API.");
            bot.sendMessage(chatId, response.statusCode);
        }
    }

    request(options, callback);

});
