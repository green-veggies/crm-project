import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  createTheme,
  ThemeProvider,
} from "@mui/material";
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
    h5: {
      fontWeight: 600,
      color: "#333",
    },
    body1: {
      color: "#555",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "16px",
          "& .MuiInputBase-root": {
            borderRadius: "8px",
            backgroundColor: "#ffffff",
          },
          "& .MuiInputLabel-root": {
            color: "#666",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 0",
        },
      },
    },
  },
});

const ContactForm = () => {
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    company: "",
    jobTitle: "",
  });

  const [errors, setErrors] = useState({
    phoneNumber: "",
    company: "",
    jobTitle: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!contact.phoneNumber || contact.phoneNumber.length !== 10) {
      newErrors.phoneNumber = "Phone number must be 10 digits long";
    }
    if (!contact.company) {
      newErrors.company = "Company is required";
    }
    if (!contact.jobTitle) {
      newErrors.jobTitle = "Job Title is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const response = await fetch(
        `https://crm-project-contact-api.onrender.com/api/contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contact),
        }
      );

      if (response.ok) {
        console.log("Contact Submitted:", contact);
        navigate("/");
      } else {
        console.error("Failed to submit contact");
      }
    } catch (error) {
      console.error("Error submitting contact:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 5,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" textAlign="center" mb={3}>
          Add New Contact
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={contact.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={contact.lastName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={contact.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={contact.phoneNumber}
            onChange={handleChange}
            required
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
          />
          <TextField
            fullWidth
            label="Company"
            name="company"
            value={contact.company}
            onChange={handleChange}
            required
            error={!!errors.company}
            helperText={errors.company}
          />
          <TextField
            fullWidth
            label="Job Title"
            name="jobTitle"
            value={contact.jobTitle}
            onChange={handleChange}
            required
            error={!!errors.jobTitle}
            helperText={errors.jobTitle}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Add Contact
          </Button>
        </form>
      </Box>
    </ThemeProvider>
  );
};

export default ContactForm;