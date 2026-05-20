import subprocess
import time
import os
import sys

# Get the directory where this script is located
base_dir = os.path.dirname(os.path.abspath(__file__))

# Create a local logs directory in the project root
logs_dir = os.path.join(base_dir, "logs")
os.makedirs(logs_dir, exist_ok=True)

# Determine the OS
is_windows = sys.platform.startswith("win")

# Select the maven command wrapper
def get_maven_command(service_dir):
    if service_dir == "app":
        return "mvnw.cmd spring-boot:run" if is_windows else "./mvnw spring-boot:run"
    else:
        return "..\\app\\mvnw.cmd spring-boot:run" if is_windows else "../app/mvnw spring-boot:run"

services = [
    ("naming-server", get_maven_command("naming-server")),
    ("api-gateway", get_maven_command("api-gateway")),
    ("catalog-service", get_maven_command("catalog-service")),
    ("rental-service", get_maven_command("rental-service")),
    ("review-service", get_maven_command("review-service")),
    ("app", get_maven_command("app")),
    ("app/frontend", "npm run dev")
]

print("==================================================")
print("   CampusShare - Servis Baslatici")
print("==================================================")

for service_dir, command in services:
    full_dir = os.path.join(base_dir, service_dir)
    print(f"Starting {service_dir}...")
    
    # Save logs locally in the logs directory
    log_file_name = f"{service_dir.replace('/', '_')}.log"
    log_file_path = os.path.join(logs_dir, log_file_name)
    log_file = open(log_file_path, "w", encoding="utf-8")
    
    if is_windows:
        # On Windows, use CREATE_NEW_CONSOLE to run the process in a new console session, detaching it from the current terminal.
        # This ensures the process stays alive after Python and the current shell exit.
        win_command = f"{command} > \"{log_file_path}\" 2>&1"
        popen_args = {
            "shell": True,
            "cwd": full_dir,
            "creationflags": subprocess.CREATE_NEW_CONSOLE
        }
        subprocess.Popen(win_command, **popen_args)
    else:
        unix_command = f"{command} > \"{log_file_path}\" 2>&1"
        popen_args = {
            "shell": True,
            "cwd": full_dir,
            "start_new_session": True
        }
        subprocess.Popen(unix_command, **popen_args)
    
    if service_dir == "naming-server":
        print("Waiting 15 seconds for naming-server to initialize...")
        time.sleep(15)
    elif service_dir == "api-gateway":
        print("Waiting 10 seconds for api-gateway to initialize...")
        time.sleep(10)
    else:
        time.sleep(3)

print("==================================================")
print(f"All services started successfully in the background.")
print(f"Logs are saved in: {logs_dir}")
print("==================================================")
