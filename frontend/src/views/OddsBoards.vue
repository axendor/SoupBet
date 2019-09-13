<template>
  <b-container id="app">
    <h2>Please note that these are not the final odds.</h2>
    <b-row>
      <b-col style="padding:12px;" cols="4" v-bind:key="market.ID" v-for="market in markets.data">
        <board :market="market" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Board from '../components/Board.vue'
import axios from 'axios'

export default {
  name: 'app',
  data(){
    return {
      markets: {data:[]}
    }
  },
  components: {
    Board
  },
  mounted: function(){
    axios
      .get('http://localhost:5000/markets')
      .then(res => {
        console.log(res.data)
        this.markets.data=res.data
        this.markets.data.forEach((market) => {
          market.options.sort((a,b) => {
            return a.betTotal < b.betTotal
          })
        });
      })
      .catch(err => {
        console.error(err);
      })
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
h2 {
  text-align: center;
}
</style>
