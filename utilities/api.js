export function get(url, data) {
    return callRestAPi('GET', url, data);
}

export function post(url, data) {
    return callRestAPi('POST', url, data);
}

let callRestAPi = (type, url, data) => {
    return new Promise(function (resolve, reject) {
        let options = {
            method: type,
            body: data ? JSON.stringify(data) : null,
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        type === 'GET' && delete options.body;

        fetch(url, options)
            .then(response => {
                resolve(response.json());
            })
            .catch(err => {
                reject(err);
            });
    });
};