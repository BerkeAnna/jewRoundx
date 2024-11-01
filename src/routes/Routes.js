import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../components/common/Dashboard';
import LoggedIn from '../components/user/LoggedIn';
import Repair from '../components/jewelry/Repair';
import Profile from '../components/user/Profile';
import MinedGemForm from '../components/minedGem/MinedGemForm';
import MinedGemMarket from '../components/minedGem/MinedGemMarket';
import GemMarket from '../components/gem/GemMarket';
import JewMarket from '../components/jewelry/JewMarket';
import OwnedByUser from '../components/user/OwnedByUser';
import GemSelectingForm from '../components/gem/GemSelectingForm';
import GemDetails from '../components/gem/GemDetails';
import JewDetails from '../components/jewelry/JewDetails';
import JewProcessing from '../components/jewelry/JewProcessing';
import JewChangeGem from '../components/jewelry/JewChangeGem';
import JewelryForm from '../components/jewelry/JewelryForm';
import LogIn from '../components/user/LogIn';
import ProtectedRoute from '../ProtectedRoute';  // Használjuk az elérési utat

const AppRoutes = ({ state, gemMining, gemSelecting, purchaseGem, markNewOwner, markGemAsSelected, processingGem, markGemAsUsed, polishGem, jewelryMaking, buyJewelry, refreshPage, transferGemOwnership, updateGem,markedAsFinished, markedAsSale, replaceGem, addForRepair, returnToOwner, markGemAsReplaced }) => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <LogIn />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/loggedin" 
        element={
          <ProtectedRoute>
            <LoggedIn 
              account={state.account} 
            />
          </ProtectedRoute>
        } 
      />
      <Route 
          path="/repair/:id" 
          element={
            <ProtectedRoute>
              <Repair 
                selectedGems={state.selectedGems} 
                minedGems={state.minedGems} 
                jewelry={state.jewelry} 
                jewelryContract={state.makeJew} 
                account={state.account} 
                selectingContract={state.gemstroneSelecting} 
                replaceGem={replaceGem} 
              />
            </ProtectedRoute>
          }
        />

      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile 
              userInfo={state.userInfo} 
              ownedJewelryCount={state.ownedJewelryCount} 
              cuttedGemCount={state.cuttedGemCount} 
              ownedMinedGemCount={state.ownedMinedGemCount} 
              ownedMadeJewelryCount={state.ownedMadeJewelryCount} 
            />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/addMinedGem" 
        element={
          <ProtectedRoute>
            <MinedGemForm 
              gemMining={gemMining} 
            />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/minedGemMarket" 
        element={
          <ProtectedRoute>
            <MinedGemMarket 
              minedGems={state.minedGems} 
              account={state.account} 
              markNewOwner={markNewOwner} 
            />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/gemMarket" 
        element={
          <ProtectedRoute>
            <GemMarket 
              selectedGems={state.selectedGems} 
              transferGemOwnership={transferGemOwnership} 
              />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/jewMarket" 
        element={
          <ProtectedRoute>
            <JewMarket 
              jewelry={state.jewelry} 
              account={state.account} 
              buyJewelry={buyJewelry} 
            />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ownMinedGems" 
        element={
          <ProtectedRoute>
            <OwnedByUser 
              minedGems={state.minedGems} 
              selectedGems={state.selectedGems} 
              jewelry={state.jewelry} 
              account={state.account} 
              purchaseGem={purchaseGem} 
              markedAsFinished={markedAsFinished} 
              markedAsSale={markedAsSale} 
              polishGem={polishGem} 
              addForRepair={addForRepair}
              returnToOwner={returnToOwner}
            />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gem-select/:id" 
        element={
          <ProtectedRoute>
            <GemSelectingForm 
              gemSelecting={gemSelecting} 
              markGemAsSelected={markGemAsSelected}
            />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gem-details/:id" 
        element={
            <GemDetails 
              selectedGems={state.selectedGems} 
              minedGems={state.minedGems} 
              gemSelecting={state.gemSelecting} 
              jewelryContract={state.makeJew} 
              gemstoneSelectingContract={state.gemstroneSelecting} 
              gemstoneExtractionContract={state.gemstroneExtraction} 
            />
        } 
      />
      <Route 
        path="/jewelry-details/:id" 
        element={
          <JewDetails 
            selectedGems={state.selectedGems} 
            minedGems={state.minedGems} 
            jewelry={state.jewelry} 
            gemSelecting={state.gemSelecting} 
            jewelryContract={state.makeJew} 
            gemstoneSelectingContract={state.gemstroneSelecting} 
            gemstoneExtractionContract={state.gemstroneExtraction} 
          />
        } 
      />
      <Route 
        path="/jewelry-processing/:id" 
        element={
          <ProtectedRoute>
            <JewProcessing 
              selectedGems={state.selectedGems} 
              updateGem={updateGem} 
              markGemAsUsed={markGemAsUsed} 
              account={state.account} 
              minedGems={state.minedGems} 
              jewelry={state.jewelry} 
              jewelryContract={state.makeJew} 
            />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/repair/:id/change-gem/:oldGemId" 
        element={
          <ProtectedRoute>
            <JewChangeGem 
              selectedGems={state.selectedGems} 
              markGemAsUsed={markGemAsUsed} 
              jewelryContract={state.makeJew} 
              account={state.account} 
              replaceGem={replaceGem} 
              markGemAsReplaced={markGemAsReplaced}
            />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/jewelry-making/gem/:id" 
        element={
          <ProtectedRoute>
            <JewelryForm 
              jewelryMaking={jewelryMaking} 
              markGemAsUsed={markGemAsUsed} 
            />
            
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;