/** History Data structure sample
 *
 * {
 *     "123": [
 *         {
 *             data: "Content"
 *         },
 *         {
 *             data: "Content"
 *         }
 *     ]
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

export function getHistoryCount(){
    const history = getHistoryInstance();
    return Object.keys(history)?.length || 0;
}

export function createSessionSnapshot(sessionId: string, data?: string){
    const history = getHistoryInstance();
    history[sessionId] = history[sessionId] || [];
    const lastData = history[sessionId][history[sessionId].length - 1];
    if (data !== undefined && lastData !== data) {
        history[sessionId].push(data);
    }
    updateHistory(history);
}
