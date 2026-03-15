# shortlink

## How to start
1. Install dependencies

```bash
npm install
```

2. Build and start

```bash
npm run build
pm2 start ecosystem.config.cjs
```

3. Save pm2 process

```bash
pm2 save
```

## pm2 commands
- `pm2 list`: List all processes managed by pm2.
- `pm2 logs`: View logs of all processes.
- `pm2 stop <id|name>`: Stop a specific process by its ID or name.
- `pm2 restart <id|name>`: Restart a specific process by its ID or name.
- `pm2 delete <id|name>`: Delete a specific process by its ID or name.
- `pm2 save`: Save the current process list for automatic startup on system boot.