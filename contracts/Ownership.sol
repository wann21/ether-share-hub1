// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Ownership
 * @notice Manages ownership and permission control for files stored on IPFS (by CID).
 * @dev Stores file metadata on-chain and provides access-control primitives.
 */
contract Ownership {
    /// @notice Metadata for a file stored on IPFS
    struct File {
        string fileName;
        string fileHash; // IPFS CID
        address owner;
        uint256 timestamp;
    }

    /// @dev Mapping of user address to their uploaded files
    mapping(address => File[]) private userFiles;

    /// @dev Access control: owner => fileHash => user => allowed
    mapping(address => mapping(string => mapping(address => bool))) private accessList;

    /// @notice Emitted when a file is uploaded
    event FileUploaded(address indexed owner, string indexed fileHash, string fileName, uint256 timestamp);

    /// @notice Emitted when access is granted
    event AccessGranted(address indexed owner, string indexed fileHash, address indexed user);

    /// @notice Emitted when access is revoked
    event AccessRevoked(address indexed owner, string indexed fileHash, address indexed user);

    /**
     * @notice Upload file metadata to the blockchain.
     * @param _fileName Human-readable file name.
     * @param _fileHash IPFS CID returned after uploading the file to IPFS.
     * @dev Sender becomes the file owner. Records timestamp using block.timestamp.
     */
    function uploadFile(string memory _fileName, string memory _fileHash) external {
        require(bytes(_fileName).length > 0, "File name required");
        require(bytes(_fileHash).length > 0, "File hash (CID) required");

        userFiles[msg.sender].push(
            File({fileName: _fileName, fileHash: _fileHash, owner: msg.sender, timestamp: block.timestamp})
        );

        emit FileUploaded(msg.sender, _fileHash, _fileName, block.timestamp);
    }

    /**
     * @notice Grant access to a specific user for a file owned by the sender.
     * @param _fileHash IPFS CID of the file.
     * @param _user Address to grant access to.
     * @dev Only the owner (sender) of the file can grant access.
     */
    function grantAccess(string memory _fileHash, address _user) external {
        require(_user != address(0), "Invalid user");
        require(_user != msg.sender, "Owner already has access");
        require(_isOwnerOf(msg.sender, _fileHash), "Not owner of file");

        accessList[msg.sender][_fileHash][_user] = true;
        emit AccessGranted(msg.sender, _fileHash, _user);
    }

    /**
     * @notice Revoke access from a specific user for a file owned by the sender.
     * @param _fileHash IPFS CID of the file.
     * @param _user Address to revoke access from.
     * @dev Only the owner (sender) of the file can revoke access.
     */
    function revokeAccess(string memory _fileHash, address _user) external {
        require(_user != address(0), "Invalid user");
        require(_isOwnerOf(msg.sender, _fileHash), "Not owner of file");

        accessList[msg.sender][_fileHash][_user] = false;
        emit AccessRevoked(msg.sender, _fileHash, _user);
    }

    /**
     * @notice Check if a user has access to a file owned by the caller.
     * @param _fileHash IPFS CID of the file.
     * @param _user Address to check for access.
     * @return True if the user is the owner (caller) for this file or has been granted access.
     * @dev This function checks permissions in the context of the caller as the owner.
     */
    function hasAccess(string memory _fileHash, address _user) public view returns (bool) {
        if (_user == msg.sender && _isOwnerOf(msg.sender, _fileHash)) {
            return true;
        }
        return accessList[msg.sender][_fileHash][_user];
    }

    /**
     * @notice Get file metadata by index from the caller's uploads.
     * @param _index Index within the caller's file list.
     * @return fileName, fileHash, timestamp
     */
    function getFile(uint256 _index) public view returns (string memory, string memory, uint256) {
        require(_index < userFiles[msg.sender].length, "Index out of bounds");
        File storage f = userFiles[msg.sender][_index];
        return (f.fileName, f.fileHash, f.timestamp);
    }

    /**
     * @notice Get the total number of files uploaded by the caller.
     * @return Count of files uploaded by msg.sender.
     */
    function getMyFilesCount() public view returns (uint256) {
        return userFiles[msg.sender].length;
    }

    /**
     * @dev Internal helper to verify ownership of a file by CID.
     * @param _owner Address claimed to own the file.
     * @param _fileHash IPFS CID.
     * @return True if the owner has uploaded at least one file with this CID.
     */
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

