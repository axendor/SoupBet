<template>
  <b-container fluid style="height:1080px; padding: 0; margin: 0;"> 
    <div class="board">
      <h4>{{market.name}}</h4>
      <li>
        <b-row class="optionRow" v-bind:key="option.ID" v-for="option in market.options">
          <b-col class="optionName" cols="9">
            {{option.opt}}
          </b-col>
          <b-col cols="3" class="odds nBlank" v-if="option.betTotal > 0">
            {{(market.betTotal/option.betTotal).toFixed(2)}}
          </b-col>
          <b-col cols="3" class="odds blank" v-if="option.betTotal <= 0">
            -
          </b-col>
        </b-row>
      </li>
      <b-alert variant="success" class="payoutLabel" v-if="market.options[0].payingOut==true" show>Now paying out</b-alert>
    </div>
  </b-container>
</template>

<script>
export default {
  name: 'Board',
  props: {
    market: Object
  }
}

</script>

<style scoped>
h4 {
  font-size: 40px;
  text-align: center;
  display: block;
  background: rgb(0, 84, 158);
  padding: 10px;
  color: white;
}

li {
  list-style:none;
  margin:0;
  padding: 4px 20px;
  font-size: 32px;
}

.optionRow {
  padding: 5px;
}

.board {
  border-radius: 1px;
  border: 1px solid #666;
  background: white;
  box-shadow: 0px 9px 9px 1px #666;
}

.odds {
  text-align: center;
}

.nBlank {
  box-shadow: 0px 0px 1px 1px #a3a3a3;
  background: #efefef;
  border-radius: 5px;
}

.payoutLabel {
  margin: 6px 32px;
  font-size: 22px;
  text-align: center;
}
</style>
