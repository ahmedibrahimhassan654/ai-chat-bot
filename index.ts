import concurrently from 'concurrently';

const shell =
   process.platform === 'win32'
      ? process.env.ComSpec ||
        process.env.COMSPEC ||
        `${process.env.SystemRoot || 'C:\\Windows'}\\System32\\cmd.exe`
      : undefined;

concurrently(
   [
      {
         command: 'bun run dev',
         name: 'server',
         cwd: 'packages/server',
         prefixColor: 'blue',
      },
      {
         command: 'bun run dev',
         cwd: 'packages/client',
         name: 'client',
         prefixColor: 'green',
      },
   ],
   { shell }
);
