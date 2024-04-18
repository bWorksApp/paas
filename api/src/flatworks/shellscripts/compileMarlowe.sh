#!/bin/zsh

# Đảm bảo đã download marlowe-cli và copy vào /usr/bin trong server Linux
# convertMarlowe.sh https://github.com:jackchuong/test-smart-contract.git contract.marlowe build_dir
# tìm kết quả trong /tmp/build_dir/repo/contract.json

# Kiểm tra xem đã nhập đủ tham số chưa
if [ "$#" -ne 3 ]; then
	    echo "Usage: $0 <GitHub_Repo_URL> <Path_to_contract.marlowe>"
	        exit 1
fi

# Lấy tham số dòng lệnh
repo_url=$1
marlowe_file_path=$2
build_dir=$3


mkdir /tmp/${build_dir}
cd /tmp/${build_dir}

# Clone repo từ GitHub
git clone "${repo_url}" repo 2>&1 || true

# Di chuyển vào thư mục repo
cd repo || exit

# Kiểm tra xem contract.marlowe có tồn tại không
if [ ! -f "${marlowe_file_path}" ]; then
	    echo "File ${marlowe_file_path} not found in repository."
	        exit 1
fi


#make sure compiled json is generated from build command
rm -rf /tmp/${build_dir}/repo/contract.json 2>&1 || true


# Chạy lệnh marlowe-cli để chuyển đổi contract.marlowe thành contract.json
marlowe-cli format --in-file "${marlowe_file_path}" --out-file contract.json 2>&1 || true

# Kiểm tra xem lệnh đã thực hiện thành công hay không
if [ $? -eq 0 ]; then
	    echo "Conversion successful. Output saved as contract.json"
    else
	        echo "Conversion failed."
fi

cat /tmp/${build_dir}/repo/contract.json 2>&1 || true
# Xóa thư mục tạm
#rm -rf "$temp_dir"

