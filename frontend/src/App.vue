<template>
  <div id="app">
    <b-container fluid class="header">
      <h1>Soup<span style="color:rgb(250, 215, 1);">Bet</span></h1>
    </b-container>
    <router-view/>
  </div>
</template>

<style>
body {
  height: 1440px;
  overflow: hidden;
}

#app {
  font-family: Arial, sans-serif;
  background: #ccc;
  height: 1440px;
  overflow: hidden;
}

h2 {
  text-align: center;
}
.header {
  display: block;
  color: white;
  background: rgb(0, 84, 158);
  background-image: linear-gradient(rgb(0, 84, 158), rgb(28, 117, 188));
  padding: 2px 48px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-style: italic;
  font-weight: bold;
  font-variant: small-caps;
  text-align: center;
}

.header h1 {
  font-size: 60px;
}
</style>
