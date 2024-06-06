class coreHTTP{
    async get(url){
        const http = new Request;
        const data = await http.request(url,"GET");
        return data;
    }
    async post(url){
        const http = new Request;
        const data = await http.request(url,"POST",requestData);
        return data;
    }
    async put(url){
        const http = new Request;
        const data = await http.request(url,"PUT",requestData);
        return data;
    }
    async delete(url){
        const http = new Request;
        const response  = await http.request(url,"DELETE");
        return response;
    }
}
class Request{
    async request(url, requestType, requestData = " "){
        const options = {
            method: requestType,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(requestData)
        };
        const response = await fetch(url,options);
        if(requestType != "DELETE"){
            if(response.ok){
                return await response.json();//what is the default return type or layout
            } else{
                return (Promise.reject(`Error: failed to ${requestType} source, Error: ${response.status}`));
            }
        } else{
            if(response.ok){
                return {}; //why is your delete request no delete anything 
            } else{
                return (Promise.reject(`Error: failed to ${requestType} source, Error: ${response.status}`));
            }
        }
    }
}