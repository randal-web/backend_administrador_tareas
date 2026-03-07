import { Note, NoteCreationAttributes } from './note.model';

export class NoteService {
  static async create(userId: string, data: Partial<NoteCreationAttributes>) {
    const note = await Note.create({
      ...data,
      user_id: userId,
      title: data.title!,
    });
    return note;
  }

  static async getAll(userId: string) {
    return Note.findAll({
      where: { user_id: userId },
      order: [
        ['is_pinned', 'DESC'],
        ['updated_at', 'DESC'],
      ],
    });
  }

  static async getById(noteId: string, userId: string) {
    const note = await Note.findOne({
      where: { id: noteId, user_id: userId },
    });
    if (!note) throw new Error('Nota no encontrada');
    return note;
  }

  static async update(noteId: string, userId: string, data: Partial<NoteCreationAttributes>) {
    const note = await Note.findOne({ where: { id: noteId, user_id: userId } });
    if (!note) throw new Error('Nota no encontrada');
    await note.update(data);
    return note;
  }

  static async delete(noteId: string, userId: string) {
    const note = await Note.findOne({ where: { id: noteId, user_id: userId } });
    if (!note) throw new Error('Nota no encontrada');
    await note.destroy();
    return { message: 'Nota eliminada correctamente' };
  }

  static async togglePin(noteId: string, userId: string) {
    const note = await Note.findOne({ where: { id: noteId, user_id: userId } });
    if (!note) throw new Error('Nota no encontrada');
    await note.update({ is_pinned: !note.is_pinned });
    return note;
  }
}
