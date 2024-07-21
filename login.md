import React, { useRef, useState } from "react";
import Web3 from "web3";
import { firestore } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

export default function LogIn() {
    const [accountAddress, setAccountAddress] = useState('');
    const [role, setRole] = useState('Miner');
    const usernameRef = useRef();
    const passwordRef = useRef();
    const ref = collection(firestore, "users");

    const connectMetaMask = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                setAccountAddress(accounts[0]);
                console.log("Connected account:", accounts[0]);
            } catch (error) {
                console.error("MetaMask connection error:", error);
            }
        } else {
            console.error("MetaMask not detected");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        console.log(username);
        console.log(password);
        console.log("MetaMask address:", accountAddress);
        console.log("Role:", role);

        let data = {
            user: username,
            password: password,
            address: accountAddress,
            role: role
        };

        try {
            await addDoc(ref, data);
            console.log("User successfully added!");
        } catch (e) {
            console.error("Error adding: ", e);
        }
    };

    return (
        <div>
            <button onClick={connectMetaMask}>Connect MetaMask</button>
            {accountAddress && <p>Connected MetaMask address: {accountAddress}</p>}
            <form onSubmit={handleSave}>
                <label>Enter Username</label>
                <input type="text" ref={usernameRef} />
                <label>Enter Password</label>
                <input type="password" ref={passwordRef} />
                <label>Select Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Miner">Miner</option>
                    <option value="Gem Cutter">Gem Cutter</option>
                    <option value="Jeweler">Jeweler</option>
                </select>
                <button type="submit">Save</button>
            </form>
        </div>
    );
}
