<template>
  <div>
    <h4>{{market.name}}</h4>
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
  font-size:14px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
