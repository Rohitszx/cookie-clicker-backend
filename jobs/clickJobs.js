const User = require('../models/user');

const ensureUser = async () => {
  let user = await User.findOne();
  if (!user) {
    user = new User({ score: 0, prizes: 0 });
    await user.save();
  }
  return user;
};

const processClick = async () => {
  try {
    const user = await ensureUser();
    
    user.score += 1;
    
    const tenPointBonus = Math.random() < 0.5;
    if (tenPointBonus) {
      user.score += 10;
    }
    
    const prizeLottery = Math.random() < 0.25;
    if (prizeLottery) {
      user.prizes += 1;
    }
    
    await user.save();
    
    return {
      score: user.score,
      prizes: user.prizes,
      tenPointBonus,
      prize: prizeLottery
    };
  } catch (error) {
    console.error('Click processing error:', error);
    throw error;
  }
};

const getUserStats = async () => {
  try {
    const user = await ensureUser();
    return {
      score: user.score,
      prizes: user.prizes
    };
  } catch (error) {
    console.error('User stats retrieval error:', error);
    throw error;
  }
};

const resetGame = async () => {
  try {
    const user = await ensureUser();
    user.score = 0;
    user.prizes = 0;
    await user.save();
    return { score: 0, prizes: 0 };
  } catch (error) {
    console.error('Game reset error:', error);
    throw error;
  }
};

module.exports = {
  processClick,
  getUserStats,
  resetGame
};