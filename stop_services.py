import subprocess
import sys

ports = [8061, 8082, 8083, 8084, 8085, 8172, 3000]

is_windows = sys.platform.startswith("win")

print("==================================================")
print("   CampusShare Servisleri Durduruluyor...")
print("==================================================")

for port in ports:
    try:
        if is_windows:
            # Run netstat to find PID
            cmd = f'netstat -ano | findstr :{port}'
            output = subprocess.check_output(cmd, shell=True).decode()
            pids = set()
            for line in output.strip().split('\n'):
                parts = line.strip().split()
                if len(parts) >= 5:
                    # Last part is the PID
                    pids.add(parts[-1])
            for pid in pids:
                if pid != '0':
                    print(f"Port {port} uzerindeki process (PID: {pid}) sonlandiriliyor...")
                    subprocess.call(f'taskkill /F /PID {pid}', shell=True)
        else:
            # On Linux/macOS
            cmd = f'lsof -t -i:{port}'
            output = subprocess.check_output(cmd, shell=True).decode()
            for pid in output.strip().split('\n'):
                if pid:
                    print(f"Port {port} uzerindeki process (PID: {pid}) sonlandiriliyor...")
                    subprocess.call(f'kill -9 {pid}', shell=True)
    except subprocess.CalledProcessError:
        # No process listening on this port
        pass

print("==================================================")
print(" Tum servisler durduruldu.")
print("==================================================")
