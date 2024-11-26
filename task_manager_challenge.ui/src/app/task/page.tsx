"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import {
  CircularProgress,
  Fab,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useAuthContext } from '@/context/AuthContext';
import { API_ROUTES } from '@/constants/api';
import { Task } from '@/types/Tasks';
import RequireAuth from '@/components/RequireAuth';

export default function TasksPage() {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const goToCreate = () => {
    router.push("task/create");
  };

  const handleEdit = (id: string) => {
    console.log(`Edit task with id: ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Delete task with id: ${id}`);
  };
  
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_ROUTES.TASKS, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks from the API
  useEffect(() => {
    if (!user) {
      logout();
      return;
    }

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <CenteredContainer>
        <CircularProgress />
      </CenteredContainer>
    );
  }

  if (!tasks.length) {
    return (
      <Typography variant="h6" align="center" style={{ marginTop: '20px' }}>
        No tasks available.
      </Typography>
    );
  }

  return (
    <RequireAuth>
      <TableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Due Date</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Completed</StyledTableCell>
              <StyledTableCell>Edit</StyledTableCell>
              <StyledTableCell>Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <StyledTableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>{task.description || 'N/A'}</TableCell>
                <TableCell>{task.isCompleted ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(task.id)} // Define the `handleEdit` function to handle clicks
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleDelete(task.id)}
                    color="warning"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>

      <StyledFab aria-label="add-task" onClick={goToCreate}>
        <AddIcon />
      </StyledFab>
    </RequireAuth>
  );
};

// Styled components
const CenteredContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});

const TableWrapper = styled(TableContainer)({
  marginTop: '20px',
  maxWidth: 800,
  margin: '0 auto',
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.grey[100],
  textAlign: 'left',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));