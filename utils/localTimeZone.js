exports.getTimeZone = async (time) => {
  const date = new Date();
  const localTime = date.getTime();

  const localOffset = date.getTimezoneOffset() * 60000;

  const utc = localTime + localOffset;

  const offset = 2; // UTC of egypt is +02.00
  const egypt = utc + 3600000 * offset;

  const egyptTimeNow = new Date(egypt).toLocaleString();

  const currentTime = egyptTimeNow.split(',')[1].split(':');

  const result = [];
  let finalResult = [];

  if (!Array.isArray(time)) {
    for (let i = 0; i < currentTime.length; i++) {
      let currentString = '';
      for (let j = 0; j < currentTime[i].length; j++) {
        if (parseInt(currentTime[i][j]) || currentTime[i][j] === '0')
          currentString += currentTime[i][j];
      }
      result.push(currentString);
    }

    let newTime;
    const hours = Math.abs(parseInt(result[0]) - time.hours);
    const minutes = Math.abs(parseInt(result[1]) - time.minutes);
    const seconds = Math.abs(parseInt(result[2]) - time.seconds);

    newTime = `${hours}:${minutes}:${seconds}`;

    return newTime;
  } else {
    let body = time;
    for (let i = 0; i < body.length; i++) {
      for (let i = 0; i < currentTime.length; i++) {
        let currentString = '';
        for (let j = 0; j < currentTime[i].length; j++) {
          if (parseInt(currentTime[i][j]) || currentTime[i][j] === '0')
            currentString += currentTime[i][j];
        }
        result.push(currentString);
      }

      let newTime;
      const hours = Math.abs(parseInt(result[0]) - body[i].time.hours);
      const minutes = Math.abs(parseInt(result[1]) - body[i].time.minutes);
      const seconds = Math.abs(parseInt(result[2]) - body[i].time.seconds);

      newTime = `${hours}:${minutes}:${seconds}`;

      finalResult.push(newTime);
    }
  }
  return finalResult;
};
