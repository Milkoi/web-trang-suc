import React, { createContext, useContext, useState } from 'react';

interface VoucherContextType {
  isVoucherOpen: boolean;
  openVoucher: () => void;
  closeVoucher: () => void;
}

const VoucherContext = createContext<VoucherContextType | undefined>(undefined);

export const VoucherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);

  const openVoucher = () => setIsVoucherOpen(true);
  const closeVoucher = () => setIsVoucherOpen(false);

  return (
    <VoucherContext.Provider value={{ isVoucherOpen, openVoucher, closeVoucher }}>
      {children}
    </VoucherContext.Provider>
  );
};

export const useVouchers = () => {
  const context = useContext(VoucherContext);
  if (!context) throw new Error('useVouchers must be used within a VoucherProvider');
  return context;
};
