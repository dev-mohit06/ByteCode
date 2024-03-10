let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];    
export const formatDate = (date) => {
    let d = new Date(date);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}