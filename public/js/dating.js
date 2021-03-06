"use strict";
const socket = io();

new Vue({
  el: "#your-date-container",
  data: {
    time: 900, //in seconds
    timer: null,
    display: null,
    loggedInUser: {},
  },
  mounted(){
    console.log(window.sessionStorage.getItem('roomId'));
    socket.emit('requestUser', {
      username: window.sessionStorage.getItem('roomId'),
    });
    socket.on('getUser', function(user){
      this.loggedInUser = user.data;
      console.log(this.loggedInUser.username + " is logged in on this page");
    }.bind(this));
  },
  methods: {
    startTimer: function() {
      //time since 1970 in milliseconds
      const now = Date.now();

      const then = now + this.time * 1000;
      this.timer = setInterval(() => {
        const secondsLeft = Math.round(then - Date.now()) / 1000;
        if (secondsLeft < 1) {
          this.goToSite("../user/rating.html");
        }
        this.timeLeft(secondsLeft);
      }, 1000);
    },
    timeLeft: function(secondsLeft) {
      let minutes = "" + Math.floor(secondsLeft / 60);
      let seconds = "" + Math.floor(secondsLeft % 60);
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      this.display = `${minutes}:${seconds}`;
    },
    goToSite: function(link) {
      clearInterval(this.timer);
      window.location.href = link;
    }
  },
  created() {
    this.startTimer();
  }
});
