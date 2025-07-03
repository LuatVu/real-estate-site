export function transformSearchRequest(sr: any){
    let searchRequestStr = 'query=' + sr.query;
        if (sr.priceRange && sr.priceRange[0]) {
            searchRequestStr += '&minPrice=' + sr.priceRange[0];
        }
        if (sr.priceRange && sr.priceRange[1]) {
            searchRequestStr += '&maxPrice=' + sr.priceRange[1];
        }
        if (sr.acreageRange && sr.acreageRange[0]) {
            searchRequestStr += '&minAcreage=' + sr.acreageRange[0];
        }
        if (sr.acreageRange && sr.acreageRange[1]) {
            searchRequestStr += '&maxAcreage=' + sr.acreageRange[1];
        }
        if (sr.city && sr.city?.code) {
            searchRequestStr +=  '&city=' + sr.city?.code;
        }
        if (sr.propertyTypes && sr.propertyTypes.length> 0) {
            searchRequestStr +=  '&typeCodes='+ sr.propertyTypes?.map((e: any) => e.value).join(",");
        }
        if (sr.districts && sr.districts.length > 0) {
            searchRequestStr +=  '&wardCodes=' + sr.districts?.map((e: any) => e.value).join(",");
        }
        return searchRequestStr;
}