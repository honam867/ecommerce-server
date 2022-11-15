const dot = require('dot-object');

dot.keepArray = true;

async function updateDoc(doc, data) {
    const dotObj = dot.dot(data);
    doc.set(dotObj);
    await doc.save({
        validateModifiedOnly: true,
    });
    return doc;
}

module.exports = {
    updateDoc,
};
