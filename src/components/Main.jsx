import React, { useContext, useState, useEffect } from 'react';
import { MoreHorizontal, UserPlus, Edit2 } from 'react-feather';
import CardAdd from './CardAdd';
import { BoardContext } from '../context/BoardContext';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import AddList from './AddList';
import Utils from '../utils/Utils';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';

// TaskModal Component
const TaskModal = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState(task.title || '');
  const [status, setStatus] = useState(task.status || 'Not Started');
  const [description, setDescription] = useState(task.description || '');

  const handleSave = () => {
    const updatedTask = { ...task, title, status, description };
    onSave(updatedTask); // Save the task with updated status
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ zIndex: 9999 }}>
    <div className="bg-white p-4 rounded shadow-lg w-96">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Task</h2>
      <div className="mb-4">
        <label className="block mb-1 font-bold text-gray-900">Title</label>
        <input
          className="border rounded w-full p-2 text-gray-900 font-bold"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-bold text-gray-900">Status</label>
        <select
          className="border rounded w-full p-2 text-gray-900 font-bold"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-bold text-gray-900">Description</label>
        <textarea
          className="border rounded w-full p-2 text-gray-900 font-bold"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <button
          className="bg-gray-200 px-4 py-2 mr-2 rounded hover:bg-gray-400"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  </div>
  
  );
};

// Main Component
const Main = () => {
  const { allboard, setAllBoard } = useContext(BoardContext);
  const bdata = allboard.boards[allboard.active];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Handle task save and moving to the correct list

  useEffect(() => {
    const savedBoardData = localStorage.getItem('boardData');
    if (savedBoardData) {
      setAllBoard(JSON.parse(savedBoardData));
    }
  }, []);

  // Store board data in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('boardData', JSON.stringify(allboard));
  }, [allboard]);
  const handleTaskSave = (updatedTask) => {
    const updatedList = bdata.list.map((list) => {
      list.items = list.items.filter((task) => task.id !== updatedTask.id); // Remove task from current list
      return list;
    });

    // Find the correct list based on status
    const statusList =
      updatedTask.status === 'Not Started'
        ? 0
        : updatedTask.status === 'In Progress'
        ? 1
        : 2;

    updatedList[statusList].items.push(updatedTask); // Add to new status list

    let updatedBoard = { ...allboard };
    updatedBoard.boards[updatedBoard.active].list = updatedList;
    setAllBoard(updatedBoard);
  };

  const onDragEnd = (res) => {
    if (!res.destination) {
      console.log('No Destination');
      return;
    }
    const newList = [...bdata.list];
    const s_id = parseInt(res.source.droppableId);
    const d_id = parseInt(res.destination.droppableId);
    const [removed] = newList[s_id - 1].items.splice(res.source.index, 1);
    newList[d_id - 1].items.splice(res.destination.index, 0, removed);

    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);
  };

  const cardData = (e, ind) => {
    let newList = [...bdata.list];
    newList[ind].items.push({ id: Utils.makeid(5), title: e });

    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);
  };

  const listData = (e) => {
    let newList = [...bdata.list];
    newList.push({ id: newList.length + 1 + '', title: e, items: [] });

    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);
  };

  return (
    <div
      className="flex flex-col w-full"
      style={{ backgroundColor: `${bdata.bgcolor}` }}
    >
      <div className="p-3 bg-black flex justify-between w-full bg-opacity-50">
        <h2 className="text-lg">{bdata.name}</h2>
        <div className="flex items-center justify-center">
          <button className="bg-gray-200 h-8 text-gray-800 px-2 py-1 mr-2 rounded flex justify-center items-center">
            <UserPlus size={16} className="mr-2"></UserPlus>
            Share
          </button>
          <button className="hover:bg-gray-500 px-2 py-1 h-8 rounded">
            <MoreHorizontal size={16}></MoreHorizontal>
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full flex-grow relative">
        <div className="absolute mb-1 pb-2 left-0 right-0 top-0 bottom-0 p-3 flex overflow-x-scroll overflow-y-hidden">
          <DragDropContext onDragEnd={onDragEnd}>
            {bdata.list &&
              bdata.list.map((x, ind) => {
                return (
                  <div
                    key={ind}
                    className="mr-3 w-60 h-fit rounded-md p-2 bg-black flex-shrink-0"
                  >
                    <div className="list-body">
                      <div className="flex justify-between p-1">
                        <span>{x.title}</span>
                        <button className="hover:bg-gray-500 p-1 rounded-sm">
                          <MoreHorizontal size={16}></MoreHorizontal>
                        </button>
                      </div>
                      <Droppable droppableId={x.id}>
                        {(provided, snapshot) => (
                          <div
                            className="py-1"
                            ref={provided.innerRef}
                            style={{
                              backgroundColor: snapshot.isDraggingOver
                                ? '#222'
                                : 'transparent',
                            }}
                            {...provided.droppableProps}
                          >
                            {x.items &&
                              x.items.map((item, index) => {
                                return (
                                  <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <div
                                          className="item flex justify-between items-center bg-zinc-700 p-1 cursor-pointer rounded-md border-2 border-zinc-900 hover:border-gray-500"
                                          onClick={() => {
                                            setSelectedTask(item); // Store the current task
                                            setIsModalOpen(true); // Open the modal
                                          }}
                                        >
                                          <span>{item.title}</span>
                                          <span className="flex justify-start items-start">
                                            <button className="hover:bg-gray-600 p-1 rounded-sm">
                                              <Edit2 size={16}></Edit2>
                                            </button>
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      {/* Add card count here */}
                      <div className="text-gray-400 text-sm mt-2">
                        {`Total Number of Cards: ${x.items.length}`}
                      </div>
                      <CardAdd getcard={(e) => cardData(e, ind)}></CardAdd>
                    </div>
                  </div>
                );
              })}
          </DragDropContext>
          <AddList getlist={(e) => listData(e)}></AddList>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setIsModalOpen(false)}
          onSave={handleTaskSave} // Pass the save handler to update the task
        />
      )}
    </div>
  );
};

export default Main;
