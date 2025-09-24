import moment from "moment";



function formatDate(date) {
    const formatStr = "M/D/YYYY h:mm a";
    date = new Date(date).getTime();
    return moment(date).format(formatStr);
};


function formatNumber(number) {
    number = Number(number);
    if (number < 1000) {
        return number;
    }

    const truncatedNum = Math.trunc(Math.floor(number / 100));
    let finalNum  = truncatedNum / 10;
    if (Math.trunc(finalNum) === finalNum) {
        finalNum = Math.trunc(finalNum);
    }
    return `${finalNum}k`;
};



export {
    formatDate,
    formatNumber
};
