import React, { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [successModalData, setSuccessModalData] = useState(null);
  const [toast, setToast] = useState(null);

  const openAppModal = () => setIsAppModalOpen(true);
  const closeAppModal = () => setIsAppModalOpen(false);

  const openVideoModal = () => setIsVideoModalOpen(true);
  const closeVideoModal = () => setIsVideoModalOpen(false);

  const openSuccessModal = (data) => setSuccessModalData(data);
  const closeSuccessModal = () => setSuccessModalData(null);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  const closeToast = () => setToast(null);

  return (
    <ModalContext.Provider
      value={{
        isAppModalOpen,
        setIsAppModalOpen,
        openAppModal,
        closeAppModal,
        isVideoModalOpen,
        setIsVideoModalOpen,
        openVideoModal,
        closeVideoModal,
        successModalData,
        openSuccessModal,
        closeSuccessModal,
        toast,
        showToast,
        closeToast,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

