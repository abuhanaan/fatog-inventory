const styles = {
    global: {
        svg: {
            cursor: "pointer",
        },
        ".resizer": {
            position: "absolute",
            opacity: 0,
            top: 0,
            right: 0,
            h: "100%",
            w: "4px",
            bg: "#A0AEC0",
            cursor: "col-resize",
            userSelect: "none",
            touchAction: "none",
            // borderRadius: "6px",
        },
        ".resizer.isResizing": {
            bg: "#2eff31",
            opacity: 1,
        },
        "*:hover > .resizer": {
            opacity: 1,
        },
    },
};

export default styles;
