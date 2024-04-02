#!/bin/zsh

# Đảm bảo đã download marlowe-cli và copy vào /usr/bin trong server Linux
# convertMarlowe.sh https://github.com/jackchuong/test-smart-contract.git contract.marlowe
# tìm kết quả trong /tmp/marlowe_temp.XXXXXX

# Kiểm tra xem đã nhập đủ tham số chưa
if [ "$#" -ne 2 ]; then
	    echo "Usage: $0 <GitHub_Repo_URL> <Path_to_contract.marlowe>"
	        exit 1
fi

# Lấy tham số dòng lệnh
repo_url=$1
marlowe_file_path=$2

# Tạo thư mục tạm để clone repo
temp_dir=$(mktemp -d "/tmp/marlowe_temp.XXXXXX")
cd "$temp_dir" || exit

# Clone repo từ GitHub
git clone "$repo_url" repo || { echo "Failed to clone repository."; exit 1; }

# Di chuyển vào thư mục repo
cd repo || exit

# Kiểm tra xem contract.marlowe có tồn tại không
if [ ! -f "$marlowe_file_path" ]; then
	    echo "File $marlowe_file_path not found in repository."
	        exit 1
fi

# Chạy lệnh marlowe-cli để chuyển đổi contract.marlowe thành contract.json
marlowe-cli format --in-file "$marlowe_file_path" --out-file contract.json

# Kiểm tra xem lệnh đã thực hiện thành công hay không
if [ $? -eq 0 ]; then
	    echo "Conversion successful. Output saved as contract.json"
    else
	        echo "Conversion failed."
fi

# Show nội dung json
echo -n "contract.json content:\n" && \
cat $temp_dir/repo/contract.json && echo -e "\n"

# Xóa thư mục tạm
rm -rf "$temp_dir"

