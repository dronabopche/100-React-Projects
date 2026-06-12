import React from 'react'

export const TechIcons = {
  python: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11.895 2C8.364 2 8.625 3.53 8.625 3.53V5.1H12.05V5.59H7.135C5.178 5.59 4 7.027 4 8.94c0 1.914 1.583 3.328 3.54 3.328h1.1v-1.528s-.066-1.83 1.802-1.83H15.11c1.868 0 1.764-1.636 1.764-1.636V3.882c0-1.787-1.47-3.882-4.978-3.882zm-1.848 1.18c.365 0 .66.295.66.66a.662.662 0 01-.66.661.662.662 0 01-.66-.66c0-.366.295-.66.66-.66z" fill="#3776AB"/>
      <path d="M12.105 22c3.531 0 3.27-1.53 3.27-1.53V18.9h-3.424v-.49h4.914c1.957 0 3.135-1.437 3.135-3.35 0-1.914-1.583-3.328-3.54-3.328h-1.1v1.528s.066 1.83-1.802 1.83H8.89c-1.868 0-1.764 1.636-1.764 1.636v3.34c0 1.787 1.47 3.882 4.979 3.882zm1.848-1.18a.662.662 0 01-.66-.66c0-.365.295-.66.66-.66.366 0 .66.295.66.66a.662.662 0 01-.66.66z" fill="#FFE873"/>
    </svg>
  ),
  pytorch: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.34.27 2.62.75 3.79l2.8-5.32c.57-1.08 1.69-1.77 2.92-1.77h4.06c1.83 0 3.32-1.49 3.32-3.32V4.93C14.73 3.11 13.48 2 12 2zm3.93 11.23c-.57 1.08-1.69 1.77-2.92 1.77H8.95c-1.83 0-3.32 1.49-3.32 3.32v2.45c1.12.82 2.49 1.23 3.93 1.23 5.52 0 10-4.48 10-10 0-1.34-.27-2.62-.75-3.79l-2.8 5.32z" fill="#EE4C2C"/>
    </svg>
  ),
  tensorflow: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm7.5 14.1L12 20.3l-7.5-4.2V8.9l7.5 4.2v7.2l7.5-4.2V8.9l-7.5-4.2 7.5 4.2v7.2z" fill="#FF6F00"/>
    </svg>
  ),
  numpy: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2L3 7.2v9.6L12 22l9-5.2V7.2L12 2zm-1.5 16.5V14l-4.5-2.6v5.1l4.5 2.5zm0-6V7.2L6 9.8v5.2l4.5-2.6zm6 6V14l-4.5-2.6v5.1l4.5 2.5zm0-6V7.2l-4.5 2.6v5.2l4.5-2.6z" fill="#013243"/>
    </svg>
  ),
  pandas: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7V7h2v10zm4-4h-2V7h2v6zm4 4h-2v-6h2v6z" fill="#150458"/>
    </svg>
  ),
  huggingface: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="10" fill="#FFD21E"/>
      <circle cx="8" cy="10" r="1.5" fill="#000"/>
      <circle cx="16" cy="10" r="1.5" fill="#000"/>
      <path d="M7 14.5c1 2 3 3 5 3s4-1 5-3" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  langchain: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8 4a4 4 0 00-4 4v8a4 4 0 008 0V8a4 4 0 00-4-4zm8 8a4 4 0 00-4 4v4a4 4 0 008 0v-4a4 4 0 00-4-4z" fill="#1C3D5A"/>
      <path d="M12 10a2 2 0 110-4 2 2 0 010 4z" fill="#38A169"/>
    </svg>
  ),
  jupyter: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.29 14.29L11 12.01V7h2v4.17l3.71 3.71-1.42 1.41z" fill="#F37626"/>
    </svg>
  ),
  react: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 8.7c-3.1 0-5.7 1.5-5.7 3.3s2.6 3.3 5.7 3.3 5.7-1.5 5.7-3.3-2.6-3.3-5.7-3.3z" fill="none" stroke="#61DAFB" strokeWidth="1.2"/>
      <path d="M12 8.7c-3.1 0-5.7 1.5-5.7 3.3s2.6 3.3 5.7 3.3 5.7-1.5 5.7-3.3-2.6-3.3-5.7-3.3z" fill="none" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(60 12 12)"/>
      <path d="M12 8.7c-3.1 0-5.7 1.5-5.7 3.3s2.6 3.3 5.7 3.3 5.7-1.5 5.7-3.3-2.6-3.3-5.7-3.3z" fill="none" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(-60 12 12)"/>
      <circle cx="12" cy="12" r="1.5" fill="#61DAFB"/>
    </svg>
  ),
  nextjs: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="10" fill="#000"/>
      <path d="M17 17.5l-5.5-7.5V16h-1.5V8h1.5l5.5 7.5V8H18.5v9.5H17z" fill="#FFF"/>
    </svg>
  ),
  typescript: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="24" height="24" rx="3" fill="#3178C6"/>
      <path d="M11.5 17.2h-2V9.8H6.7V8.2h7.6v1.6h-2.8v7.4zm7.3-2.3c0 1.6-1.3 2.5-3.3 2.5-1.5 0-2.8-.6-3.4-1.3l1.1-1.3c.5.5 1.3.9 2.2.9.9 0 1.4-.4 1.4-1 0-.6-.5-.9-1.6-1.3-1.6-.6-2.6-1.3-2.6-2.7 0-1.5 1.2-2.5 3-2.5 1.3 0 2.3.5 2.9 1.1l-1.1 1.2c-.4-.4-1.1-.7-1.8-.7-.8 0-1.2.3-1.2.8 0 .5.4.7 1.4 1.1 1.8.6 2.8 1.3 2.8 2.8z" fill="#FFF"/>
    </svg>
  ),
  nodejs: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2L4.5 6.3v9.4L12 20l7.5-4.3V6.3L12 2zm5.7 12.9L12 18.2l-5.7-3.3V7.7L12 4.4l5.7 3.3v6.52z" fill="#339933"/>
    </svg>
  ),
  javascript: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="24" height="24" rx="3" fill="#F7DF1E"/>
      <path d="M11.8 17.2c0 1-.7 1.6-1.8 1.6-1.1 0-1.7-.5-1.9-1.2l1.1-.6c.1.4.3.7.8.7.4 0 .6-.2.6-.5V10h1.2v7.2zm4.3 0c.2.5.6.8 1.2.8.5 0 .9-.3.9-.7 0-.5-.4-.7-1.1-.9-1.2-.4-2-.8-2-2.1 0-1.2 1-2.1 2.3-2.1 1.2 0 1.9.6 2.1 1.4l-1.1.6c-.1-.4-.4-.7-.9-.7-.4 0-.7.2-.7.5 0 .4.3.6 1 .8 1.3.4 2.1.8 2.1 2.2 0 1.3-1 2.2-2.4 2.2-1.4 0-2.3-.7-2.6-1.7l1.2-.6z" fill="#000000"/>
    </svg>
  ),
  js: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="24" height="24" rx="3" fill="#F7DF1E"/>
      <path d="M11.8 17.2c0 1-.7 1.6-1.8 1.6-1.1 0-1.7-.5-1.9-1.2l1.1-.6c.1.4.3.7.8.7.4 0 .6-.2.6-.5V10h1.2v7.2zm4.3 0c.2.5.6.8 1.2.8.5 0 .9-.3.9-.7 0-.5-.4-.7-1.1-.9-1.2-.4-2-.8-2-2.1 0-1.2 1-2.1 2.3-2.1 1.2 0 1.9.6 2.1 1.4l-1.1.6c-.1-.4-.4-.7-.9-.7-.4 0-.7.2-.7.5 0 .4.3.6 1 .8 1.3.4 2.1.8 2.1 2.2 0 1.3-1 2.2-2.4 2.2-1.4 0-2.3-.7-2.6-1.7l1.2-.6z" fill="#000000"/>
    </svg>
  ),
  mongodb: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2s-4.5 4.5-4.5 9.5c0 3.2 2 5.5 4.5 7.5 2.5-2 4.5-4.3 4.5-7.5C16.5 6.5 12 2 12 2zm-.5 15.8c-1.5-1.5-2.8-3.3-2.8-5.3 0-3.3 2.8-6.3 2.8-6.3V17.8zm1 0V6.2s2.8 3 2.8 6.3c0 2-1.3 3.8-2.8 5.3z" fill="#47A248"/>
    </svg>
  ),
  express: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="24" height="24" rx="3" fill="#303030"/>
      <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fill="#FFF" fontFamily="Arial" fontSize="9" fontWeight="bold">EX</text>
    </svg>
  ),
  figma: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8.5 12C8.5 10.1 10.1 8.5 12 8.5h3.5V12H12c-1.9 0-3.5-1.6-3.5-3.5z" fill="#0ACF83"/>
      <path d="M8.5 5C8.5 3.1 10.1 1.5 12 1.5h3.5V5H12c-1.9 0-3.5-1.6-3.5-3.5z" fill="#F24E1E"/>
      <path d="M15.5 5C15.5 3.1 17.1 1.5 19 1.5S22.5 3.1 22.5 5s-1.6 3.5-3.5 3.5h-3.5V5z" fill="#FF7262"/>
      <path d="M8.5 19c0-1.9 1.6-3.5 3.5-3.5h3.5v3.5c0 1.9-1.6 3.5-3.5 3.5s-3.5-1.6-3.5-3.5z" fill="#1ABCFE"/>
      <path d="M15.5 8.5c1.9 0 3.5 1.6 3.5 3.5s-1.6 3.5-3.5 3.5H12V12h3.5V8.5z" fill="#A259FF"/>
    </svg>
  ),
  streamlit: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2L2 22h20L12 2zm0 5.5l6 12H6l6-12zm-3.5 7h7v2h-7v-2z" fill="#FF4B4B"/>
    </svg>
  ),
  git: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M22.5 12.3c.3.3.3.8 0 1.1l-9.1 9.1c-.3.3-.8.3-1.1 0L3.2 13.4c-.3-.3-.3-.8 0-1.1L12.3 3.2c.3-.3.8-.3 1.1 0l9.1 9.1z" fill="#F05032"/>
      <circle cx="12" cy="12" r="2.5" fill="#FFF"/>
      <circle cx="15.5" cy="8.5" r="1.5" fill="#FFF"/>
      <path d="M12 12v3.5" stroke="#FFF" strokeWidth="1.5"/>
    </svg>
  ),
  github: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="#FFF"/>
    </svg>
  ),
  vercel: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2L2 22h20L12 2z" fill="#FFF"/>
    </svg>
  ),
  vscode: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M17.5 2L12 7.5l-4.5-4.5L2 6.5V17.5l5.5 3.5 4.5-4.5 5.5 5.5 4.5-4.5V6.5L17.5 2zM6 14.5V9.5l3.5 2.5L6 14.5z" fill="#007ACC"/>
    </svg>
  ),
  scikitlearn: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2L3 7.2v9.6L12 22l9-5.2V7.2L12 2z" fill="#F89939"/>
      <path d="M12 2v20c5-2.6 9-5.2 9-9.8V7.2L12 2z" fill="#3499CD"/>
    </svg>
  ),
  n8n: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="24" height="24" rx="5" fill="#FF6D5A"/>
      <circle cx="8" cy="8" r="2.5" fill="#FFF"/>
      <circle cx="16" cy="16" r="2.5" fill="#FFF"/>
      <path d="M8 8h5a3 3 0 013 3v5" stroke="#FFF" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  docker: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M13.962 10.42h-2.448v2.448h2.448V10.42zm2.937-2.938h-2.448v2.448h2.448V7.482zm-2.937 0h-2.448v2.448h2.448V7.482zm-2.938 0H8.576v2.448h2.448V7.482zm-2.938 0H5.637v2.448h2.448V7.482zm0 2.938H5.637v2.448h2.448V10.42zm2.938 0H8.576v2.448h2.448V10.42zm0-5.877H8.576v2.448h2.448V4.543zm5.875 5.877h-2.448v2.448h2.448V10.42zm7.042-.979c-.326-.065-.653-.131-.98-.196a6.83 6.83 0 00-.784-.131c-.326-.065-.718-.065-.98-.065h-.065c-.065-.261-.13-.588-.261-.914-.196-.457-.457-.914-.784-1.241-.392-.457-.849-.784-1.371-.98-.261-.065-.522-.131-.784-.131l-.065.065c-.065.196-.065.457-.065.718v.065c.065.261.13.588.261.914.13.326.326.653.522.914.13.196.261.326.457.522H17.48v2.448h.065c.196.065.326.065.522.13.914.261 1.632.784 2.155 1.502.522.784.718 1.698.522 2.612-.261 1.045-.98 1.894-1.894 2.416-.914.522-1.959.653-2.938.326a5.59 5.59 0 01-2.938-2.612c-.261-.457-.392-.914-.457-1.437h-9.99c-.13.588-.392 1.11-.784 1.567A5.92 5.92 0 011.8 15.642a.52.52 0 00-.13.392.51.51 0 00.326.457c1.371.457 2.742.261 3.983-.392l.196-.065c.326-.196.653-.392.98-.653.261.13.522.261.784.392 1.959.849 4.179.914 6.204.261a8.94 8.94 0 004.963-3.983c.914-1.502.98-3.199.392-4.832l-.065-.13z" fill="#2496ED"/>
    </svg>
  ),
  fastapi: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2L2 12h8v10l10-10h-8V2z" fill="#009688"/>
    </svg>
  ),
  sql: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2C6.48 2 2 4.02 2 6.5s4.48 4.5 10 4.5 10-2.02 10-4.5S17.52 2 12 2zm0 18c-5.52 0-10-2.02-10-4.5v-3c0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5v3c0 2.48-4.48 4.5-10 4.5zm0-6c-5.52 0-10-2.02-10-4.5v-3c0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5v3c0 2.48-4.48 4.5-10 4.5z" fill="#00758F"/>
    </svg>
  ),
  automation: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="#7a6448"/>
    </svg>
  ),
  machinelearning: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="5" r="2.5" fill="#c0850e"/>
      <circle cx="5" cy="12" r="2.5" fill="#c0850e"/>
      <circle cx="12" cy="19" r="2.5" fill="#c0850e"/>
      <circle cx="19" cy="12" r="2.5" fill="#c0850e"/>
      <circle cx="12" cy="12" r="2" fill="#c0850e"/>
      <line x1="5.5" y1="12" x2="11.5" y2="5" stroke="#c0850e" strokeWidth="1.5"/>
      <line x1="5.5" y1="12" x2="11.5" y2="12" stroke="#c0850e" strokeWidth="1.5"/>
      <line x1="5.5" y1="12" x2="11.5" y2="19" stroke="#c0850e" strokeWidth="1.5"/>
      <line x1="18.5" y1="12" x2="12.5" y2="5" stroke="#c0850e" strokeWidth="1.5"/>
      <line x1="18.5" y1="12" x2="12.5" y2="12" stroke="#c0850e" strokeWidth="1.5"/>
      <line x1="18.5" y1="12" x2="12.5" y2="19" stroke="#c0850e" strokeWidth="1.5"/>
    </svg>
  ),
  llms: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2c.3 2.7 2.2 4.6 4.9 4.9-2.7.3-4.6 2.2-4.9 4.9-.3-2.7-2.2-4.6-4.9-4.9 2.7-.3 4.6-2.2 4.9-4.9z" fill="#eebb2f"/>
      <path d="M6 15c.2 1.4 1.1 2.3 2.5 2.5-1.4.2-2.3 1.1-2.5 2.5-.2-1.4-1.1-2.3-2.5-2.5 1.4-.2 2.3-1.1 2.5-2.5z" fill="#eebb2f"/>
      <path d="M18 13c.2 1.4 1.1 2.3 2.5 2.5-1.4.2-2.3 1.1-2.5 2.5-.2-1.4-1.1-2.3-2.5-2.5 1.4-.2 2.3-1.1 2.5-2.5z" fill="#eebb2f"/>
    </svg>
  ),
  restapis: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5h-2v-2h2v2zm0-4h-2.5v-5H13v5z" fill="#3d2c15"/>
    </svg>
  ),
}

export default function IconRenderer({ name, className }) {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const IconComponent = TechIcons[normalized]

  const [imageError, setImageError] = React.useState(false)

  // Try to load /logos/name.svg or /logos/name.png if not errored
  if (!imageError) {
    const src = `/logos/${normalized}.png` // could also try .svg
    return (
      <img
        src={src}
        alt={name}
        className={className}
        onError={() => setImageError(true)}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    )
  }

  // Fallback to inline SVG if image doesn't exist
  if (IconComponent) {
    return <IconComponent className={className} style={{ width: '100%', height: '100%' }} />
  }

  // Default circle fallback
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: 'var(--border2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        color: 'var(--gold)'
      }}
    >
      {name.substring(0, 2).toUpperCase()}
    </div>
  )
}
