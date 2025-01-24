const User = require('../models/user');

let cachedUser = null;
let cachedStats = null;

const ensureUser = async () => {
  if (!cachedUser) {
    let user = await User.findOne();
    if (!user) {
      user = new User({ score: 0, prizes: 0 });
      await user.save();
    }
    cachedUser = user;
  }
  return cachedUser;
};

const processClick = async () => {
  try {
    const tenPointBonus = Math.random() < 0.5 ? 10 : 0;
    const prizeLottery = Math.random() < 0.25 ? 1 : 0;

    const updatedUser = await User.findOneAndUpdate(
      {},
      {
        $inc: { score: 1 + tenPointBonus, prizes: prizeLottery },
      },
      { upsert: true, new: true }
    );

    cachedUser = updatedUser;
    cachedStats = {
      score: updatedUser.score,
      prizes: updatedUser.prizes,
    };

    return {
      score: updatedUser.score,
      prizes: updatedUser.prizes,
      tenPointBonus: tenPointBonus > 0,
      prize: prizeLottery > 0,
    };
  } catch (error) {
    console.error('Click processing error:', error);
    throw error;
  }
};

const getUserStats = async () => {
  if (cachedStats) {
    return cachedStats;
  }

  try {
    const user = await ensureUser();
    cachedStats = {
      score: user.score,
      prizes: user.prizes,
    };
    return cachedStats;
  } catch (error) {
    console.error('User stats retrieval error:', error);
    throw error;
  }
};

const resetGame = async () => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      {},
      { score: 0, prizes: 0 },
      { upsert: true, new: true }
    );

    cachedUser = updatedUser;
    cachedStats = {
      score: updatedUser.score,
      prizes: updatedUser.prizes,
    };

    return { score: 0, prizes: 0 };
  } catch (error) {
    console.error('Game reset error:', error);
    throw error;
  }
};

module.exports = {
  processClick,
  getUserStats,
  resetGame,
};
