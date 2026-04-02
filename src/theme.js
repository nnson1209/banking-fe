import { createTheme } from "@mui/material/styles";

// Modern dark-slate theme (not pure black) inspired by the provided MUI templates.
const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#60a5fa",
        },
        success: {
            main: "#4ade80",
        },
        background: {
            default: "#0b1220",
            paper: "#111f3a",
        },
        text: {
            primary: "#e7eeff",
            secondary: "#a9b7d6",
        },
        divider: "rgba(148, 163, 184, 0.18)",
    },
    shape: {
        borderRadius: 8,
    },
    typography: {
        fontFamily: [
            "ui-sans-serif",
            "system-ui",
            "Segoe UI",
            "Roboto",
            "Helvetica Neue",
            "Arial",
            "Noto Sans",
            "Liberation Sans",
            "sans-serif",
        ].join(","),
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "@keyframes mui-auto-fill": {
                    from: { display: "block" },
                },
                "@keyframes mui-auto-fill-cancel": {
                    from: { display: "block" },
                },
                body: {
                    backgroundColor: "#0b1220",
                    backgroundImage:
                        "radial-gradient(980px circle at 18% 14%, rgba(96,165,250,0.22) 0%, transparent 60%)," +
                        "radial-gradient(900px circle at 82% 86%, rgba(74,222,128,0.14) 0%, transparent 60%)," +
                        "radial-gradient(1200px circle at 50% 105%, rgba(255,255,255,0.06) 0%, transparent 55%)",
                },
                "input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px rgba(17,31,58,0.78) inset",
                    WebkitTextFillColor: "#e7eeff",
                    caretColor: "#e7eeff",
                    animationName: "mui-auto-fill",
                    animationDuration: "10ms",
                    transition: "background-color 9999s ease-out 0s",
                },
                ".MuiInputBase-input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px rgba(17,31,58,0.78) inset",
                    WebkitTextFillColor: "#e7eeff",
                    caretColor: "#e7eeff",
                    animationName: "mui-auto-fill",
                    animationDuration: "10ms",
                    transition: "background-color 9999s ease-out 0s",
                },
                "input:not(:-webkit-autofill)": {
                    animationName: "mui-auto-fill-cancel",
                    animationDuration: "10ms",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 800,
                    borderRadius: 10,
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: 9,
                    backgroundColor: `rgba(96, 165, 250, 0.05)`,
                    transition: "background-color 120ms ease",
                    "&:hover": {
                        backgroundColor: `rgba(96, 165, 250, 0.065)`,
                    },
                    "&.Mui-focused": {
                        backgroundColor: `rgba(96, 165, 250, 0.075)`,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(148, 163, 184, 0.22)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(148, 163, 184, 0.32)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                    },
                }),
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
            },
        },
    },
});

export default theme;
