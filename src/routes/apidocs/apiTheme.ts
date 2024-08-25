export const svelteThemeCss = `
/* basic theme */
.dark-mode {
  --scalar-background-1: transparent;
}

.scalar-app .scalar-app-layout[data-v-fdd52d50] {
    background-color: rgba(0, 0, 0, 1);
    backdrop-filter: blur(10px);
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 750px;
    overflow: auto; /* Handle content overflow */
    z-index: 1001; /* Ensure it appears above other content */
    border-radius: 8px; /* Optional: Rounded corners */
    padding: 20px;
    color: white;
}
`
