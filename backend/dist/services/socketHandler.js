"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = void 0;
const socketHandler = (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    socket.join('roadmap');
    socket.on('task:create', (taskData) => {
        console.log('📝 New task created:', taskData);
        socket.broadcast.to('roadmap').emit('task:created', taskData);
    });
    socket.on('task:update', (taskData) => {
        console.log('🔄 Task updated:', taskData);
        socket.broadcast.to('roadmap').emit('task:updated', taskData);
    });
    socket.on('task:delete', (taskId) => {
        console.log('🗑️ Task deleted:', taskId);
        socket.broadcast.to('roadmap').emit('task:deleted', taskId);
    });
    socket.on('task:progress', (data) => {
        console.log('📊 Progress updated:', data);
        socket.broadcast.to('roadmap').emit('task:progress:updated', data);
    });
    socket.on('filter:change', (filters) => {
        console.log('🔍 Filters changed:', filters);
        socket.broadcast.to('roadmap').emit('filters:updated', filters);
    });
    socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
};
exports.socketHandler = socketHandler;
//# sourceMappingURL=socketHandler.js.map