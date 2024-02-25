import React, { ReactNode, useContext, useState } from "react";
import { createContext } from "react";
import { Theme, ThemeContextType } from "../../misc/type";

const ThemeContext = createContext<ThemeContextType>({
   theme: "bright",
   toggleTheme: () => {}
})

export default function ThemeProvider({ children }: { children: ReactNode}) {
   const [theme, setTheme] = useState<Theme>("bright");

   const toggleTheme = () => {
      setTheme((prevTheme) => (prevTheme === "bright" ? "dark" : "bright"));
   }

   return (
      <ThemeContext.Provider value={{ toggleTheme, theme }}>
         {children}
      </ThemeContext.Provider>
   );
}

export const useTheme = () => useContext(ThemeContext);
