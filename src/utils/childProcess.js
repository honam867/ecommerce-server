const { fork } = require('child_process');
const { ONE_MINUTE } = require('./const');

const TIME_OUT = 60 * ONE_MINUTE;

function forkMode(filePath, data) {
    const child_process = fork(filePath);
    child_process.send(data);

    return new Promise((resovle, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('Process timeout!'));
            child_process.kill('SIGINT');
        }, TIME_OUT);
        child_process.on('message', msg => {
            clearTimeout(timer);
            resovle(msg);
            child_process.kill('SIGINT');
        });
        child_process.on('error', e => {
            clearTimeout(timer);
            reject(e);
            child_process.kill('SIGINT');
        });
    });
}

module.exports = {
    fork: forkMode,
};
