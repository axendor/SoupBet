// EXPRESS
// Check that express app, for handling post and get methods to the server
const express = require('express');
// Initialise app variable that is used to define our get and post methods
const app = express();
// Check that bodyparser is installed. Used with requests in post functions to parse the post request to an object
var bodyParser = require('body-parser');
// Check that cors is installed. Used so that websites can access the data that aren't on the same url (MAY WANT TO DELETE)
var cors = require('cors')
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({strict:true,}));

// NODE-ADODB
// Check that node-adodb is installed. Used for databse management
var ADODB = require('node-adodb');
// Initialise connection to the database
var database = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=db.accdb;Persist Security Info=False;');

const Object = require('./objectDefinitions')

app.listen(5000,(req,res) => {
	console.log('App started on port 5000');
});

app.get('/test',(req,res) => {
	res.send('Server is running');
});

app.get('/markets',(req,res) => {
	database
		.query('SELECT * FROM tblMarkets')
		.then(markets_records => {
			database
				.query('SELECT * FROM tblOptions')
				.then(options_records => {
					database
						.query('SELECT * FROM tblBets')
						.then(bets_records => {
							var markets = [];
							markets_records.forEach(market_record => {
								markets.push(new Object.Market(market_record));
							});
							options_records.forEach(option_record => {
								var opt = new Object.Option(option_record);
								markets.forEach(market => {
									market.addOption(opt);
								})
							});
							bets_records.forEach(bet_record => {
								var b = new Object.Bet(bet_record);
								markets.forEach(market => {
									market.addBet(b);
								})
							});
							res.send(markets);
						})
						.catch(err => {
							console.error(err);
						});
				})
				.catch(err => {
					console.error(err);
				});
		})
		.catch(err => {
			console.error(err);
		});
});

app.get('/recentBets', (req,res) => {

});

app.get('')