module.exports = {
	Market: Market,
	Option: Option,
	Bet: Bet
}

function Market(record) {
	this.name = record.MarketName;
	this.ID = record.MarketID;

	this.betTotal = 0;

	this.options = [];

	this.addOption = ((option) => {
		if(option.isPartOf(this)){
			this.options.push(option);
		}
	});

	this.addBet = ((bet) => {
		this.options.forEach(option => {
			option.addBet(bet);
		});
	});

	this.addToBetTotal = ((n) => {
		this.betTotal += n;
	});
}

function Option(record){
	this.opt = record.OptionName;
	this.ID = record.OptionID;

	this.betTotal = 0;

	this.bets = [];

	var parent = null;
	MarketID = record.MarketID;

	this.isPartOf = ((market) => {
		if(MarketID == market.ID){
			parent = market;
			return true
		} else {
			return false;
		}
	});

	this.addBet = ((bet) => {
		if(bet.isPartOf(this)){
			this.bets.push(bet);
			this.addToBetTotal(bet.stake);
		}
	});

	this.addToBetTotal = ((n) => {
		this.betTotal += n;
		parent.addToBetTotal(n);
	});
}

function Bet(record){
	this.punter = record.Punter;
	this.stake = record.Stake;

	var optionID = record.OptionID;

	this.isPartOf = ((option) => {
		return option.ID == optionID;
	});
}