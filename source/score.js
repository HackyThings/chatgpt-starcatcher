class Score {
  constructor() {
    this.score = 0;
    this.lives = 3;
    this.nextStarPoints = 1;
    this.consecutiveStarsCaught = 0;
  }

  incrementScore() {
    this.consecutiveStarsCaught++;

    // Increase the point value for the next star if consecutive stars have been caught
    if (this.consecutiveStarsCaught % 3 === 0) {
      this.nextStarPoints++;
    }

    // Add the point value for the next star to the score
    this.score += this.nextStarPoints;
  }

  decrementLives() {
    this.lives--;
    this.consecutiveStarsCaught = 0;
    this.nextStarPoints = 1;
  }

  getScore() {
    return this.score.toString().padStart(4, "0");
  }

  getLives() {
    return this.lives;
  }
}

export { Score };
