import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex,axios)

export default new Vuex.Store({
  state: {
    markets: {data:[]},
    payouts: [],
    recentBets: [],
    results: [],
  },
  mutations: {
    updateMarkets: function(state) {
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
              state.markets.data=marketRes.data;
              state.markets.data.forEach((market) => {
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
        });
    },
    updateAdminData: function(state) {
      axios
        .get('http://localhost:5000/recentBets')
        .then(recentBets => {
          state.recentBets = recentBets.data;
        })
        .catch(err => {
          console.error(err);
        });
      axios
        .get('http://localhost:5000/payouts')
        .then(payouts => {
          state.payouts = payouts.data;
        })
        .catch(err => {
          console.error(err);
        });
      axios
        .get('http://localhost:5000/results')
        .then(results => {
          state.results = results.data;
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  actions: {
    updateMarkets(state) {
      state.commit('updateMarkets');
    },
    updateAdminData(state) {
      state.commit('updateMarkets');
      state.commit('updateAdminData');
    }
  },
  getters: {
    markets(state){
      return state.markets;
    },
    recentBets(state){
      return state.recentBets;
    },
    payouts(state){
      return state.payouts;
    },
    results(state){
      return state.results;
    }
  }
})
