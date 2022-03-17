window.onload = function() {
    const request = GetRequest();
    console.log(request);
};

function GetRequest() {
    const url = location.href; //获取url中"?"符后的字串
    console.log(url);
    const theRequest = {};
    const arr = url.split("?");
    if( arr.length === 0 ) {
        return theRequest;
    }
    const block = arr[arr.length-1];
    let strs = block.split("&");
    for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
    }
    return theRequest;
}
