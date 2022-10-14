// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;


contract Todos {
    enum Priority {
        LOW,
        MEDIUM,
        HIGH
    }

    struct Chore {
        string title;
        string notes;
        Priority priority;
        uint64 timestamp;
        bool completed;
    }

    mapping (address => Chore[]) private users;

    event Task(Chore chore);
    event RemoveTask(uint256 choreIndx);

    
    function addChore(string calldata _title, string calldata _notes, Priority _priority, uint64 _timestamp) external {
        uint length = users[msg.sender].length;
        users[msg.sender].push(Chore(_title, _notes, _priority, _timestamp, false));

        emit Task(users[msg.sender][length]);
    }

    function updateChore(
        uint256 _choreIndx, string calldata _title, string calldata _notes, Priority _priority, uint64 _timestamp
    ) external {
        require(users[msg.sender][_choreIndx].timestamp != 0, "chore do not exist");

        users[msg.sender][_choreIndx] = Chore(
            _title, _notes,
            _priority, _timestamp,
            users[msg.sender][_choreIndx].completed
        );

        emit Task(users[msg.sender][_choreIndx]);
    }

    function updateStatus(uint256 _choreIndx, bool completed) external {
        require(users[msg.sender][_choreIndx].timestamp != 0, "chore do not exist");

        users[msg.sender][_choreIndx].completed = completed;

        emit Task(users[msg.sender][_choreIndx]);
    }

    function getChore(uint256 _choreIndx) external view returns (Chore memory) {
        return users[msg.sender][_choreIndx];
    }

    function getChores() external view returns (Chore[] memory) {
        return users[msg.sender];
    }
    
    function deleteChore(uint256 _choreIndx) external {
        delete users[msg.sender][_choreIndx];
        emit RemoveTask(_choreIndx);
    }
}
