#!/bin/zsh

# make sure aiken is available at /usr/bin
# zsh convertAiken.sh https://github.com/jackchuong/test-smart-contract build_dir
# result file: /tmp/build_dir/repo/plutus.json

# Kiểm tra xem đã nhập đủ tham số chưa
if [ "$#" -ne 2 ]; then
	    echo "Usage: $0 <GitHub_Repo_URL> <Path_to_aiken_project>"
	        exit 1
fi

# Lấy tham số dòng lệnh
repo_url=$1

# Tạo thư mục tạm trong /tmp
temp_dir=/tmp/${build_dir}
cd ${temp_dir} || exit

# Clone repo từ GitHub
git clone ${repo_url} repo || { echo "Failed to clone repository."; exit 1; }

# Di chuyển vào thư mục aiken project
cd repo || { echo "Failed to clone aiken repo"; exit 1; }

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

