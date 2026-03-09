import { User } from '../modules/auth/user.model';
import { Project } from '../modules/projects/project.model';
import { Task } from '../modules/tasks/task.model';
import { Subtask } from '../modules/tasks/subtask.model';
import { TaskComment } from '../modules/tasks/task-comment.model';
import { Habit } from '../modules/habits/habit.model';
import { HabitLog } from '../modules/habits/habit-log.model';
import { Note } from '../modules/notes/note.model';
import { Reminder } from '../modules/reminders/reminder.model';
import Report from '../modules/reports/report.model';
import Notification from '../modules/notifications/notification.model';

export function setupAssociations(): void {
  // User -> Projects
  User.hasMany(Project, { foreignKey: 'user_id', as: 'projects' });
  Project.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // User -> Tasks
  User.hasMany(Task, { foreignKey: 'user_id', as: 'tasks' });
  Task.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Project -> Tasks
  Project.hasMany(Task, { foreignKey: 'project_id', as: 'tasks' });
  Task.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

  // Task -> Subtasks
  Task.hasMany(Subtask, { foreignKey: 'task_id', as: 'subtasks' });
  Subtask.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

  // Task -> Comments
  Task.hasMany(TaskComment, { foreignKey: 'task_id', as: 'comments' });
  TaskComment.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

  // User -> Comments
  User.hasMany(TaskComment, { foreignKey: 'user_id', as: 'comments' });
  TaskComment.belongsTo(User, { foreignKey: 'user_id', as: 'commentUser' });

  // User -> Habits
  User.hasMany(Habit, { foreignKey: 'user_id', as: 'habits' });
  Habit.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Habit -> HabitLogs
  Habit.hasMany(HabitLog, { foreignKey: 'habit_id', as: 'logs' });
  HabitLog.belongsTo(Habit, { foreignKey: 'habit_id', as: 'habit' });

  // User -> Notes
  User.hasMany(Note, { foreignKey: 'user_id', as: 'notes' });
  Note.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // User -> Reminders
  User.hasMany(Reminder, { foreignKey: 'user_id', as: 'reminders' });
  Reminder.belongsTo(User, { foreignKey: 'user_id', as: 'user_reminder' });

  // User -> Reports
  User.hasMany(Report, { foreignKey: 'user_id', as: 'reports' });
  Report.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // User -> Notifications
  User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
  Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
}

export { User, Project, Task, Subtask, TaskComment, Habit, HabitLog, Note, Reminder, Report, Notification };
