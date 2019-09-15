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
var conn = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=db.accdb;Persist Security Info=False;');

const Object = require('./objectDefinitions')

app.listen(5000,(req,res) => {
	console.log('App started on port 5000');
});

app.get('/test',(req,res) => {
	res.send('Server is running');
});

app.get('/markets',(req,res) => {
	conn
		.query('SELECT * FROM TblMarkets ORDER BY MarketID ASC')
		.then(markets_records => {
			conn
				.query('SELECT * FROM TblOptions')
				.then(options_records => {
					conn
						.query('SELECT * FROM TblBets')
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
						.catch(errfn);
				})
				.catch(errfn);
		})
		.catch(errfn);
});

app.get('/recentBets', (req,res) => {
	conn
		.query('SELECT TblBets.BetID, TblBets.Punter, TblBets.Stake, TblOptions.OptionID, TblOptions.OptionName, TblMarkets.MarketID, TblMarkets.MarketName FROM TblBets INNER JOIN (TblOptions INNER JOIN TblMarkets ON TblOptions.MarketID = TblMarkets.MarketID) ON TblBets.OptionID = TblOptions.OptionID ORDER BY TblBets.BetID DESC')
		.then(bets => {
			res.send(bets);
		})
		.catch(errfn);
});

app.get('/results', (req,res) => {
	conn
		.query('SELECT TblMarkets.MarketID AS ID, SUM(TblBets.Stake) AS marketTotal FROM TblMarkets INNER JOIN ((TblOptions INNER JOIN TblResults ON TblOptions.OptionID=TblResults.OptionID) INNER JOIN TblBets ON TblOptions.OptionID = TblBets.OptionID) ON TblMarkets.MarketID = TblOptions.MarketID GROUP BY TblMarkets.MarketID')
		.then(marketsBets => {
			conn
				.query('SELECT TblMarkets.MarketID, TblMarkets.MarketName, TblOptions.OptionName, SUM(TblBets.Stake) AS BetTotal FROM TblMarkets INNER JOIN ((TblOptions INNER JOIN TblBets ON TblOptions.OptionID = TblBets.OptionID) INNER JOIN TblResults ON TblOptions.OptionID = TblResults.OptionID) ON TblMarkets.MarketID = TblOptions.MarketID GROUP BY TblMarkets.MarketID, TblMarkets.MarketID, TblMarkets.MarketName, TblOptions.OptionName')
				.then(results => {
					var markets = marketsBets.slice();
					results.forEach(result => {
						markets.forEach(market => {
							if(market.ID == result.MarketID){
								market.name = result.MarketName;
								market.res = result.OptionName;
								market.resultTotal = result.BetTotal;
								market.payout = market.marketTotal/market.resultTotal;
							}
						});
					});
					conn
						.query('SELECT TblOptions.MarketID, TblBets.BetID, TblBets.Punter, TblBets.Stake FROM TblBets INNER JOIN (TblResults INNER JOIN TblOptions ON TblResults.OptionID = TblOptions.OptionID) ON TblBets.OptionID = TblResults.OptionID')
						.then(bets => {
							markets.forEach(market => {
								bets.forEach(bet => {
									if(market.ID == bet.MarketID) {
										market.payouts = market.payouts ? market.payouts : [];
										market.payouts.push({
											ID: bet.BetID,
											name: bet.Punter,
											stake: bet.Stake,
											payout: "$" + (bet.Stake * market.payout).toFixed(2)
										});
									}
								});
							});
							res.send(markets);
						})
						.catch(errfn);
				})
				.catch(errfn);
		})
		.catch(errfn);
});

app.post('/addBet', (req,res) => {
	conn
		.execute('INSERT INTO TblBets(Punter,OptionID,Stake) VALUES (\"' + req.body.punterName + '\",' + req.body.optionID + ',' + req.body.stake + ')')
		.then(data => {
			res.send('Success');
		})
		.catch(errfn);
});

app.post('/deleteBet', (req,res) => {
	conn
		.execute('DELETE FROM TblBets WHERE BetID=' + req.body.BetID)
		.then(() => {
			res.send('Success');
		})
		.catch(errfn);
});

app.get('/',(req,res) => {
	res.send('This is the backend server for soupbet!');
});

app.get('/payouts', (req,res) => {
	conn
		.query('SELECT TblBets.BetID, TblMarkets.MarketName, TblMarkets.MarketID, TblOptions.OptionName, TblBets.Punter, Tblbets.Stake FROM TblBets INNER JOIN ((TblOptions INNER JOIN TblResults ON TblOptions.OptionID=TblResults.OptionID) INNER JOIN TblMarkets ON TblMarkets.MarketID=TblOptions.MarketID) ON TblBets.OptionID=TblOptions.OptionID WHERE TblBets.PaidOut=false')
		.then(bets => {
			res.send(bets);
		})
		.catch(errfn);
})

app.get('/payout/:BetID', (req,res) => {
	if(req.params.BetID){
		conn
			.execute('UPDATE TblBets SET PaidOut=true WHERE BetID=' + req.params.BetID,'SELECT * FROM TblBets WHERE BetID=' + req.params.BetID)
			.then(bet => {
				res.send({betUpdated:bet,success:true});
			})
			.catch(errfn);
	}
})

function errfn(err){
	console.error(err);
}