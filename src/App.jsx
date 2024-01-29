import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import backgroundImage from './bejr.jpg';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: url(${backgroundImage}) center/cover no-repeat;
  font-family: Arial, sans-serif;
`;

const TodoContainer = styled.div`
  width: 525px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const CategoryInput = styled(Input)`
  margin-right: 10px;
`;

const AddButton = styled.button`
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TaskItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;

  // Přidáváme styl pro dokončený úkol
  ${(props) => props.completed && 'text-decoration: line-through;'}

  div {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const RemoveButton = styled.button`
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const CancelButton = styled.button`
  background-color: #f0ad4e; // Oranžová barva
  color: #fff;
  border: none;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #ec971f;
  }
`;

const EditButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const StyledH2 = styled.h2`
  color: red;
  font-weight: normal;
`;

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [categoryText, setCategoryText] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (taskText.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: taskText, category: categoryText, completed: false }]);
      setTaskText('');
      setCategoryText('');
    }
  };

  const handleRemoveTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const handleToggleCompleted = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setEditTaskId(taskId);
      setEditTaskText(taskToEdit.text);
    }
  };

  const handleSaveEdit = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editTaskId ? { ...task, text: editTaskText } : task
    );
    setTasks(updatedTasks);
    setEditTaskId(null);
    setEditTaskText('');
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setEditTaskText('');
  };

  const filteredTasks = showCompleted ? tasks : tasks.filter((task) => !task.completed);

  return (
    <AppContainer>
      <TodoContainer>
        <h1>Todos Listos</h1>
        <StyledH2>by Bejrosák Dan</StyledH2>
        <InputContainer>
          <Input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Nový úkol"
          />
          <CategoryInput
            type="text"
            value={categoryText}
            onChange={(e) => setCategoryText(e.target.value)}
            placeholder="Kategorie"
          />
          <AddButton onClick={handleAddTask}>Přidat úkol</AddButton>
        </InputContainer>
        <label>
          <input type="checkbox" checked={showCompleted} onChange={() => setShowCompleted(!showCompleted)} />
          Zobrazit dokončené úkoly
        </label>
        <TaskList>
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} completed={task.completed}>
              <div>
                <Checkbox type="checkbox" checked={task.completed} onChange={() => handleToggleCompleted(task.id)} />
                {editTaskId === task.id ? (
                  <>
                    <Input
                      type="text"
                      value={editTaskText}
                      onChange={(e) => setEditTaskText(e.target.value)}
                      autoFocus
                    />
                    <EditButton onClick={handleSaveEdit}>Uložit</EditButton>
                    <EditButton onClick={handleCancelEdit}>Zrušit</EditButton>
                  </>
                ) : (
                  <>
                    <strong>{task.text}</strong>
                    {task.category && <span style={{ marginLeft: '10px', color: '#888' }}>({task.category})</span>}
                    <EditButton onClick={() => handleEditTask(task.id)}>Upravit</EditButton>
                  </>
                )}
              </div>
              <RemoveButton onClick={() => handleRemoveTask(task.id)}>Odstranit</RemoveButton>
            </TaskItem>
          ))}
        </TaskList>
      </TodoContainer>
    </AppContainer>
  );
};

export default TodoApp;
