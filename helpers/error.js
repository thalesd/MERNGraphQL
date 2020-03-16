exports.errorHandler = (err) => {
    console.log('-------- ERROR --------\n' + err)
    throw err;
}