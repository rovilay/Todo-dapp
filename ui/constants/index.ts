export const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "choreIndx",
        "type": "uint256"
      }
    ],
    "name": "RemoveTask",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "notes",
            "type": "string"
          },
          {
            "internalType": "enum Todos.Priority",
            "name": "priority",
            "type": "uint8"
          },
          {
            "internalType": "uint64",
            "name": "timestamp",
            "type": "uint64"
          },
          {
            "internalType": "bool",
            "name": "completed",
            "type": "bool"
          }
        ],
        "indexed": false,
        "internalType": "struct Todos.Chore",
        "name": "chore",
        "type": "tuple"
      }
    ],
    "name": "Task",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_notes",
        "type": "string"
      },
      {
        "internalType": "enum Todos.Priority",
        "name": "_priority",
        "type": "uint8"
      },
      {
        "internalType": "uint64",
        "name": "_timestamp",
        "type": "uint64"
      }
    ],
    "name": "addChore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_choreIndx",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_notes",
        "type": "string"
      },
      {
        "internalType": "enum Todos.Priority",
        "name": "_priority",
        "type": "uint8"
      },
      {
        "internalType": "uint64",
        "name": "_timestamp",
        "type": "uint64"
      }
    ],
    "name": "updateChore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_choreIndx",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "completed",
        "type": "bool"
      }
    ],
    "name": "updateStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_choreIndx",
        "type": "uint256"
      }
    ],
    "name": "getChore",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "notes",
            "type": "string"
          },
          {
            "internalType": "enum Todos.Priority",
            "name": "priority",
            "type": "uint8"
          },
          {
            "internalType": "uint64",
            "name": "timestamp",
            "type": "uint64"
          },
          {
            "internalType": "bool",
            "name": "completed",
            "type": "bool"
          }
        ],
        "internalType": "struct Todos.Chore",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getChores",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "notes",
            "type": "string"
          },
          {
            "internalType": "enum Todos.Priority",
            "name": "priority",
            "type": "uint8"
          },
          {
            "internalType": "uint64",
            "name": "timestamp",
            "type": "uint64"
          },
          {
            "internalType": "bool",
            "name": "completed",
            "type": "bool"
          }
        ],
        "internalType": "struct Todos.Chore[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_choreIndx",
        "type": "uint256"
      }
    ],
    "name": "deleteChore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const CONTRACT_ADDRESS = '0x18C7688dDDC9388A49138969A59E2048584aA388'
