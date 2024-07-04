pragma solidity >=0.4.21 <0.6.0;

contract UserRegistry {
    struct User {
        address userAddress;
        string username;
        bool isRegistered;
    }

    mapping(address => User) private users;

    event UserRegistered(address userAddress, string username);

    function registerUser(string memory _username) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        users[msg.sender] = User(msg.sender, _username, true);
        emit UserRegistered(msg.sender, _username);
    }

    function isUserRegistered(address _userAddress) public view returns (bool) {
        return users[_userAddress].isRegistered;
    }

    function getUsername(address _userAddress) public view returns (string memory) {
        require(users[_userAddress].isRegistered, "User not registered");
        return users[_userAddress].username;
    }
}
