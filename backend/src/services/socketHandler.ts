import { Socket } from 'socket.io';

export const socketHandler = (socket: Socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Join roadmap room
  socket.join('roadmap');

  // Handle task creation
  socket.on('task:create', (taskData) => {
    console.log('📝 New task created:', taskData);
    // TODO: Save to database
    socket.broadcast.to('roadmap').emit('task:created', taskData);
  });

  // Handle task update
  socket.on('task:update', (taskData) => {
    console.log('🔄 Task updated:', taskData);
    // TODO: Update database
    socket.broadcast.to('roadmap').emit('task:updated', taskData);
  });

  // Handle task deletion
  socket.on('task:delete', (taskId) => {
    console.log('🗑️ Task deleted:', taskId);
    // TODO: Delete from database
    socket.broadcast.to('roadmap').emit('task:deleted', taskId);
  });

  // Handle progress update
  socket.on('task:progress', (data) => {
    console.log('📊 Progress updated:', data);
    // TODO: Update database
    socket.broadcast.to('roadmap').emit('task:progress:updated', data);
  });

  // Handle filter changes
  socket.on('filter:change', (filters) => {
    console.log('🔍 Filters changed:', filters);
    socket.broadcast.to('roadmap').emit('filters:updated', filters);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
}; 