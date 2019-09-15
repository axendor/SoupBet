<template>
    <b-container fluid>
        <b-row>
            <b-col class="newBet" cols="4">
                <h4>Add Bet</h4>
                <h5>Name:</h5>
                <input v-model="PunterName" placeholder='Name' />
                <h5>Market:</h5>
                <select v-model="MarketIDSelected">
                    <option  v-bind:key="market.MarketID" v-for="market in markets.data">{{market.name}}</option>
                </select>
                <h5>Option:</h5>
                <select v-model="OptionNameSelected">
                    <option  v-bind:key="option.OptionID" v-for="option in options">{{option.opt}}</option>
                </select>
                <h5>Stake:</h5>
                <input v-model="PunterStake" placeholder='Name' />
                <br/>
                <br/>
                <b-button v-on:click="addBet">Add</b-button>
            </b-col>
            <b-col class="recentBets" cols="4">
                <h4>Recent Bets</h4>
                <table>
                    <thead>
                        <th>Name</th>
                        <th>Stake</th>
                        <th>Market</th>
                        <th>Option</th>
                        <th></th>
                    </thead>
                    <tbody>
                        <tr v-bind:key="bet.ID" v-for="bet in recentBets">
                            <th>{{bet.Punter}}</th>
                            <td style="text-align:center;">$ {{bet.Stake.toFixed(2)}}</td>
                            <td>{{bet.MarketName}}</td>
                            <td>{{bet.OptionName}}</td>
                            <td style="text-align:center;"><b-button variant="danger" v-on:click="deleteRecentBet(bet.BetID)">Delete</b-button></td>
                        </tr>
                    </tbody>
                </table>
            </b-col>
            <b-col class="payouts" cols="4">
                <h4>Payouts</h4>
                <table>
                    <thead>
                        <th>Name</th>
                        <th>Market</th>
                        <th>Option</th>
                        <th>Payout</th>
                        <th></th>
                    </thead>
                    <tbody>
                        <tr v-bind:key="payout.ID" v-for="payout in payouts">
                            <th>{{payout.Punter}}</th>
                            <td>{{payout.MarketName}}</td>
                            <td>{{payout.OptionName}}</td>
                            <td style="text-align:center;">$ {{payout.Stake.toFixed(2)}}</td>
                            <td style="text-align:center;"><b-button variant="success" v-on:click="complete(payout.BetID)">Complete</b-button></td>
                        </tr>
                    </tbody>
                </table>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import axios from 'axios'

export default {
    name: 'admin',
    data(){
        return {
            PunterName: null,
            MarketIDSelected: "",
            OptionNameSelected: "",
            PunterStake: 0,
        }
    },
    computed: {
        recentBets: function(){
            return this.$store.getters.recentBets;
        },
        payouts: function(){
            return this.$store.getters.payouts;
        },
        markets: function(){
            return this.$store.getters.markets;
        },
        options: function(){
            return this.getOptions();
        },
        optionID: function(){
            return this.getOptionID();
        },
        results: function(){
            return this.$store.getters.results;
        },
        marketPayouts: function(){
            var out={};
            this.results.forEach(result => {
                out[result.ID] = result.payout;
            })
            return out;
        }
    },
    methods: {
        marketUpdate: function(e){
            this.$store.dispatch('updateAdminData');
        },
        deleteRecentBet: function(id){
            axios
                .post('http://localhost:5000/deleteBet', {
                    BetID: id,
                })
                .then(deleted => {
                    console.log('Deleted ' + id)
                    this.marketUpdate();
                })
                .catch(err => {
                    console.error(err);
                });
        },
        complete: function(id){
            axios
                .get('http://localhost:5000/payout/' + id)
                .then(updated => {
                    console.log('Updated ' + id);
                    this.marketUpdate();
                })
                .catch(err => {
                    console.error(err);
                });
        },
        getOptions: function() {
            var temp = [];
            this.markets.data.forEach(market => {
                if(this.MarketIDSelected && market.name == this.MarketIDSelected) temp = market.options;
            });
            return temp;
        },
        getOptionID: function() {
            var temp = null;
            this.options.forEach(option => {
                if(this.OptionNameSelected && option.opt == this.OptionNameSelected) temp = option.ID;
            });
            return temp;
        },
        addBet: function(){
            axios
                .post('http://localhost:5000/addBet', {
                    punterName: this.PunterName,
                    optionID: this.optionID,
                    stake: this.PunterStake,
                })
                .then(response => {
                    this.marketUpdate();
                    this.PunterName = "";
                    this.MarketIDSelected = "";
                    this.OptionNameSelected = "";
                    this.PunterStake = 0;
                    console.log(response);
                })
                .catch(err => {
                    console.error(err);
                });
        },
    },
    mounted: function(){
        this.marketUpdate();
        console.log(this.markets);
        console.log(this.getOptions());
    }
}
</script>

<style>
table{
    width: 100%;
}
th {
    text-align: center;
}
table, td, th {
    background: white;
    border-collapse:collapse;
    border: 1px solid black;
    padding: 4px;
}

.newBet {
    text-align:center;
}
</style>