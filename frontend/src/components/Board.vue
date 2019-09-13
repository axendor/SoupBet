<template>
  <div class="board">
    <h4>{{market.name}}</h4>
    <li>
      <b-row v-bind:key="option.ID" v-for="option in market.options">
        <b-col cols="9">
          {{option.opt}}
        </b-col>
        <b-col cols="3" style="text-align:right;" v-if="option.betTotal > 0">
          $ {{(market.betTotal/option.betTotal).toFixed(2)}}
        </b-col>
        <b-col cols="3" style="text-align:right;" v-if="option.betTotal <= 0">
          -
        </b-col>
      </b-row>
    </li>
  </div>
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
  font-size:20px;
  text-align: center;
}
li {
  list-style:none;
  margin:0;
  padding: 4px;
  font-size: 14px;
}
.board {
  border-radius: 12px;
  border: 3px solid black;
  padding: 10px;
}
</style>
