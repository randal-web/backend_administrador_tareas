import Report, { ReportAttributes } from './report.model';

export class ReportService {
  static async getAllByUserId(userId: string) {
    return await Report.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });
  }

  static async create(userId: string, data: Partial<ReportAttributes>) {
    return await Report.create({
      ...data,
      user_id: userId,
    } as any);
  }

  static async delete(userId: string, reportId: string) {
    const report = await Report.findOne({ where: { id: reportId, user_id: userId } });
    if (report) {
      await report.destroy();
      return true;
    }
    return false;
  }
}