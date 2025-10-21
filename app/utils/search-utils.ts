interface SearchRequest {
  minPrice?: number;
  maxPrice?: number;
  minAcreage?: number;
  maxAcreage?: number;
  typeCodes?: string[];
  cityCode?: string;
  wardCodes?: string[];
  transactionType?: string;
  query?: string;
}

/**
 * Counts the number of active filter parameters in a search request
 * @param searchRequest - The search request object to count parameters for
 * @returns The number of active filter parameters
 */
export const countParamNum = (searchRequest: SearchRequest): number => {
  let count: number = 0;
  
  // Check price range (count +1 if at least one of minPrice or maxPrice is present)
  if ((searchRequest.minPrice !== undefined && searchRequest.minPrice !== null) ||
      (searchRequest.maxPrice !== undefined && searchRequest.maxPrice !== null)) {
    count += 1;
  }
  
  // Check acreage range (count +1 if at least one of minAcreage or maxAcreage is present)
  if ((searchRequest.minAcreage !== undefined && searchRequest.minAcreage !== null) ||
      (searchRequest.maxAcreage !== undefined && searchRequest.maxAcreage !== null)) {
    count += 1;
  }
  
  // Check typeCodes
  if (searchRequest.typeCodes !== undefined && searchRequest.typeCodes !== null && searchRequest.typeCodes.length > 0) {
    count += 1;
  }
  
  // Check cityCode (commented out in both implementations)
  // if (searchRequest.cityCode !== undefined && searchRequest.cityCode !== null && searchRequest.cityCode !== '') {
  //   count += 1;
  // }
  
  // Check wardCodes (array)
  if (searchRequest.wardCodes && Array.isArray(searchRequest.wardCodes) && searchRequest.wardCodes.length > 0) {
    count += 1;
  }
  
  // Check transactionType
  if (searchRequest.transactionType !== undefined && searchRequest.transactionType !== null && searchRequest.transactionType !== '') {
    count += 1;
  }
  
  return count;
};