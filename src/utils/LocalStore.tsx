/** History Data structure sample
 *
 * {
 *     "123": {
 *         users: ["User1", "User2"],
 *         data: ["data1", "data2"]
 *     }
 * }
 * **/

function getHistoryInstance(){
    const history = localStorage.getItem("history");
    if (history) {
        return JSON.parse(history);
    } else {
        updateHistory({});
    }
    return {};
}

function updateHistory(historyData){
    localStorage.setItem("history", JSON.stringify(historyData))
}

export function getHistoryList(sessionId){
    const history = getHistoryInstance();
    return history[sessionId].data;
}

export function getHistoryCount(){
    const history = getHistoryInstance();
    return Object.keys(history)?.length || 0;
}

export function getAllHistory(){
    const history = getHistoryInstance();
    return Object.keys(history).sort().reverse();
}

export function createSessionSnapshot(sessionId: string, data?: string){
    const history = getHistoryInstance();
    history[sessionId] = history[sessionId] || {data: []};
    const lastData = history[sessionId][history[sessionId].length - 1];
    if (data !== undefined && lastData !== data) {
        history[sessionId].data.push(data);
    }
    updateHistory(history);
}
