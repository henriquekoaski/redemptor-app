import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SignUpData {
  email: string;
  name: string;
  birthdate: Date | null;
  gender: string;
  genderCustom?: string;
  password: string;
}

interface SignUpContextType {
  signUpData: SignUpData;
  updateSignUpData: (data: Partial<SignUpData>) => void;
  resetSignUpData: () => void;
}

const initialSignUpData: SignUpData = {
  email: '',
  name: '',
  birthdate: null,
  gender: '',
  genderCustom: undefined,
  password: '',
};

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export const SignUpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [signUpData, setSignUpData] = useState<SignUpData>(initialSignUpData);

  const updateSignUpData = (data: Partial<SignUpData>) => {
    setSignUpData((prev) => ({ ...prev, ...data }));
  };

  const resetSignUpData = () => {
    setSignUpData(initialSignUpData);
  };

  return (
    <SignUpContext.Provider value={{ signUpData, updateSignUpData, resetSignUpData }}>
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = () => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error('useSignUp must be used within a SignUpProvider');
  }
  return context;
};

