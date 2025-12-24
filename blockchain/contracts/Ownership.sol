// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ownership {
    struct File {
        string fileName;
        string fileHash; // IPFS CID
        address owner;
        uint256 timestamp;
    }

    mapping(address => File[]) private userFiles;
    mapping(address => mapping(string => mapping(address => bool))) private accessList;

    event FileUploaded(address indexed owner, string indexed fileHash, string fileName, uint256 timestamp);
    event AccessGranted(address indexed owner, string indexed fileHash, address indexed user);
    event AccessRevoked(address indexed owner, string indexed fileHash, address indexed user);

    function uploadFile(string memory _fileName, string memory _fileHash) external {
        require(bytes(_fileName).length > 0, "File name required");
        require(bytes(_fileHash).length > 0, "File hash (CID) required");

        userFiles[msg.sender].push(
            File({fileName: _fileName, fileHash: _fileHash, owner: msg.sender, timestamp: block.timestamp})
        );

        emit FileUploaded(msg.sender, _fileHash, _fileName, block.timestamp);
    }

    function grantAccess(string memory _fileHash, address _user) external {
        require(_user != address(0), "Invalid user");
        require(_user != msg.sender, "Owner already has access");
        require(_isOwnerOf(msg.sender, _fileHash), "Not owner of file");

        accessList[msg.sender][_fileHash][_user] = true;
        emit AccessGranted(msg.sender, _fileHash, _user);
    }

    function revokeAccess(string memory _fileHash, address _user) external {
        require(_user != address(0), "Invalid user");
        require(_isOwnerOf(msg.sender, _fileHash), "Not owner of file");

        accessList[msg.sender][_fileHash][_user] = false;
        emit AccessRevoked(msg.sender, _fileHash, _user);
    }

    function hasAccess(string memory _fileHash, address _user) public view returns (bool) {
        if (_user == msg.sender && _isOwnerOf(msg.sender, _fileHash)) {
            return true;
        }
        return accessList[msg.sender][_fileHash][_user];
    }

    function getFile(uint256 _index) public view returns (string memory, string memory, uint256) {
        require(_index < userFiles[msg.sender].length, "Index out of bounds");
        File storage f = userFiles[msg.sender][_index];
        return (f.fileName, f.fileHash, f.timestamp);
    }

    function getMyFilesCount() public view returns (uint256) {
        return userFiles[msg.sender].length;
    }

    function _isOwnerOf(address _owner, string memory _fileHash) internal view returns (bool) {
        File[] storage files = userFiles[_owner];
        for (uint256 i = 0; i < files.length; i++) {
            if (keccak256(bytes(files[i].fileHash)) == keccak256(bytes(_fileHash))) {
                return true;
            }
        }
        return false;
    }
}

