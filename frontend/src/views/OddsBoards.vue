<template>
    <b-container style="overflow:hidden;" fluid id="app">
        <div id="info" style="margin:12px;">
            <h4>How this works</h4>
            <h2>Markets Closed.</h2>
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

export default {
  name: 'odds',
  data(){
    return {
        DivElmnt: null,
        ReachedMaxScroll: false,
        PreviousScrollTop: 0,
        ScrollInterval: null,
        updateInterval: null,
    }
  },
  computed: {
      markets: function(){
          return this.$store.getters.markets;
      },
  },
  components: {
    Board
  },
  methods:{
        marketUpdate: function(e){
            this.$store.dispatch('inc');
        },
        scrollDiv_init: function() {
            this.DivElmnt = document.getElementById('boardsContainer'),
            
            this.DivElmnt.scrollTop = 0;
            
            this.ScrollInterval = setInterval(this.scrollDiv, 3000);
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
        },
        marketUpdate: function(){
            console.log('updating');
            this.$store.dispatch('updateMarkets');
        }
  },
  mounted: function(){
    this.scrollDiv_init();
    this.$store.dispatch('updateMarkets');
    this.updateInterval = setInterval(this.marketUpdate,4000);
  },
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

h2 {
    font-size: 42px;
    text-align: center;
}

h4 {
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
