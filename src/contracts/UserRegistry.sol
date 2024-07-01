pragma solidity >=0.4.21 <0.6.0;

contract UserRegistry {
    struct User {
        string name;
        string email;
        string role;
        bool isRegistered;
    }

    mapping(address => User) private users;

    function registerUser(string memory _name, string memory _email, string memory _role) public {
        require(!users[msg.sender].isRegistered, "User already registered");

        users[msg.sender] = User({
            name: _name,
            email: _email,
            role: _role,
            isRegistered: true
        });
    }

    function getUser(address _userAddress) public view returns (string memory, string memory, string memory, bool) {
        User memory user = users[_userAddress];
        return (user.name, user.email, user.role, user.isRegistered);
    }
}
