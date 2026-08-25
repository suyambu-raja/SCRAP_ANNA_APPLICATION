import React, { useState, createContext, useContext } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import JoinModal from '../common/JoinModal';

export const ModalContext = createContext({
  openJoinModal: (role) => {}
});

export const useJoinModal = () => useContext(ModalContext);

export default function Layout({ children }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('household');

  const openJoinModal = (role = 'household') => {
    setSelectedRole(role);
    setModalOpen(true);
  };

  const closeJoinModal = () => {
    setModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{ openJoinModal }}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar onOpenJoinModal={() => openJoinModal('household')} />
        <main style={{ flex: '1 0 auto' }}>
          {children}
        </main>
        <Footer onOpenJoinModal={() => openJoinModal('merchant')} />
        <ScrollToTop />
        <JoinModal 
          isOpen={modalOpen} 
          onClose={closeJoinModal} 
          defaultRole={selectedRole} 
        />
      </div>
    </ModalContext.Provider>
  );
}
