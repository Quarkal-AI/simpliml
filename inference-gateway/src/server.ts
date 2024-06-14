import app from './app';

app.listen(process.env.PORT, () => {
  console.log(`Server running on port : ${process.env.PORT}`);
}).on('error', (e) => console.error(e));
