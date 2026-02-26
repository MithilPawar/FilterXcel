import { execSync } from "child_process";

const port = process.argv[2] || "5000";

const killPid = (pid) => {
  if (!pid) return;

  try {
    if (process.platform === "win32") {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
    } else {
      execSync(`kill -9 ${pid}`, { stdio: "ignore" });
    }
    console.log(`Freed port ${port} by killing PID ${pid}`);
  } catch {
    console.log(`Could not kill PID ${pid} on port ${port}`);
  }
};

try {
  if (process.platform === "win32") {
    const output = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
    const lines = output.split(/\r?\n/).filter(Boolean);

    const pids = new Set(
      lines
        .filter((line) => /LISTENING/i.test(line))
        .map((line) => line.trim().split(/\s+/).pop())
        .filter(Boolean)
    );

    if (!pids.size) {
      console.log(`No process found listening on port ${port}`);
      process.exit(0);
    }

    pids.forEach(killPid);
  } else {
    const output = execSync(`lsof -ti tcp:${port}`, { encoding: "utf8" });
    const pids = output.split(/\r?\n/).filter(Boolean);

    if (!pids.length) {
      console.log(`No process found listening on port ${port}`);
      process.exit(0);
    }

    pids.forEach(killPid);
  }
} catch {
  console.log(`No process found listening on port ${port}`);
}
