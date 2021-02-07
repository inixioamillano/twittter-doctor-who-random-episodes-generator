const CronJob = require("cron").CronJob;
const episodes = require("./episodes");
const MarkovGen = require('markov-generator');
const Twitter = require("twitter");
require("dotenv").config();

const twitter = new Twitter({
    consumer_key: process.env.CONSUMER,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

console.log({
    consumer_key: process.env.CONSUMER,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

let markov = new MarkovGen({
    input: episodes,
    minLength: 4
});

const tweet = () => {
    let status = markov.makeChain();
    console.log(status);
    twitter.post("statuses/update", {status}, function(error, tweet, response) {
        if (error) {
            console.log(error)
        }
        console.log(tweet)
    });
}

var job = new CronJob('0 */1 * * *', function() {
    tweet();
}, null, true, 'Europe/Madrid');
job.start();

tweet();