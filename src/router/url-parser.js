const UrlParser = {
    parseActiveUrl() {
        const url = location.hash.slice(2) || '/';

        const urlParts = url.split('/');
        
        return {
            resource: urlParts[0] || null,
            id: urlParts[1] || null,
            verb: urlParts[2] || null,
        };
    },

    combineUrl(resource = '', id = '', verb = '') {
        let url = `/${resource}`;
        if (id) url += `/${id}`;
        if (verb) url += `/${verb}`;
        return url;
    },
};

export default UrlParser;