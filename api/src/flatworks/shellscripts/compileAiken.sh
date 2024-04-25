#!/bin/zsh

# make sure aiken is available at /usr/bin
# zsh convertAiken.sh https://github.com/jackchuong/test-smart-contract aiken_code_folder build_dir build_command
# zsh compileAiken.sh https://github.com/aiken-lang/aiken examples/hello_world 123456 'aiken build'
# result file: /tmp/build_dir/repo/plutus.json
# aiken_code_folder = . for project with code at root folder

# Kiểm tra xem đã nhập đủ tham số chưa
if [ "$#" -ne 4 ]; then
	    echo "Usage: $0 <GitHub_Repo_URL> <Path_to_aiken_project>"
	        exit 1
fi

# Lấy tham số dòng lệnh
repo_url=$1
source_code_dir=$2
build_dir=$3
build_command=$4

# Tạo thư mục tạm trong /tmp
mkdir /tmp/${build_dir}
cd /tmp/${build_dir}

# Clone repo từ GitHub
git clone ${repo_url} repo 2>&1 || true

# Di chuyển vào thư mục aiken project
cd repo/${source_code_dir}

# Kiểm tra xem có lệnh aiken không
if ! command -v aiken &> /dev/null; then
	    echo "Error: 'aiken' command not found. Please make sure it is installed and in your PATH."
	        exit 1
fi


#make sure compiled json is generated from build command
rm -rf /tmp/${build_dir}/repo/${source_code_dir}/plutus.json 2>&1 || true

# Chạy lệnh 'aiken build' để tạo plutus.json
echo ${build_command} | zsh 2>&1 || true

# Kiểm tra xem lệnh đã thực hiện thành công hay không
if [ $? -eq 0 ]; then
	    echo "Build successful. Output saved as plutus.json"
    else
	        echo "Build failed."
fi

cat /tmp/${build_dir}/repo/${source_code_dir}/plutus.json 2>&1 || true

# Xóa thư mục tạm
#rm -rf "$temp_dir"

