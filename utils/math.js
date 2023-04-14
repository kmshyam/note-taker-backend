exports.rndmTwoDigNum = () => {
  let random = Math.floor(Math.random() * 100);
  let twoDigRndm;
  if (random < 10) {
    twoDigRndm = `0${random}`;
  } else {
    twoDigRndm = random;
  }
  return twoDigRndm;
};

exports.rndmFourDigNum = () => {
  let random = Math.floor(Math.random() * 10000);
  let fourDigRndm;
  if (random < 1000) {
    fourDigRndm = `0${random}`;
  } else {
    fourDigRndm = random;
  }
  return fourDigRndm;
};

exports.rndmFiveDigNum = () => {
  let random = Math.floor(Math.random() * 100000);
  let fiveDigRndm;
  if (random < 10000) {
    fiveDigRndm = `0${random}`;
  } else {
    fiveDigRndm = random;
  }
  return fiveDigRndm;
};
