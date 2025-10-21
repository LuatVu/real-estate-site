export function transformSearchRequest(sr: any) {
    let searchRequestStr = 'query=' + sr.query;
    if (sr.minPrice) {
        searchRequestStr += '&minPrice=' + sr.minPrice;
    }
    if (sr.maxPrice) {
        searchRequestStr += '&maxPrice=' + sr.maxPrice;
    }
    if (sr.minAcreage) {
        searchRequestStr += '&minAcreage=' + sr.minAcreage;
    }
    if (sr.maxAcreage) {
        searchRequestStr += '&maxAcreage=' + sr.maxAcreage;
    }
    if (sr.cityCode) {
        searchRequestStr += '&cityCode=' + sr.cityCode;
    }
    if (sr.typeCodes && sr.typeCodes.length > 0) {
        searchRequestStr += '&typeCodes=' + sr.typeCodes?.join(",");
    }
    if (sr.wardCodes && sr.wardCodes.length > 0) {
        searchRequestStr += '&wardCodes=' + sr.wardCodes?.join(",");
    }
    if(sr.transactionType) {
        searchRequestStr += '&transactionType=' + sr.transactionType;
    }
    return searchRequestStr;
}

export function extractSearchRequest(searchParam: any) {
    const body = {
        query: searchParam.get('query'), 
        minPrice: searchParam.get('minPrice'), 
        maxPrice: searchParam.get('maxPrice'),
        minAcreage: searchParam.get('minAcreage'), 
        maxAcreage: searchParam.get('maxAcreage'),
        cityCode: searchParam.get('cityCode'),
        typeCodes: searchParam.get('typeCodes')?.split(","),
        wardCodes: searchParam.get('wardCodes')?.split(","),
        transactionType: searchParam.get('transactionType')
    };
    return body;
}