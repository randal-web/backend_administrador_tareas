import { sequelize } from '../config/database';
import { User, Project, Task, Habit, HabitLog, Note, Reminder, Report, Notification, setupAssociations } from '../config/associations';
import { getLocalDateString } from '../lib/dateUtils';
import bcrypt from 'bcryptjs';

// Native alternative to addDays/subDays to avoid extra dependencies
function offsetDate(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function seed() {
  console.log('🌱 Starting database seeding...');
  setupAssociations();

  try {
    await sequelize.sync(); // Ensure tables exist

    // 1. Create or find a test user
    let user = await User.findOne({ where: { email: 'test@example.com' } });
    const hashedPassword = await bcrypt.hash('password123', 10);

    if (!user) {
      user = await User.create({
        full_name: 'Usuario de Prueba',
        email: 'test@example.com',
        password_hash: hashedPassword,
        provider: 'local',
        is_beta_tester: true,
      } as any);
      console.log('✅ Created test user: test@example.com / password123');
    } else {
      // Update password just in case it was wrong
      await User.update({ password_hash: hashedPassword, is_beta_tester: true }, { where: { id: user.id } });
      console.log('ℹ️ Test user updated with correct password: password123');
    }

    const userId = user.id;

    // Create a beta invite notification
    await Notification.create({
      user_id: userId,
      title: '🚀 ¡Nueva función de Reportes!',
      message: 'Hemos añadido un generador de reportes diarios. ¡Pruébalo ahora en la pestaña de Reportes!',
      type: 'beta_invite',
      is_read: false,
      created_at: new Date(),
      updated_at: new Date(),
    } as any);
    console.log('✅ Created beta invite notification');

    const today = new Date();
    const todayStr = getLocalDateString(today);

    // 2. Create Projects
    const projectsData = [
      { name: '🚀 Lanzamiento Web', color_hex: '#106AFF', description: 'Proyecto para el desarrollo de la nueva plataforma.', status: 'active' },
      { name: '🍏 Salud y Bienestar', color_hex: '#10B981', description: 'Seguimiento de dieta y ejercicio.', status: 'active' },
      { name: '📚 Aprendizaje Continuo', color_hex: '#8B5CF6', description: 'Cursos, lectura y certificaciones.', status: 'active' },
      { name: '🏠 Hogar y Personal', color_hex: '#F59E0B', description: 'Tareas domésticas y organización personal.', status: 'active' },
    ];

    const projects = await Promise.all(projectsData.map(p => Project.create({ ...p, user_id: userId } as any)));
    console.log(`✅ Created ${projects.length} projects`);

    // 3. Create Tasks
    const tasksData = [
      { title: 'Finalizar landing page', status: 'DONE', priority: 'HIGH', category: 'WORK', project_id: projects[0].id, start_date: getLocalDateString(offsetDate(today, -2)), end_date: getLocalDateString(offsetDate(today, -1)) },
      { title: 'Revisión de API con el equipo', status: 'IN_PROGRESS', priority: 'MEDIUM', category: 'WORK', project_id: projects[0].id, start_date: todayStr },
      { title: 'Comprar equipo de gimnasio', status: 'TODO', priority: 'MEDIUM', category: 'PERSONAL', project_id: projects[1].id, start_date: todayStr },
      { title: 'Hacer la compra semanal', status: 'DONE', priority: 'LOW', category: 'PERSONAL', project_id: projects[3].id, start_date: getLocalDateString(offsetDate(today, -1)) },
      { title: 'Leer capitulo 5 de Clean Code', status: 'TODO', priority: 'MEDIUM', category: 'WORK', project_id: projects[2].id, start_date: todayStr },
      { title: 'Implementar sistema de reportes', status: 'IN_PROGRESS', priority: 'HIGH', category: 'WORK', project_id: projects[0].id, start_date: todayStr },
      { title: 'Planificar vacaciones', status: 'TODO', priority: 'LOW', category: 'PERSONAL', project_id: projects[3].id, start_date: getLocalDateString(offsetDate(today, 5)) },
    ];

    await Promise.all(tasksData.map(t => Task.create({ ...t, user_id: userId } as any)));
    console.log(`✅ Created ${tasksData.length} tasks`);

    // 4. Create Habits
    const habitsData = [
      { name: 'Beber 2L de agua', frequency: [0,1,2,3,4,5,6], color: '#3B82F6', description: 'Mantenerse hidratado durante el día.' },
      { name: 'Meditación 10 min', frequency: [1,3,5], color: '#8B5CF6', description: 'Paz mental antes de empezar a trabajar.' },
      { name: 'Ejercicio diario', frequency: [0,1,2,3,4,5,6], color: '#10B981', description: 'Mínimo 30 minutos de actividad.' },
    ];

    const habits = await Promise.all(habitsData.map(h => Habit.create({ ...h, user_id: userId } as any)));
    console.log(`✅ Created ${habits.length} habits`);

    // Add some logs for habits
    await HabitLog.create({ habit_id: habits[0].id, date: todayStr, is_completed: true } as any);
    await HabitLog.create({ habit_id: habits[0].id, date: getLocalDateString(offsetDate(today, -1)), is_completed: true } as any);
    await HabitLog.create({ habit_id: habits[2].id, date: todayStr, is_completed: false } as any);

    // 5. Create Notes
    const notesData = [
      { title: 'Ideas para el blog', content: '1. Beneficios de Next.js<br>2. Zustand vs Redux<br>3. TypeScript tips.', color: 'yellow', is_important: true },
      { title: 'Receta de Guacamole', content: 'Aguacates, cebolla, tomate, lima y cilantro. No olvidar el jalapeño.', color: 'green', is_important: false },
      { title: 'Feedback de la reunión', content: 'El cliente está muy contento con el buscador global. Sugiere añadir filtros por fecha en el futuro.', color: 'blue', is_important: true },
    ];

    await Promise.all(notesData.map(n => Note.create({ ...n, user_id: userId } as any)));
    console.log(`✅ Created ${notesData.length} notes`);

    // 6. Create Reminders
    const remindersData = [
      { title: 'Cita con el dentista', type: 'reminder', priority: 'high', due_date: getLocalDateString(offsetDate(today, 2)), due_time: '10:00' },
      { title: 'Reunión de planificación', type: 'meeting', priority: 'medium', due_date: todayStr, due_time: '16:30' },
      { title: 'Pagar factura internet', type: 'reminder', priority: 'medium', due_date: todayStr },
    ];

    await Promise.all(remindersData.map(r => Reminder.create({ ...r, user_id: userId } as any)));
    console.log(`✅ Created ${remindersData.length} reminders`);

    console.log('✨ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();