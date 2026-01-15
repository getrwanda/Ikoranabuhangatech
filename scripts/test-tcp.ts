import net from 'net';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL || '';
const hostMatch = dbUrl.match(/@([^/:]+)/);
const host = hostMatch ? hostMatch[1] : '';

if (!host) {
  console.error("Could not parse host from DATABASE_URL");
  process.exit(1);
}

console.log(`Testing TCP connection to ${host}:5432...`);

const socket = new net.Socket();
socket.setTimeout(10000); // 10s timeout

socket.connect(5432, host, () => {
  console.log('TCP Connection established successfully!');
  socket.end();
});

socket.on('data', (data) => {
  console.log('Received data:', data);
});

socket.on('error', (err) => {
  console.error('TCP Connection error:', err);
});

socket.on('timeout', () => {
  console.error('TCP Connection timed out');
  socket.destroy();
});

socket.on('close', () => {
  console.log('Connection closed');
});
