import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  TextField,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f6fa",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: {
      fontWeight: 600,
      color: "#333",
    },
    body1: {
      color: "#555",
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #e0e0e0",
          padding: "12px 16px",
        },
        head: {
          color: "#666",
          fontWeight: 600,
          fontSize: "1rem",
          backgroundColor: "#f7f9fc",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#f1f3f5",
          },
        },
      },
    },
  },
});

const ContactsTablePage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("firstName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          "https://crm-project-contact-api.onrender.com/api/contacts"
        );
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        } else {
          console.error("Failed to fetch contacts");
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    fetchContacts();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleEditOpen = (contact) => {
    setSelectedContact(contact);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setSelectedContact(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(
        `https://crm-project-contact-api.onrender.com/api/contacts/${selectedContact._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedContact),
        }
      );
      if (response.ok) {
        setContacts((prev) =>
          prev.map((contact) =>
            contact._id === selectedContact._id ? selectedContact : contact
          )
        );
        handleEditClose();
      } else {
        console.error("Failed to update contact");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const handleDeleteOpen = (contact) => {
    setSelectedContact(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
    setSelectedContact(null);
  };

  const handleDeleteSubmit = async () => {
    try {
      const response = await fetch(
        `https://crm-project-contact-api.onrender.com/api/contacts/${selectedContact._id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setContacts((prev) =>
          prev.filter((contact) => contact._id !== selectedContact._id)
        );
        handleDeleteClose();
      } else {
        console.error("Failed to delete contact");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const sortedContacts = contacts.slice().sort((a, b) => {
    if (typeof a[orderBy] === "string" && typeof b[orderBy] === "string") {
      return order === "asc"
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    }
    return order === "asc" ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
  });

  const displayedContacts = sortedContacts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contact List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 1,
          }}
          onClick={() => navigate("/add")}
        >
          Add New Contact
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "First Name",
                  "Last Name",
                  "Email",
                  "Phone Number",
                  "Company",
                  "Job Title",
                ].map((field) => (
                  <TableCell key={field}>
                    <TableSortLabel
                      active={orderBy === field}
                      direction={orderBy === field ? order : "asc"}
                      onClick={() => handleSort(field)}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedContacts.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>{contact.firstName}</TableCell>
                  <TableCell>{contact.lastName}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phoneNumber}</TableCell>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell>{contact.jobTitle}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditOpen(contact)}
                      sx={{
                        border: "1px solid #1976d2",
                        color: "#1976d2",
                        borderRadius: "8px",
                        padding: "5px",
                        marginRight: "8px",
                      }}
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteOpen(contact)}
                      sx={{
                        border: "1px solid #dc004e",
                        color: "#dc004e",
                        borderRadius: "8px",
                        padding: "5px",
                      }}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={contacts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) =>
            setRowsPerPage(parseInt(event.target.value, 10))
          }
        />

        <Dialog open={isEditDialogOpen} onClose={handleEditClose}>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogContent>
            {[
              "First Name",
              "Last Name",
              "Email",
              "Phone Number",
              "Company",
              "JobTitle",
            ].map((field) => (
              <TextField
                key={field}
                margin="dense"
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                fullWidth
                name={field}
                value={selectedContact?.[field] || ""}
                onChange={handleEditChange}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button color="primary" onClick={handleEditSubmit}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onClose={handleDeleteClose}>
          <DialogTitle>Delete Contact</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this contact?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose}>Cancel</Button>
            <Button color="secondary" onClick={handleDeleteSubmit}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ContactsTablePage;
