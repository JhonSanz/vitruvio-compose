"use client";

import { useState, useEffect, createContext } from 'react';
import ToolbarApp from "./toolbarApp"
import ModalApp from './modal';

export const ThemeContext = createContext(null);
export default function Providers({ children }) {
  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [alertContent, setAlertContent] = useState(null);

  const valuesProvider = {
    isAlertOpened, setIsAlertOpened,
    alertContent, setAlertContent
  }

  useEffect(() => {
    if (alertContent !== null) setIsAlertOpened(true)
  }, [alertContent]);

  useEffect(() => {
    if (isAlertOpened === false) setAlertContent(null)
  }, [isAlertOpened]);

  return (
    <div>
      <ThemeContext.Provider value={valuesProvider}>
        <ToolbarApp />
        {children}
        <ModalApp
          isOpen={isAlertOpened}
          setIsOpen={setIsAlertOpened}
          children={alertContent}
        />
      </ThemeContext.Provider>
    </div>
  )
}