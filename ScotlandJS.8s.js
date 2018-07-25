#!/usr/bin/env /usr/local/bin/node

const bitbar = require('bitbar');
const Twit = require('twit')
const creds = {
	'consumer_key': '<Fill me in>',
	'consumer_secret': '<Fill me in>'
};

const T = new Twit({
	...creds,
	app_only_auth:  true,
	timeout_ms: 60 * 1000,
	strictSSL: true,
});

async function getTweets() {
	// Customise this query to your liking
	const searchQuery = 'scotlandjs -filter:retweets';

	const {data, resp} = await T.get('search/tweets', {
		q: searchQuery,
		count: 10,
		result_type: 'recent',
		include_entities: false
	});

	return data.statuses.map(tweet => {
		return {
			text: tweet.text,
			href: `https://twitter.com/statuses/${tweet.id_str}`
		}
	});
}

async function init() {
	return bitbar.create([
		{
			text: '🗣️',
			color: bitbar.darkMode ? 'white' : 'red',
			dropdown: false
		},
		bitbar.sep,
		{
			text: 'Tweets',
			color: '#ff79d7',
			submenu: await getTweets()
		},
		bitbar.sep,
		'Hi ScotlandJS 2018!'
	]);
}

init().then(console.log);
