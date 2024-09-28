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

const AppRoutes = ({ state, gemMining, gemSelecting, purchaseGem, markNewOwner, markGemAsSelected, processingGem, markGemAsUsed, polishGem, jewelryMaking, buyJewelry, refreshPage, transferGemOwnership, updateGem,markedAsFinished, markedAsSale, replaceGem, addForRepair, returnToOwner }) => {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/loggedin" element={<ProtectedRoute><LoggedIn account={state.account} /></ProtectedRoute>} />
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

      <Route path="/profile" element={<ProtectedRoute><Profile userInfo={state.userInfo} ownedJewelryCount={state.ownedJewelryCount} cuttedGemCount={state.cuttedGemCount} ownedMinedGemCount={state.ownedMinedGemCount} ownedMadeJewelryCount={state.ownedMadeJewelryCount} /></ProtectedRoute>} />
      <Route 
        path="/addMinedGem" 
        element={<ProtectedRoute><MinedGemForm gemMining={gemMining} /></ProtectedRoute>} 
      />
      <Route 
        path="/minedGemMarket" 
        element={
          <ProtectedRoute>
            <MinedGemMarket 
              minedGems={state.minedGems} 
              selectedGems={state.selectedGems} 
              jewelry={state.jewelry} 
              account={state.account} 
              purchaseGem={purchaseGem}  // Nem state.purchaseGem
              sellGem={state.sellGem} 
              markNewOwner={markNewOwner}  // Nem state.markNewOwner
              markGemAsUsed={state.markGemAsUsed} 
              polishGem={state.polishGem} 
            />
          </ProtectedRoute>
        }
      />

      <Route 
            path="/gemMarket" 
            element={
              <ProtectedRoute>
                <GemMarket 
                  minedGems={state.minedGems} 
                  selectedGems={state.selectedGems} 
                  jewelry={state.jewelry} 
                  gemMining={state.gemMining} 
                  gemSelecting={state.gemSelecting} 
                  purchaseGem={state.purchaseGem} 
                  processingGem={state.processingGem} 
                  markNewOwner={state.markNewOwner} 
                  markGemAsUsed={state.markGemAsUsed} 
                  account={state.account} 
                  sellGem={state.sellGem} 
                  polishGem={state.polishGem} 
                  transferGemOwnership={transferGemOwnership} 
                  />
              </ProtectedRoute>} 
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
              </ProtectedRoute>} />
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
                  sellGem={state.sellGem} 
                  markGemAsSelected={markGemAsSelected} 
                  markGemAsUsed={markGemAsUsed} 
                  markedAsFinished={markedAsFinished} 
                  markedAsSale={markedAsSale} 
                  polishGem={polishGem} 
                  addForRepair={addForRepair}
                  returnToOwner={returnToOwner}
                />
              </ProtectedRoute>
            } 
          />
      <Route path="/gem-select/:id" element={<ProtectedRoute><GemSelectingForm gemSelecting={gemSelecting} /></ProtectedRoute>} />
      <Route path="/gem-details/:id" element={<ProtectedRoute><GemDetails selectedGems={state.selectedGems} minedGems={state.minedGems} gemSelecting={state.gemSelecting} account={state.account} jewelryContract={state.makeJew} gemstoneSelectingContract={state.gemstroneSelecting} gemstoneExtractionContract={state.gemstroneExtraction} /></ProtectedRoute>} />
      <Route path="/jew-details/:id" element={<JewDetails selectedGems={state.selectedGems} minedGems={state.minedGems} jewelry={state.jewelry} gemSelecting={state.gemSelecting} account={state.account} jewelryContract={state.makeJew} gemstoneSelectingContract={state.gemstroneSelecting} gemstoneExtractionContract={state.gemstroneExtraction} />} />
      <Route 
        path="/jew-processing/:id" 
        element={
          <ProtectedRoute>
            <JewProcessing 
              selectedGems={state.selectedGems} 
              updateGem={updateGem} 
              markGemAsUsed={markGemAsUsed} 
              minedGems={state.minedGems} 
              jewelry={state.jewelry} 
              jewelryContract={state.makeJew} 
            />
          </ProtectedRoute>} 
      />
      <Route 
          path="/repair/:id/change-gem/:oldGemId" 
          element={
            <ProtectedRoute>
              <JewChangeGem 
                selectedGems={state.selectedGems} 
                updateGem={updateGem} 
                markGemAsUsed={markGemAsUsed} 
                minedGems={state.minedGems} 
                jewelry={state.jewelry} 
                jewelryContract={state.makeJew} 
                account={state.account} 
                selectingContract={state.gemstroneSelecting} 
                replaceGem={replaceGem} 
              />
            </ProtectedRoute>} />
      <Route 
          path="/jewelry-making/gem/:id" 
          element={
            <ProtectedRoute>
              <JewelryForm 
                jewelryMaking={jewelryMaking} 
                markGemAsUsed={state.markGemAsUsed} 
              />
              
            </ProtectedRoute>} 
      />
    </Routes>
  );
};

export default AppRoutes;
