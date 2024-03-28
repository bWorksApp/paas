#!/bin/bash

# Đảm bảo đã download aiken và copy vào /usr/bin trong server Linux
# convertAiken.sh git@github.com:jackchuong/test-smart-contract.git aiken-hello-world
# tìm kết quả trong /tmp/aiken_temp.XXXXXX

# Kiểm tra xem đã nhập đủ tham số chưa
if [ "$#" -ne 2 ]; then
	    echo "Usage: $0 <GitHub_Repo_URL> <Path_to_aiken_project>"
	        exit 1
fi

# Lấy tham số dòng lệnh
repo_url=$1
aiken_project_path=$2

# Tạo thư mục tạm trong /tmp
temp_dir=$(mktemp -d "/tmp/aiken_temp.XXXXXX")
cd "$temp_dir" || exit

# Clone repo từ GitHub
git clone "$repo_url" repo || { echo "Failed to clone repository."; exit 1; }

# Di chuyển vào thư mục aiken project
cd "repo/$aiken_project_path" || { echo "Failed to change directory to $aiken_project_path"; exit 1; }

# Kiểm tra xem có lệnh aiken không
if ! command -v aiken &> /dev/null; then
	    echo "Error: 'aiken' command not found. Please make sure it is installed and in your PATH."
	        exit 1
fi

# Chạy lệnh 'aiken build' để tạo plutus.json
aiken build

# Kiểm tra xem lệnh đã thực hiện thành công hay không
if [ $? -eq 0 ]; then
	    echo "Build successful. Output saved as plutus.json"
    else
	        echo "Build failed."
fi

# Xóa thư mục tạm
#rm -rf "$temp_dir"

