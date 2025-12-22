const Commission = require('../models/Commission');

exports.calculateCommissionStats = async (userId) => {
  try {
    // Today's start (00:00:00)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Last 7 days start (7 days ago 00:00:00 → last 7 days + today partial)
    const last7DaysStart = new Date(todayStart);
    last7DaysStart.setDate(last7DaysStart.getDate() - 7);

    // Last 30 days start
    const last30DaysStart = new Date(todayStart);
    last30DaysStart.setDate(last30DaysStart.getDate() - 30);

    const [todayAgg, last7Agg, last30Agg, allTimeAgg] = await Promise.all([
      // Today's earnings
      Commission.aggregate([
        { $match: { user: userId, purchaseDate: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      // Last 7 days
      Commission.aggregate([
        { $match: { user: userId, purchaseDate: { $gte: last7DaysStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      // Last 30 days
      Commission.aggregate([
        { $match: { user: userId, purchaseDate: { $gte: last30DaysStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      // All time
      Commission.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    return {
      todayEarnings: todayAgg[0]?.total || 0,
      last7DaysEarnings: last7Agg[0]?.total || 0,
      last30DaysEarnings: last30Agg[0]?.total || 0,
      allTimeEarnings: allTimeAgg[0]?.total || 0
    };
  } catch (err) {
    console.error('Error calculating commission stats:', err);
    return {
      todayEarnings: 0,
      last7DaysEarnings: 0,
      last30DaysEarnings: 0,
      allTimeEarnings: 0
    };
  }
};