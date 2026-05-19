import subprocess
import time
import os

base_dir = "/Users/aligedik/Desktop/ymprojeodevi"

services = [
    ("naming-server", "../app/mvnw spring-boot:run"),
    ("api-gateway", "../app/mvnw spring-boot:run"),
    ("catalog-service", "../app/mvnw spring-boot:run"),
    ("rental-service", "../app/mvnw spring-boot:run"),
    ("review-service", "../app/mvnw spring-boot:run"),
    ("app", "./mvnw spring-boot:run"),
    ("app/frontend", "npm run dev")
]

for service_dir, command in services:
    full_dir = os.path.join(base_dir, service_dir)
    print(f"Starting {service_dir}...")
    log_file = open(f"/tmp/{service_dir.replace('/', '_')}.log", "w")
    # start_new_session=True creates a new process group, making it immune to parent termination
    subprocess.Popen(
        command,
        shell=True,
        cwd=full_dir,
        stdout=log_file,
        stderr=subprocess.STDOUT,
        start_new_session=True
    )
    if service_dir == "naming-server":
        time.sleep(15)
    elif service_dir == "api-gateway":
        time.sleep(10)
    else:
        time.sleep(3)

print("All services started successfully and detached from terminal.")
