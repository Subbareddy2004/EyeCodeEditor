import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate, className }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const addLeadingZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  return (
    <div className={className}>
      {Object.keys(timeLeft).length === 0 ? (
        <span>Time's up!</span>
      ) : (
        <span>
          Starts in: {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {addLeadingZero(timeLeft.hours)}h {addLeadingZero(timeLeft.minutes)}m {addLeadingZero(timeLeft.seconds)}s
        </span>
      )}
    </div>
  );
};

export default CountdownTimer;