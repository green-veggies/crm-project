const app = require('./app');

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
