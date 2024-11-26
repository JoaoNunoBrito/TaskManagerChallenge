"use client"

import React, { useEffect, useState } from 'react';
import { TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuthContext } from '@/context/AuthContext';
import { API_ROUTES } from '@/constants/api';
import { CreateTask } from '@/types/Tasks';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';


const CreateTaskPage = () => {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const [task, setTask] = useState<CreateTask>({
    title: '',
    dueDate: '',
    description: '',
    isCompleted: false,
  });

  useEffect(() => {
    if (!user) {
      logout();
      return;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setTask((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(API_ROUTES.TASKS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        alert('Task created successfully');
        router.push("/");
      } else {
        alert('Error creating task');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the task');
    }
  };

  return (
    <RequireAuth>
      <FormContainer onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={task.title}
          onChange={handleChange}
          name="title"
          required
        />
        <TextField
          label="Due Date"
          type="datetime-local"
          variant="outlined"
          fullWidth
          value={task.dueDate}
          onChange={handleChange}
          name="dueDate"
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={task.description}
          onChange={handleChange}
          name="description"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={task.isCompleted}
              onChange={handleChange}
              name="isCompleted"
            />
          }
          label="Completed"
        />
        <StyledButton type="submit" variant="contained" color="primary">
          Create Task
        </StyledButton>
      </FormContainer>
    </RequireAuth>
  );
};

const FormContainer = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto',
  padding: '20px',
  gap: '16px',
});

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));


export default CreateTaskPage;