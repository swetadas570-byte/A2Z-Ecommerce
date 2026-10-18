import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme =
            localStorage.getItem("a2z-theme");

        return savedTheme === "dark";
    });

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");

            localStorage.setItem(
                "a2z-theme",
                "dark"
            );
        } else {
            document.body.classList.remove(
                "dark-mode"
            );

            localStorage.setItem(
                "a2z-theme",
                "light"
            );
        }
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode((currentMode) => !currentMode);
    };

    return (
        <ThemeContext.Provider
            value={{
                darkMode,
                toggleTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    return useContext(ThemeContext);
};