import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import './KanbanBoard.css';

const COLUMNS = [
  { key: 'ToDo',       title: 'To Do' },
  { key: 'InProgress', title: 'In Progress' },
  { key: 'Done',       title: 'Done' },
];

const KanbanBoard = ({ itemsByStatus, onMove, onSelect }) => {
  const handleEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    onMove?.({
      taskId: draggableId,                    
      from: source.droppableId,
      to: destination.droppableId,
      toIndex: destination.index,
    });
  };

  return (
    <DragDropContext onDragEnd={handleEnd}>
      <div className="kanban-bg">
        <div className="kanban-container">
          <div className="kanban-board">
            {COLUMNS.map(col => {
              const list = itemsByStatus?.[col.key] || [];
              return (
                <div className="kanban-column" key={col.key}>
                  <div className="kanban-column-title">{col.title}</div>
                  <Droppable droppableId={col.key} type="TASK">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {list.map((t, idx) => {
                          const id = String(t.id ?? t.Id ?? `${col.key}-${idx}`);
                          return (
                            <Draggable draggableId={id} index={idx} key={id}>
                              {(p) => (
                                <div
                                  ref={p.innerRef}
                                  {...p.draggableProps}
                                  {...p.dragHandleProps}
                                  className="kanban-task"
                                  onClick={() => onSelect?.(t.id ?? t.Id)}
                                >
                                  <TaskCard t={t} />
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
