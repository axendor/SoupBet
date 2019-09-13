<template>
  <b-container id="app">
    <b-row>
      <b-col cols="6" v-bind:key="market.ID" v-for="market in markets.data">
        <board :market="market" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Board from './components/Board.vue'
import axios from 'axios'

export default {
  name: 'app',
  data(){
    return {
      markets: {data:[{name:'test1'},{name:'test2'},{name:'test3'}]}
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
