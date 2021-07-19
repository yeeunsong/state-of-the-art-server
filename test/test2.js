function makeRequest(location) {
    return new Promise((resolve, reject) => {
        console.log('Making requests to ${location}')
        if (location === 'Google') {
            resolve('Google says hi')
        } else {
            reject('Se can only talk to Google')
        }
    });
}

function processRequest(Response) {
    return new Promise((Resolve, reject) => {
        console.log('Processing response')
        resolve('Extra information+${response}')
    })
}


makeRequest('Google').then(response => {
    console.log('REsponse Received')
    return processRequest(response)
}).then(processedResponse => {
    console.log(processedResponse)
}).catch(err => {
    console.log(err)
})