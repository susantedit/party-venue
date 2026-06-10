import { BookingModel } from '../models/Booking';
import { InquiryModel } from '../models/Inquiry';
import { PackageModel } from '../models/Package';
import { BlogModel } from '../models/Blog';

export async function getDashboardOverview() {
  const [bookingStats, totalInquiries, totalPackages, totalBlogs, monthlyTrend, eventTypeDist] =
    await Promise.all([
      BookingModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            revenue: { $sum: '$estimatedPrice' },
          },
        },
      ]),
      InquiryModel.countDocuments({ status: 'unread' }),
      PackageModel.countDocuments({ isActive: true }),
      BlogModel.countDocuments({ published: true }),
      // Monthly trend — last 12 months
      BookingModel.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // Event type distribution
      BookingModel.aggregate([
        { $group: { _id: '$eventType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

  const statusMap: Record<string, number> = {};
  let revenueEstimate = 0;
  for (const s of bookingStats) {
    statusMap[s._id] = s.count;
    if (s._id === 'confirmed' || s._id === 'completed') revenueEstimate += s.revenue ?? 0;
  }

  return {
    totalBookings: Object.values(statusMap).reduce((a, b) => a + b, 0),
    pendingBookings: statusMap['pending'] ?? 0,
    contactedBookings: statusMap['contacted'] ?? 0,
    confirmedBookings: statusMap['confirmed'] ?? 0,
    completedBookings: statusMap['completed'] ?? 0,
    cancelledBookings: statusMap['cancelled'] ?? 0,
    revenueEstimate,
    totalInquiries,
    totalPackages,
    totalBlogs,
    monthlyTrend: monthlyTrend.map((m) => ({ month: m._id, count: m.count })),
    eventTypeDistribution: eventTypeDist.map((e) => ({ type: e._id, count: e.count })),
  };
}
