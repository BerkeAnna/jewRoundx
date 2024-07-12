pragma solidity >=0.4.21 <0.6.0;

contract UserRegistry {
    struct User {
        address userAddress;
        string username;
        string role;
        bool isRegistered;
    }

    mapping(address => User) private users;

    event UserRegistered(address userAddress, string username, string role);

    function registerUser(string memory _username, string memory _role) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        users[msg.sender] = User(msg.sender, _username, _role, true);
        emit UserRegistered(msg.sender, _username, _role);
    }

    function isUserRegistered(address _userAddress) public view returns (bool) {
        return users[_userAddress].isRegistered;
    }

    function getUsername(address _userAddress) public view returns (string memory) {
        require(users[_userAddress].isRegistered, "User not registered");
        return users[_userAddress].username;
    }

    function getUserRole(address _userAddress) public view returns (string memory) {
        require(users[_userAddress].isRegistered, "User not registered");
        return users[_userAddress].role;
    }

    function getUserInfo(address _userAddress) public view returns (address, string memory, string memory) {
        require(users[_userAddress].isRegistered, "User not registered");
        User memory user = users[_userAddress];
        return (user.userAddress, user.username, user.role);
    }
}
