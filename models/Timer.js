'use strict';

const timerTickInterval = 200;

class Timer {
  constructor(updateCallback, id) {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.timerRunning = TIMERSTATE.STOPPED;
    this.timerLoop = undefined;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.clients = [];
    this.updateCallback = updateCallback;
    this.id = id;

    this.startTimer = this.startTimer.bind(this)
    this.updateTimer = this.updateTimer.bind(this);
  }

  startTimer() {
    if (this.timerRunning !== TIMERSTATE.RUNNING) {
      this.startTime = Date.now();
      this.timerLoop = setInterval(this.updateTimer, timerTickInterval);
      this.timerRunning = TIMERSTATE.RUNNING;
    }
  }
  
  updateTimer() {
    let now = Date.now();
    let timeDiff = now - this.startTime + this.elapsedTime; // in milliseconds
  
    let timeDiffInSeconds = timeDiff / 1000;
    this.hours = Math.floor(timeDiffInSeconds / 3600);
    this.minutes = Math.floor(timeDiffInSeconds / 60) % 60;
    this.seconds = Math.floor(timeDiffInSeconds % 60);

    if (this.updateCallback) {
        io.to(this.id).emit('update timer', this.time)
    }
  }

  get time() {
    return {
      hours: padDisplay(this.hours, 2),
      minutes: padDisplay(this.minutes, 2),
      seconds: padDisplay(this.seconds, 2)
    };
  }
}

module.exports = Timer;