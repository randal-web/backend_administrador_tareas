import { Goal, GoalAttributes, GoalCreationAttributes } from './goal.model';

export class GoalService {
  static async create(data: GoalCreationAttributes) {
    if ((data.target_date as any) === '') data.target_date = null;
    return await Goal.create(data);
  }

  static async findAllByUser(user_id: string) {
    return await Goal.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
    });
  }

  static async findById(id: string, user_id: string) {
    return await Goal.findOne({ where: { id, user_id } });
  }

  static async update(id: string, user_id: string, data: Partial<GoalAttributes>) {
    const goal = await this.findById(id, user_id);
    if (!goal) return null;
    if ((data.target_date as any) === '') data.target_date = null;
    return await goal.update(data);
  }

  static async delete(id: string, user_id: string) {
    const goal = await this.findById(id, user_id);
    if (!goal) return null;
    await goal.destroy();
    return true;
  }

  static async toggleCompletion(id: string, user_id: string) {
    const goal = await this.findById(id, user_id);
    if (!goal) return null;
    goal.is_completed = !goal.is_completed;
    await goal.save();
    return goal;
  }
}
