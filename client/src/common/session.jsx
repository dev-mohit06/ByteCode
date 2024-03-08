const storeInSession = (key, value) => {
    sessionStorage.setItem(key, value);
}

const lookInSession = (key) => {
    if(!sessionStorage.getItem(key)) return null;
    return sessionStorage.getItem(key);
}

const removeFromSession = (key) => {
    return sessionStorage.removeItem(key);
}

const logoutUser = () => {
    sessionStorage.clear();
}

export { storeInSession, lookInSession, removeFromSession, logoutUser };