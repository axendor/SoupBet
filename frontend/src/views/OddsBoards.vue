<template>
    <b-container style="overflow:hidden;" fluid id="app">
        <div id="info" style="margin:12px;">
            <h4>How this works</h4>
            <h2>These are not the final odds.</h2>
            <b-container fluid>
                <ul>
                    <li>All markets are pool markets.</li>
                    <li>Any money in a market is split between those who bet on the winner.</li>
                    <li>The odds shown here are from how much is in the pool currently.</li>
                </ul>
            </b-container>
        </div>
        <b-row id="boardsContainer">
            <b-col style="padding:12px;" cols="3" v-bind:key="market.ID" v-for="market in markets.data">
                <board :market="market" />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import Board from '../components/Board.vue'
import axios from 'axios'

export default {
  name: 'odds',
  data(){
    return {
        markets: {data:[]},
        DivElmnt: null,
        ReachedMaxScroll: false,
        PreviousScrollTop: 0,
        ScrollInterval: null,
    }
  },
  components: {
    Board
  },
  methods:{
        updateMarkets: function() {
            console.log('updating');
            axios
                .get('http://localhost:5000/markets')
                .then(marketRes => {
                    axios
                        .get('http://localhost:5000/results')
                        .then(resultsRes => {
                            var results = {};
                            resultsRes.data.forEach(result => {
                                results[result.ID] = result;
                            })
                            this.markets.data=marketRes.data;
                            this.markets.data.forEach((market) => {
                                if(results[market.ID]) market.options = [{opt:results[market.ID].res,betTotal:results[market.ID].resultTotal,payingOut:true,}]
                                market.options.sort((a,b) => {
                                    if(a.opt == "Any other player") return true;
                                    return a.betTotal < b.betTotal;
                                })
                            })
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                })
                .catch(err => {
                    console.error(err);
                })
        },
        scrollDiv_init: function() {
            this.DivElmnt = document.getElementById('boardsContainer'),
            
            this.DivElmnt.scrollTop = 0;
            
            this.ScrollInterval = setInterval(this.scrollDiv, 5000);
        },
        scrollDiv: function() {
            
            if (!this.ReachedMaxScroll) {
                this.DivElmnt.scrollTop = this.PreviousScrollTop;
                this.PreviousScrollTop += 1108;
                
                this.ReachedMaxScroll = this.DivElmnt.scrollTop >= (this.DivElmnt.scrollHeight - this.DivElmnt.offsetHeight);
            }
            else {
                this.DivElmnt.scrollTop = this.PreviousScrollTop;
                this.PreviousScrollTop = 0;
                this.ReachedMaxScroll = (this.DivElmnt.scrollTop == 0) ? false : true;
            }
        },
        scrollPause: function() {
            clearInterval(this.ScrollInterval);
        },
        scrollResume: function(){
            this.ScrollInterval = setInterval(this.scrollDiv, 5000);
        }
  },
  mounted: function(){
    this.updateMarkets();
    this.scrollDiv_init();
  },
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

h4, h2 {
    font-size: 36px;
    text-align: center;
}

#info h4 {
  font-size: 32px;
  text-align: center;
  display: block;
  background: rgb(0, 84, 158);
  padding: 10px;
  color: white;
}

#info {
  border-radius: 1px;
  border: 1px solid #666;
  background: white;
  height: 220px;
}

#info ul {
    list-style: none;
    padding: 0;
    text-align: center;
    font-size: 18px;
}

#boardsContainer {
    overflow:hidden;
    height:1112px;
    padding: 4px;
}
</style>
